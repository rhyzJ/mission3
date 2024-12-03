const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const app = express();
app.use(cors());

let chatSession = null;

// start interview
app.post("/api/startInterview", async (req, res) => {
  const { jobTitle, resetInterview } = req.body;

  try {
    const genAi = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });
    const model = await genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (resetInterview) {
      chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [
              {
                text: `You are a highly skilled and experienced job interviewer specializing in the field of ${jobTitle}. The candidate is applying for the role of ${jobTitle}. Assume the candidate has [User inputs experience level here: e.g., entry-level, mid-level, senior-level] experience.

                The interview begins by asking the candidate, "Tell me about yourself, focusing on your relevant skills and experience for this ${jobTitle} role." After the candidate responds, ask at least six follow-up questions, one at a time, based on their response and tailored to the specific job title and their answers. Prioritize questions that assess:
                * **Technical Skills:** Ask questions that directly evaluate the candidate's proficiency in relevant technologies, tools, and methodologies.
                * **Problem-Solving:** Ask questions requiring the candidate to describe how they approached and solved complex problems.
                * **Teamwork & Collaboration:** Assess their ability to work effectively in team environments.
                * **Communication:** Evaluate their ability to clearly articulate technical concepts and ideas.
                * **Leadership (If Applicable):** Assess leadership qualities for senior-level roles.

                Avoid pre-programmed questions; instead, dynamically generate relevant questions to probe deeper into their responses.

                After the candidate answers all your questions, provide a concise summary of the interview, including strengths and areas for improvement.

                Begin the interview now.`,
              },
            ],
          },
        ],
      });
    }

    res.json({ message: "Interview started." });
  } catch (error) {
    console.error("❌ Error in starting interview:", error);
    res.status(500).json({ error: "Failed to start the interview." });
  }
});

// mock interview route
app.post("/api/interview", async (req, res) => {
  const { userResponse } = req.body;

  try {
    let result;
    if (chatSession) {
      result = await chatSession.sendMessage(userResponse);
    }

    res.json({
      aiResponse: result ? result.response.text() : "No AI response available.",
    });
  } catch (error) {
    console.error("❌ Error in AI response:", error);
    res.status(500).json({ error: "Failed to get AI response." });
  }
});

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Connected my dudes 🔌");
});

app.use((req, res) => {
  res.status(404).send("Endpoint not found");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
