const cors = require("cors");
const express = require("express");
require("dotenv").config();
const app = express();

// import routes
// const route = require("./routes/routeName");

// Middleware
app.use(cors());
app.use(express.json());

// use = router for a specific path
// app.use("/api", route);

// ----------ENDPOINTS------------ //

// root
app.get("/", (req, res) => {
  res.send("connected my dudes 🔌");
});

// catch for any undefined routes
app.use((req, res) => {
  res.status(404).send("endpoint not found");
});

// set up port
const PORT = process.env.SERVER_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
