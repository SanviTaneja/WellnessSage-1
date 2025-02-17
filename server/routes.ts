import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.get("/api/exercises", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const exercises = await storage.getExercises(req.user.id);
    res.json(exercises);
  });

  app.post("/api/exercises", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const exercise = await storage.createExercise({
      ...req.body,
      userId: req.user.id,
    });
    res.json(exercise);
  });

  app.get("/api/experts", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const experts = await storage.getExperts();
    res.json(experts);
  });

  app.post("/api/bookings", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const booking = await storage.createBooking({
      ...req.body,
      userId: req.user.id,
    });
    res.json(booking);
  });

  app.post("/api/chat", async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    try {
      console.log("Received chat request with prompt:", req.body.prompt);

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using a more stable model
        messages: [
          {
            role: "system",
            content: `You are an expert yoga instructor and fitness trainer with deep knowledge of yoga asanas, exercise physiology, and wellness resources.

When users describe their health concerns or fitness goals, provide comprehensive recommendations in the following JSON format:

{
  "message": "A personalized message addressing their concerns",
  "asanas": [
    {
      "name": "Name of the asana",
      "duration": recommended duration in minutes,
      "benefits": ["benefit1", "benefit2"],
      "difficulty": "beginner|intermediate|advanced",
      "instructions": ["step1", "step2"]
    }
  ],
  "exercises": [
    {
      "name": "Name of the exercise",
      "duration": recommended duration in minutes,
      "benefits": ["benefit1", "benefit2"],
      "difficulty": "beginner|intermediate|advanced",
      "instructions": ["step1", "step2"]
    }
  ],
  "resources": [
    {
      "title": "Title of the resource",
      "type": "book|article",
      "description": "Brief description of the resource"
    }
  ]
}

Always provide at least 2-3 asanas, 2-3 exercises, and 1-2 relevant resources.
Focus on safe, beginner-friendly options unless specifically asked for advanced routines.`,
          },
          {
            role: "user",
            content: req.body.prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      console.log("OpenAI response received:", response.choices[0].message);

      if (!response.choices[0].message.content) {
        throw new Error("No response content from OpenAI");
      }

      const parsedResponse = JSON.parse(response.choices[0].message.content);
      console.log("Parsed response:", parsedResponse);

      res.json(parsedResponse);
    } catch (error: any) {
      console.error("OpenAI API Error:", error);

      let errorMessage = "Failed to get AI recommendations";
      if (error.response) {
        console.error("OpenAI API Error Response:", error.response.data);
        errorMessage = error.response.data?.error?.message || errorMessage;
      }

      res.status(500).json({ 
        message: errorMessage,
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}