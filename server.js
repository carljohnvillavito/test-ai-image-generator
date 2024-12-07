const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Proxy route to call the external API
app.get("/api/image", async (req, res) => {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.get(
      `https://jerome-web.onrender.com/service/api/dalle2-image?prompt=${encodeURIComponent(
        prompt
      )}`
    );

    res.json(response.data); // Forward the API response to the client
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
