const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Initialize chatSession as null
let chatSession = null;

// Function to initialize generative AI model
async function initializeGenerativeAI(prompt, jobTitle) {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API key is missing in environment variables.");
    }

    const genAi = new GoogleGenerativeAI(process.env.API_KEY);
    const model = await genAi.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are a highly skilled and experienced job interviewer specializing in the field of ${jobTitle}. ${prompt}`,
    });
    return model;
  } catch (error) {
    console.error("❌ Error initializing AI model:", error);
    throw new Error("Failed to initialize AI model.");
  }
}

// Start interview route

app.post("/api/startInterview", async (req, res) => {
  const { jobTitle, resetInterview } = req.body;

  const prompt = `The candidate is applying for the role of ${jobTitle}. Assume the candidate has [User inputs experience level here: e.g., entry-level, mid-level, senior-level] experience.
The interview begins by asking the candidate, "Tell me about yourself, focusing on your relevant skills and experience for this ${jobTitle} role." After the candidate responds, ask at least six follow-up questions, one at a time, based on their response and tailored to the specific job title and their answers. Prioritize questions that assess:
Technical Skills: Ask questions that directly evaluate the candidate's proficiency in relevant technologies, tools, and methodologies.
Problem-Solving: Ask questions requiring the candidate to describe how they approached and solved complex problems.
Teamwork & Collaboration: Assess their ability to work effectively in team environments.
Communication: Evaluate their ability to clearly articulate technical concepts and ideas.
Leadership (If Applicable): Assess leadership qualities for senior-level roles.
Avoid pre-programmed questions; instead, dynamically generate relevant questions to probe deeper into their responses.
After the candidate answers all your questions, provide a concise summary of the interview, including strengths and areas for improvement.
Begin the interview now.`;

  try {
    const model = await initializeGenerativeAI(prompt, jobTitle);

    chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    console.log("Chat session initialized:", chatSession);

    const initialResponse =
      "Hi there I'm an Interview chatbot, what is your name?"; // Initial response from AI to start the interview
    res.json({ aiResponse: initialResponse });
  } catch (error) {
    console.error("❌ Error in starting interview:", error);
    res.status(500).json({
      error: "Failed to start the interview.",
      details: error.message,
    });
  }
});

// Mock interview route
app.post("/api/interview", async (req, res) => {
  const { userResponse } = req.body;

  try {
    if (!chatSession) {
      return res.status(400).json({
        error:
          "Chat session is not initialized. Please start the interview first.",
      });
    }

    if (!userResponse) {
      return res.status(400).json({
        error: "User response is empty. Please provide a valid response.",
      });
    }

    const result = await chatSession.sendMessageStream(userResponse);
    let aiResponse = "";

    for await (const chunk of result.stream) {
      aiResponse += chunk.text();
    }

    res.json({ aiResponse });
  } catch (error) {
    console.error("❌ Error in AI response:", error.message);
    res
      .status(500)
      .json({ error: "Failed to get AI response.", details: error.message });
  }
});

// Root route for checking server status
app.get("/", (req, res) => {
  res.send("Connected my dudes 🔌");
});

// 404 handler for unrecognized routes
app.use((req, res) => {
  res.status(404).send("Endpoint not found");
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
