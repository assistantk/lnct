import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import { LargeObjectManager } from "pg-large-object";
import { GoogleGenerativeAI } from "@google/generative-ai";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
if (!process.env.GOOGLE_API_KEY) {
  console.error("ERROR: GOOGLE_API_KEY is not defined in your .env file.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: false, // adjust as needed for your environment
  },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact form route
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await pool.query(
      "INSERT INTO contact_queries (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "We Received Your Message",
      text: `Hi ${name},\n\nThank you for contacting us. Our team will reach out to you shortly.\n\nBest regards,\nLNCT Group`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Message sent and saved!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

// Get all events
// Modify the /api/events route to accept query params
app.get("/api/events", async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const offset = parseInt(req.query.offset, 10) || 0;

  try {
    const response = await pool.query(
      "SELECT id, title, description FROM events ORDER BY id DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    res.status(200).json({
      success: true,
      message: "Events fetched",
      data: response.rows,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});
app.get("/api/events/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send("Invalid ID");

  try {
    const result = await pool.query(
      "SELECT id, title, description FROM events WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});
app.get("/api/image/:oid", async (req, res) => {
  const oid = parseInt(req.params.oid, 10);
  if (isNaN(oid)) {
    return res.status(400).send("Invalid OID");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const lom = new LargeObjectManager({ pg: client });
    const [size, stream] = await lom.openAndReadableStreamAsync(oid, 16384); // buffer size: 16KB

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Length", size);

    stream.on("error", async (err) => {
      console.error("Stream error:", err);
      await client.query("ROLLBACK");
      client.release();
      res.status(500).send("Error reading image stream");
    });

    stream.pipe(res);

    stream.on("end", async () => {
      await client.query("COMMIT");
      client.release();
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    await client.query("ROLLBACK");
    client.release();
    res.status(500).send("Unexpected server error");
  }
});
// Add new event with image upload (stored as bytea)
app.post("/api/events", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!title || !description || !file) {
    return res.status(400).json({
      success: false,
      message: "Please provide title, description, and image file",
    });
  }

  try {
    const imageBuffer = fs.readFileSync(file.path);

    const insertEvent = await pool.query(
      "INSERT INTO events (title, description, image) VALUES ($1, $2, $3) RETURNING id, title, description",
      [title, description, imageBuffer]
    );

    // Delete temp uploaded file after saving to DB
    fs.unlinkSync(file.path);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: insertEvent.rows[0],
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
    });
  }
});
app.delete("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM events WHERE id = $1", [id]);
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
});
app.put("/api/events/:id", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;
  const file = req.file;

  try {
    let updateQuery, params;

    if (file) {
      const imageBuffer = fs.readFileSync(file.path);
      updateQuery =
        "UPDATE events SET title = $1, description = $2, image = $3 WHERE id = $4";
      params = [title, description, imageBuffer, id];
      fs.unlinkSync(file.path);
    } else {
      updateQuery =
        "UPDATE events SET title = $1, description = $2 WHERE id = $3";
      params = [title, description, id];
    }

    await pool.query(updateQuery, params);

    res.json({ success: true, message: "Event updated successfully" });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
});
const handleDatabaseError = (res, error) => {
  console.error("Database Error:", error);
  res.status(500).json({ success: false, message: "Internal server error" });
};
// Serve event image by event ID
app.get("/api/event/image/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).send("Invalid event ID");

  try {
    const result = await pool.query("SELECT image FROM events WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0 || !result.rows[0].image) {
      return res.status(404).send("Image not found");
    }

    const imageData = result.rows[0].image;
    res.setHeader("Content-Type", "image/jpeg"); // Change type if storing other formats
    res.send(imageData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 5. Create the Prompt for Gemini (no changes here)
    const prompt = `
        You are UniBot, a friendly, knowledgeable, and helpful AI assistant for a university. Your goal is to provide concise and accurate information about the university.

        Your responses MUST BE in a specific JSON format. The JSON object should have two properties:
        1. "text": A string containing your detailed answer. Use markdown for formatting, like lists with '*' or bolding with '**'.
        2. "suggestions": An array of 4 strings, where each string is a relevant and insightful follow-up question the user might ask.

        Here is the user's question: "${message}"

        Provide information related to admissions, courses, campus life, financial aid, housing, etc. Be creative but stay within the persona of a university assistant. If you cannot answer a question, politely say so. DO NOT include any text or markdown formatting outside of the main JSON object.
    `;

    // 6. Call the Gemini API (no changes here)
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // 7. Parse the Gemini response with the new extraction method
    let parsedResponse;
    try {
      // --- THIS IS THE NEW, MORE ROBUST PARSING LOGIC ---

      // Find the first occurrence of '{'
      const startIndex = responseText.indexOf("{");
      // Find the last occurrence of '}'
      const endIndex = responseText.lastIndexOf("}");

      if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
        // Extract the JSON string from between the first '{' and last '}'
        const jsonString = responseText.substring(startIndex, endIndex + 1);
        parsedResponse = JSON.parse(jsonString);
      } else {
        // If we can't find a valid JSON structure, throw an error
        throw new Error(
          "Could not find a valid JSON object in the AI response."
        );
      }
    } catch (e) {
      console.error("Error parsing Gemini's JSON response:", e);
      console.error("Raw response from Gemini:", responseText); // Log the problematic response
      // Provide a fallback error response if JSON parsing fails
      return res.status(500).json({
        text: "I'm sorry, I encountered an issue processing your request. Please try asking in a different way.",
        suggestions: [
          "What are the admission requirements?",
          "Tell me about the campus.",
          "What courses are available?",
        ],
      });
    }

    res.json(parsedResponse);
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res
      .status(500)
      .json({ error: "An error occurred while communicating with the AI." });
  }
});
app.get("/api/services", async (req, res) => {
  try {
    const response = await pool.query(
      "SELECT id, title, description, alt, link FROM services ORDER BY id;"
    );
    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: response.rows,
    });
  } catch (error) {
    handleDatabaseError(res, error);
  }
});

