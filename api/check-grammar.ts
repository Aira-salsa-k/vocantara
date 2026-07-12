import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "RAPIDAPI_KEY is not configured on the server." });
    }

    const response = await axios.post(
      "https://grammar-genius.p.rapidapi.com/dev/grammar",
      {
        text,
        lang: "en",
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "grammar-genius.p.rapidapi.com",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err: any) {
    console.error("Grammar API error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: "Failed to check grammar" });
  }
}
