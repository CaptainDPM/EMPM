import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/api/namus", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.namus.gov/api/CaseSets/NamUs/MissingPersons/Cases/Search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        body: JSON.stringify(req.body),
      },
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("NamUs proxy error:", err);
    res.status(500).json({ error: "NamUs proxy failed" });
  }
});

app.listen(3000, () =>
  console.log("NamUs proxy running at http://localhost:3000"),
);