// GET a service's image
app.get("/api/services/image/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT image FROM services WHERE id = $1",
      [id]
    );
    if (result.rows.length > 0 && result.rows[0].image) {
      res.set("Content-Type", "image/jpeg"); // Or the correct mime-type
      res.send(result.rows[0].image);
    } else {
      res.status(404).json({ success: false, message: "Image not found" });
    }
  } catch (error) {
    handleDatabaseError(res, error);
  }
});

// POST a new service
app.post("/api/services", async (req, res) => {
  try {
    const { title, description, image, alt, link } = req.body;
    // Basic validation
    if (!title || !description || !link) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, link.",
      });
    }
    // Decode base64 image to buffer if it exists
    const imageBuffer = image ? Buffer.from(image, "base64") : null;

    const newService = await pool.query(
      "INSERT INTO services (title, description, image, alt, link) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, alt, link",
      [title, description, imageBuffer, alt, link]
    );
    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService.rows[0],
    });
  } catch (error) {
    handleDatabaseError(res, error);
  }
});

// PUT (update) a service
app.put("/api/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, alt, link } = req.body;

    if (!title || !description || !link) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    const imageBuffer = image ? Buffer.from(image, "base64") : null;

    const updatedService = await pool.query(
      `UPDATE services 
             SET title = $1, description = $2, alt = $3, link = $4 ${
               image ? ", image = $6" : ""
             }
             WHERE id = $5 
             RETURNING id, title, description, alt, link`,
      image
        ? [title, description, alt, link, id, imageBuffer]
        : [title, description, alt, link, id]
    );

    if (updatedService.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService.rows[0],
    });
  } catch (error) {
    handleDatabaseError(res, error);
  }
});

// DELETE a service
app.delete("/api/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await pool.query(
      "DELETE FROM services WHERE id = $1 RETURNING *",
      [id]
    );
    if (deleteOp.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    handleDatabaseError(res, error);
  }
});

app.get("/api/colleges", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, alt, courses, established, website FROM colleges ORDER BY id ASC"
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    handleDatabaseError(res, err);
  }
});

app.post("/api/colleges", async (req, res) => {
  try {
    const { name, description, image, alt, courses, established, website } =
      req.body;
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });

    const imageBuffer = image ? Buffer.from(image, "base64") : null;

    const result = await pool.query(
      "INSERT INTO colleges (name, description, image, alt, courses, established, website) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, description, alt, courses, established, website",
      [name, description, imageBuffer, alt, courses, established, website]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    handleDatabaseError(res, err);
  }
});

