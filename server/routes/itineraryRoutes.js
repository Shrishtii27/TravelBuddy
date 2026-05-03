import express from "express";
import OpenAI from "openai";
import { authenticateToken } from "../middleware/auth.js";
import { buildUserPrompt } from "../ai/itineraryEngine.js";
import { MASTER_SYSTEM_PROMPT } from "../ai/masterPrompt.js";
import { enforceCostVariation } from "../ai/costVariationEngine.js";
import { generateMockItinerary } from "../ai/mockGenerator.js";
import pool from "../config/postgres.js";

const router = express.Router();

const USE_MOCK = false; 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate", authenticateToken, async (req, res) => {
  try {
    let itineraryData;

    if (USE_MOCK) {
      itineraryData = generateMockItinerary(req.body);
    } else {
      const userPrompt = buildUserPrompt(req.body);
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.3,
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
