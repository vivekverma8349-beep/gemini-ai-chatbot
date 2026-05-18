import express from 'express'
import multer from 'multer'
import model from './config/gemini.js'

const app = express()
app.use(express.static('public'))
// Read JSON data
import uploadfile from './services/imagekit.js'
app.use(express.json())

const upload=multer({storage:multer.memoryStorage()})
import * as pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
//image upload
 const imagekituploadfunction=async (req, res) => {
  try {
    const imageUrl = await uploadfile(req.file)
    res.json({ success: true, imageUrl })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

const extractTextandsendtogemini = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    let extractedText = "";

    // PDF
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse.default(file.buffer);

      extractedText = data.text;
    }

    // IMAGE OCR
    else if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      const result = await Tesseract.recognize(
        file.buffer,
        "eng"
      );

      extractedText = result.data.text;
    }

    else {
      return res.status(400).json({
        message: "Unsupported file type",
      });
    }
 const prompt = `
    You are an AI assistant.

    Analyze the following document:

    ${extractedText}

    Give a summary in simple language.
    `;
  
      const result = await model.generateContent(prompt);

    const response = result.response.text();

    res.json({
      success: true,
      extractedText,
      aiResponse: response,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Extraction failed",
    });
  }
};

//extractand send to gemini
app.post('/upload', upload.single('imageFile'), extractTextandsendtogemini)
// Chatbot route
app.post('/chat', async (req, res) => {
  console.log('Route hit')
  try {

    // Get message from frontend/Postman
    const { message } = req.body

    // Send message to Gemini
    const result = await model.generateContent(message)
   
    // Extract AI response text
    const response = result.response.text()

    // Send response back
    res.json({
      success: true,
      reply: response
    })

  } catch (error) {

  console.log(error)

  res.status(500).json({
    success: false,
    message: error.message
  })

}

})

// Start server
app.listen(8000, () => {
  console.log('Server running on port 8000')
})