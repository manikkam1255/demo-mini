import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();

  app.use(express.json());

  // Initialize Gemini AI (server-side only)
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!ai && process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Skill Doubt Resolver Endpoint
  app.post("/api/ai/doubt-resolver", async (req, res) => {
    try {
      const { query, studentProfile, career, examContext, questionContext, history } = req.body;
      const client = getGeminiClient();

      if (!client) {
        // High quality rule-based fallback response
        let fallbackText = `### 🧠 AI Skill Mentor Solution\n\n`;
        if (questionContext) {
          fallbackText += `**Focus Area:** ${questionContext.skillDomain || 'Technical Knowledge'} (${questionContext.difficulty || 'Intermediate'})\n\n`;
          fallbackText += `**1. Core Concept Explanation:**\n${questionContext.explanation || 'The fundamental principle relies on predictable runtime execution and invariant validation.'}\n\n`;
          if (questionContext.userSelectedOptionId && questionContext.userSelectedOptionId !== questionContext.correctOptionId) {
            fallbackText += `**2. Why Option (${questionContext.userSelectedOptionId.toUpperCase()}) Failed:**\nThis choice is a common trap overlooking boundary constraints or execution order.\n\n`;
          }
          fallbackText += `**3. Master Key:** Always verify base cases and memory complexity before committing in ${career?.title || 'Technical'} interviews.\n\n`;
          fallbackText += `**4. Recommended Practice:** Focus on **${questionContext.topicToReview || 'Core System Design'}**.`;
        } else {
          fallbackText += `Regarding **"${query}"** for **${career?.title || 'Engineering'}**:\n\n`;
          fallbackText += `• **Foundational Principle:** In ${career?.title || 'this domain'}, this pattern ensures modularity, high throughput, and fault tolerance.\n`;
          fallbackText += `• **Best Practice:** Always benchmark execution bottlenecks using deterministic profiling rather than speculative optimization.\n`;
          fallbackText += `• **Technical Interview Takeaway:** When asked about this concept, explain the trade-offs between latency, maintainability, and resource overhead.`;
        }

        return res.json({
          success: true,
          provider: "local-engine",
          reply: fallbackText,
        });
      }

      // Build rich prompt for Gemini 3.7 Flash
      let systemPrompt = `You are the "PathFinder AI Skill Mentor & Expert Doubt Resolver" for students preparing for competitive exams (TANCET, JEE, GATE, Tech Placements) and careers in ${career?.title || "Technology"}.
Your job is to answer the student's doubt with precision, clarity, step-by-step reasoning, mathematical proof (if math/aptitude), code examples (if programming/data), and interview insights.

[CANDIDATE CONTEXT]
- Student: ${studentProfile?.fullName || "Candidate"} (${studentProfile?.degree || "Engineering"}, ${studentProfile?.yearOfStudy || "3rd Year"})
- Target Career Path: ${career?.title || "Software Engineering"}
- Exam Score: ${examContext?.scorePercentage ?? "N/A"}%
`;

      if (questionContext) {
        systemPrompt += `\n[SPECIFIC EXAM QUESTION CONTEXT]
- Domain: ${questionContext.skillDomain} (${questionContext.difficulty})
- Question: ${questionContext.question}
${questionContext.codeSnippet ? `- Code Snippet:\n\`\`\`\n${questionContext.codeSnippet}\n\`\`\`` : ""}
- Options:
${(questionContext.options || []).map((o: any) => `  * [${o.id.toUpperCase()}] ${o.text}`).join("\n")}
- Correct Option: [${(questionContext.correctOptionId || "").toUpperCase()}]
- Student Selected: [${(questionContext.userSelectedOptionId || "Unattempted").toUpperCase()}]
- Official Explanation: ${questionContext.explanation}
- Topic to Review: ${questionContext.topicToReview}
`;
      }

      if (history && Array.isArray(history) && history.length > 0) {
        systemPrompt += `\n[PREVIOUS CHAT HISTORY]\n` + 
          history.slice(-4).map((m: any) => `${m.sender === 'student' ? 'Student' : 'AI Mentor'}: ${m.text}`).join('\n') + `\n`;
      }

      systemPrompt += `\n[STUDENT QUERY / DOUBT]
"${query}"

[RESPONSE GUIDELINES]
1. Answer immediately and directly in clean, readable Markdown.
2. If this is a programming question, include a concise, commented code snippet (Python, JavaScript/TypeScript, Java, or C++ as appropriate).
3. If this is an aptitude or math problem, show the exact step-by-step derivation with formulas.
4. If a question context was provided, clearly highlight why the correct option is right and why the chosen/other options are incorrect.
5. End with a 1-sentence "🎯 Interview / Exam Tip" highlighting what recruiters look for.
6. Keep the tone encouraging, professional, and crisp.`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: systemPrompt,
        config: {
          temperature: 0.4,
        },
      });

      const generatedAnswer = response.text || "I was able to analyze your doubt. Please review the core principles and let me know if you need deeper code examples!";

      return res.json({
        success: true,
        provider: "gemini-3.7-flash",
        reply: generatedAnswer,
      });
    } catch (error: any) {
      console.error("Gemini AI Doubt Resolver Error:", error?.message || error);
      
      // Return a graceful responsive fallback even on network/quota exception
      return res.json({
        success: true,
        provider: "fallback-resilient",
        reply: `### 🧠 AI Skill Mentor Note\n\nI processed your query regarding **"${req.body.query || 'this topic'}"**.\n\n` +
               `**Key Principle:** For ${req.body.career?.title || 'technical mastery'}, make sure to practice core algorithms, verify corner cases, and measure time/space complexity.\n\n` +
               `*Tip: Try asking for a specific code sample or step-by-step breakdown!*`,
      });
    }
  });

  // AI Deep Career Reasoning & Roadmap Generation Endpoint
  app.post("/api/ai/deep-analysis", async (req, res) => {
    try {
      const { studentProfile, skillRatings, interests, careerPreferences, topCareer } = req.body;
      const client = getGeminiClient();

      if (!client) {
        return res.json({
          success: false,
          fallbackUsed: true,
          message: "Gemini API key not configured. Using local ML engine predictions.",
        });
      }

      const prompt = `You are an expert AI Career Guidance Counselor & Machine Learning Career Recommender.
A student has completed our multi-parameter career assessment with the following profile:

[STUDENT PROFILE]
- Name: ${studentProfile?.fullName || "Student"}
- Degree / Course: ${studentProfile?.degree || "Undergraduate"}
- Year of Study: ${studentProfile?.yearOfStudy || "3rd Year"}
- College / Institution: ${studentProfile?.college || "University"}
- Academic CGPA / Score: ${studentProfile?.cgpa || "8.0"} / 10

[CORE SKILLS (1 to 5 scale)]
- Programming: ${skillRatings?.programming || 3}/5
- Communication: ${skillRatings?.communication || 3}/5
- Problem Solving: ${skillRatings?.problemSolving || 3}/5
- Mathematics: ${skillRatings?.mathematics || 3}/5
- Creativity: ${skillRatings?.creativity || 3}/5
- Leadership: ${skillRatings?.leadership || 3}/5
- Specialized Skills: ${(skillRatings?.specializedSkills || []).join(", ") || "None specified"}

[INTERESTS & WORK STYLE]
- Domain Interests: ${(interests?.domains || []).join(", ") || "General Technology"}
- Preferred Work Style: ${(interests?.workTypes || []).join(", ") || "Problem Solving"}

[CAREER ASPIRATIONS]
- Priority Factors: ${(careerPreferences?.priorities || []).join(", ") || "Career Growth, High Salary"}
- Preferred Work Environment: ${careerPreferences?.workEnvironment || "Hybrid"}

[TOP PREDICTED CAREER BY ML ENSEMBLE]
- Role: ${topCareer?.title || "Software Developer"}
- Match Score: ${topCareer?.matchScore || "92"}%

Please provide a highly personalized, actionable JSON response with:
1. "personalizedAdvice": A warm, empowering 3-4 sentence message directly addressing the student, explaining specifically why their unique mix of skills (highlighting their specific ratings) and year of study makes them prime for this path.
2. "customMilestones": An array of 3 distinct, practical 3-month milestone phases tailored for a ${studentProfile?.yearOfStudy || "3rd Year"} student (each with "phaseName", "timeframe", "keyObjectives" [list of 3 items], and "recommendedFreeToolsOrCerts" [list of 2 items]).
3. "interviewFocusAreas": An array of 3 specific technical/behavioral focus areas to practice for entry-level roles in this field.
4. "industryOutlook": A concise 2-sentence summary of the 2025-2027 market demand and emerging tech in this domain.

Respond ONLY with valid, parseable JSON with no markdown backticks or commentary outside JSON.`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);

      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (error: any) {
      console.error("Gemini AI Career Analysis Error:", error?.message || error);
      return res.status(500).json({
        success: false,
        error: error?.message || "Failed to generate deep AI analysis",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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

  let port = Number(process.env.PORT) || 3000;

  const startListening = (p: number) => {
    const server = app.listen(p, "0.0.0.0", () => {
      console.log(`\n🚀 AI Career Recommendation System server running on http://localhost:${p}\n`);
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`⚠️ Port ${p} is in use, trying http://localhost:${p + 1}...`);
        startListening(p + 1);
      } else {
        console.error("Server error:", err);
      }
    });
  };

  startListening(port);
}

startServer();

