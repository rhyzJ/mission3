const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // imports gemini library

require("dotenv").config();

const app = express();

// import routes

// Middleware
app.use(cors());
app.use(express.json()); //to parse json

const genAi = new GoogleGenerativeAI(process.env.API_KEY); // connects to gemini api
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); //picking specificc model

// use = router for a specific path
// app.use("/api", route);

// ----------ENDPOINTS------------ ///

// root
app.get("/", (req, res) => {
  res.send("connected my dudes 🔌");
});

// catch for any undefined routes
app.use((req, res) => {
  res.status(404).send("endpoint not found");
});

// set up port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