app.put("/api/colleges/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, alt, courses, established, website } =
      req.body;
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });

    const imageBuffer = image ? Buffer.from(image, "base64") : null;

    const result = await pool.query(
      `UPDATE colleges SET name = $1, description = $2, alt = $3, courses = $4, established = $5, website = $6 ${
        image ? ", image = $8" : ""
      }
       WHERE id = $7 RETURNING id, name, description, alt, courses, established, website`,
      image
        ? [
            name,
            description,
            alt,
            courses,
            established,
            website,
            id,
            imageBuffer,
          ]
        : [name, description, alt, courses, established, website, id]
    );
    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "College not found" });

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    handleDatabaseError(res, err);
  }
});

app.delete("/api/colleges/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM colleges WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "College not found" });

    res
      .status(200)
      .json({ success: true, message: "College deleted successfully" });
  } catch (err) {
    handleDatabaseError(res, err);
  }
});

// ----- Schools CRUD -----
app.get("/api/schools", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, alt, courses, established, website FROM schools ORDER BY id ASC"
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    handleDatabaseError(res, err);
  }
});

app.post("/api/schools", async (req, res) => {
  try {
    const { name, description, image, alt, courses, established, website } =
      req.body;
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });

    const imageBuffer = image ? Buffer.from(image, "base64") : null;

    const result = await pool.query(
      "INSERT INTO schools (name, description, image, alt, courses, established, website) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, description, alt, courses, established, website",
      [name, description, imageBuffer, alt, courses, established, website]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    handleDatabaseError(res, err);
  }
});

app.put("/api/schools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, alt, courses, established, website } =
      req.body;
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });

    const imageBuffer = image ? Buffer.from(image, "base64") : null;

    const result = await pool.query(
      `UPDATE schools SET name = $1, description = $2, alt = $3, courses = $4, established = $5, website = $6 ${
        image ? ", image = $8" : ""
      }
       WHERE id = $7 RETURNING id, name, description, alt, courses, established, website`,
      image
        ? [
            name,
            description,
            alt,
            courses,
            established,
            website,
            id,
            imageBuffer,
          ]
        : [name, description, alt, courses, established, website, id]
    );
    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "School not found" });

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    handleDatabaseError(res, err);
  }
});

app.delete("/api/schools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM schools WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "School not found" });

    res
      .status(200)
      .json({ success: true, message: "School deleted successfully" });
  } catch (err) {
    handleDatabaseError(res, err);
  }
});

// ----- Repeat the same pattern for other tables -----
const tables = ["digitalportals", "industries", "medicalinstitute"];

tables.forEach((table) => {
  app.get(`/api/${table}`, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, name, description, alt, courses, established, website FROM ${table} ORDER BY id ASC`
      );
      res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
      handleDatabaseError(res, err);
    }
  });

  app.post(`/api/${table}`, async (req, res) => {
    try {
      const { name, description, image, alt, courses, established, website } =
        req.body;
      if (!name)
        return res
          .status(400)
          .json({ success: false, message: "Name is required" });

      const imageBuffer = image ? Buffer.from(image, "base64") : null;

      const result = await pool.query(
        `INSERT INTO ${table} (name, description, image, alt, courses, established, website)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, name, description, alt, courses, established, website`,
        [name, description, imageBuffer, alt, courses, established, website]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      handleDatabaseError(res, err);
    }
  });

  app.put(`/api/${table}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, image, alt, courses, established, website } =
        req.body;
      if (!name)
        return res
          .status(400)
          .json({ success: false, message: "Name is required" });

      const imageBuffer = image ? Buffer.from(image, "base64") : null;

      const result = await pool.query(
        `UPDATE ${table} SET name = $1, description = $2, alt = $3, courses = $4, established = $5, website = $6 ${
          image ? ", image = $8" : ""
        }
         WHERE id = $7 RETURNING id, name, description, alt, courses, established, website`,
        image
          ? [
              name,
              description,
              alt,
              courses,
              established,
              website,
              id,
              imageBuffer,
            ]
          : [name, description, alt, courses, established, website, id]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ success: false, message: "Not found" });

      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
      handleDatabaseError(res, err);
    }
  });

  app.delete(`/api/${table}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ success: false, message: "Not found" });

      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      handleDatabaseError(res, err);
    }
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
