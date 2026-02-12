import express from "express";
import OpenAI from "openai";
import { authenticateToken } from "../middleware/auth.js";
import { buildUserPrompt } from "../ai/itineraryEngine.js";
import { MASTER_SYSTEM_PROMPT } from "../ai/masterPrompt.js";
import { enforceCostVariation } from "../ai/costVariationEngine.js";
import { generateMockItinerary } from "../ai/mockGenerator.js";
import Itinerary from "../models/ItineraryModel.js";
import Notification from "../models/NotificationModel.js";

const router = express.Router();

// Toggle between MOCK and REAL OpenAI
const USE_MOCK = true; // Set to false when OpenAI has credits

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate", authenticateToken, async (req, res) => {
  try {
    console.log("📝 Generating itinerary with data:", req.body);

    let itineraryData;

    // USE MOCK GENERATOR (works immediately without OpenAI)
    if (USE_MOCK) {
      console.log("🎭 Using MOCK generator (OpenAI disabled)");
      itineraryData = generateMockItinerary(req.body);
      console.log("✅ Mock itinerary generated successfully");
    } else {

      // REAL OpenAI (use when you have credits)
      console.log("🤖 Using REAL OpenAI");
      const userPrompt = buildUserPrompt(req.body);

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          { role: "system", content: MASTER_SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      });

      let rawContent = response.choices[0].message.content.trim();
      rawContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      itineraryData = JSON.parse(rawContent);
      itineraryData = enforceCostVariation(itineraryData);
      console.log("✅ OpenAI itinerary generated successfully");
    }

    // Save to database
    const savedItinerary = await Itinerary.create({
      userId: req.user.id,
      destination: req.body.destination,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      totalDays: req.body.totalDays,
      travelers: req.body.travelers,
      itineraryData: itineraryData
    });

    console.log("💾 Itinerary saved to database with ID:", savedItinerary._id);

    // Create notification for new itinerary
    await Notification.create({
      userId: req.user.id,
      title: 'Itinerary ready!',
      message: `Your AI-generated itinerary for ${req.body.destination} is ready`,
      type: 'itinerary',
      relatedId: savedItinerary._id
    }).catch(err => console.error('Error creating notification:', err));

    res.json({
      success: true,
      data: itineraryData,
      itineraryId: savedItinerary._id
    });
  } catch (error) {
    console.error("❌ Generation failed:", error);
    
    if (error.response) {
      return res.status(500).json({ 
        success: false,
        error: "OpenAI API error: " + error.response.data.error.message 
      });
    }

    if (error instanceof SyntaxError) {
      return res.status(500).json({ 
        success: false,
        error: "Failed to parse AI response. Please try again." 
      });
    }

    res.status(500).json({ 
      success: false,
      error: "Generation failed. Please try again." 
    });
  }
});

export default router;

// Get all user itineraries
router.get("/my-itineraries", authenticateToken, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      itineraries
    });
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch itineraries"
    });
  }
});

// Get single itinerary by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: "Itinerary not found"
      });
    }
    
    res.json({
      success: true,
      data: itinerary.itineraryData
    });
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch itinerary"
    });
  }
});

// Delete itinerary
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: "Itinerary not found"
      });
    }
    
    res.json({
      success: true,
      message: "Itinerary deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete itinerary"
    });
  }
});

// Toggle favorite
router.patch("/:id/favorite", authenticateToken, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: "Itinerary not found"
      });
    }
    
    itinerary.isFavorite = !itinerary.isFavorite;
    await itinerary.save();
    
    res.json({
      success: true,
      isFavorite: itinerary.isFavorite
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update favorite status"
    });
  }
});
