const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini model with your API key
const genAI = new GoogleGenerativeAI("AIzaSyC_gdnb8KrhP-6oLz6qh8U55brpdTj3hDA"); // Replace with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using Gemini model

exports.processQueryWithGemini = async (query) => {
    try {
      // Call the Gemini model with the raw query
      const result = await model.generateContent(query);
      return result.response.text();
    } catch (error) {
      console.error("Error calling Gemini API:", error.message);
      throw new Error("Failed to process query with Gemini.");
    }
  };
