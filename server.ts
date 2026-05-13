import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;
const isProd = process.env.NODE_ENV === "production";

async function startServer() {
  const app = express();
  app.use(express.json());

  // Setup Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenAI({ apiKey: apiKey || "" }) as any;

  // API Routes
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured on server." });
      }

      const result = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt
      });
      const text = result.response.text();
      
      res.json({ text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to communicate with AI" });
    }
  });

  // Vite Middleware or Static Files
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
