import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { buildUserPrompt } from "../ai/itineraryEngine.js";
import { MASTER_SYSTEM_PROMPT } from "../ai/masterPrompt.js";
import { enforceCostVariation } from "../ai/costVariationEngine.js";
import { generateMockItinerary } from "../ai/mockGenerator.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "../config/postgres.js";

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: MASTER_SYSTEM_PROMPT, // This forces the AI to always obey the Master Prompt
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.7,
  }
});

router.post("/generate", authenticateToken, async (req, res) => {
  try {
    let itineraryData;

    try {
      const userPrompt = buildUserPrompt(req.body);
      
      console.log("🚀 Generating with Gemini (System Instruction Mode)...");
      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up the response text in case of markdown fences
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      itineraryData = JSON.parse(text);
      itineraryData = enforceCostVariation(itineraryData);
      console.log("✅ Gemini generation successful");
    } catch (aiError) {
      console.error("⚠️ Gemini Generation failed, falling back to mock:", aiError.message);
      itineraryData = generateMockItinerary(req.body);
      itineraryData.is_mock = true;
    }

    // Save to database
    const result = await pool.query(
      'INSERT INTO itineraries (user_id, destination, start_date, end_date, total_days, travelers, itinerary_data) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, req.body.destination, req.body.startDate, req.body.endDate, req.body.totalDays, req.body.travelers, itineraryData]
    );

    const savedItinerary = result.rows[0];

    // Create notification
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type, related_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'Itinerary ready!', `Your AI-generated itinerary for ${req.body.destination} is ready`, 'itinerary', savedItinerary.id]
    ).catch(err => console.error('Error creating notification:', err));

    res.json({
      success: true,
      data: itineraryData,
      itineraryId: savedItinerary.id
    });
  } catch (error) {
    console.error("❌ Generation failed:", error);
    res.status(500).json({ success: false, error: "Generation failed. Please try again." });
  }
});

router.get("/my-itineraries", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM itineraries WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    
    res.json({ success: true, itineraries: result.rows });
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ success: false, error: "Failed to fetch itineraries" });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM itineraries WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    const itinerary = result.rows[0];
    if (!itinerary) {
      return res.status(404).json({ success: false, error: "Itinerary not found" });
    }
    
    res.json({ success: true, data: itinerary.itinerary_data });
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    res.status(500).json({ success: false, error: "Failed to fetch itinerary" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM itineraries WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Itinerary not found" });
    }
    
    res.json({ success: true, message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    res.status(500).json({ success: false, error: "Failed to delete itinerary" });
  }
});

router.patch("/:id/favorite", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE itineraries SET is_favorite = NOT is_favorite WHERE id = $1 AND user_id = $2 RETURNING is_favorite',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Itinerary not found" });
    }
    
    res.json({ success: true, isFavorite: result.rows[0].is_favorite });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ success: false, error: "Failed to update favorite status" });
  }
});

export default router;
