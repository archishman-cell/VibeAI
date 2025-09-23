import axios from 'axios';

// API configuration
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

/**
 * API Service for Gemini AI
 * Handles all API requests to the Gemini AI service
 */
class ApiService {
  constructor() {
    this.timeout = 30000; // 30 seconds timeout
  }

  /**
   * Validates the API key
   * @returns {boolean} - True if API key is valid
   */
  validateApiKey() {
    if (!API_KEY) {
      throw new Error("API key is missing. Please check your environment variables.");
    }
    return true;
  }

  /**
   * Validates the input question
   * @param {string} question - The question to validate
   * @returns {boolean} - True if question is valid
   */
  validateQuestion(question) {
    if (!question || !question.trim()) {
      throw new Error("Please enter a question before generating a response.");
    }
    return true;
  }

  /**
   * Validates the API response structure
   * @param {Object} response - The API response
   * @returns {string} - The extracted text from the response
   */
  validateResponse(response) {
    if (!response.data) {
      throw new Error("Invalid response received from the API.");
    }

    if (!response.data.candidates || response.data.candidates.length === 0) {
      throw new Error("No response candidates found. The API may have filtered the content.");
    }

    if (!response.data.candidates[0].content || !response.data.candidates[0].content.parts) {
      throw new Error("Invalid response structure received from the API.");
    }

    const responseText = response.data.candidates[0].content.parts[0].text;
    
    if (!responseText) {
      throw new Error("Empty response received from the API.");
    }

    return responseText;
  }

  /**
   * Handles different types of errors and returns user-friendly messages
   * @param {Error} error - The error object
   * @returns {string} - User-friendly error message
   */
  handleError(error) {
    console.error("API Error:", error);

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return "Request timed out. Please try again with a shorter question or check your internet connection.";
    }

    // Handle server response errors
    if (error.response) {
      const status = error.response.status;
      const statusText = error.response.statusText;
      
      switch (status) {
        case 400:
          return "Bad request. Please check your question format and try again.";
        case 401:
          return "Unauthorized. Please check your API key.";
        case 403:
          return "Access forbidden. Your API key may not have permission to access this resource.";
        case 404:
          return "API endpoint not found. Please check the API URL.";
        case 429:
          return "Rate limit exceeded. Please wait a moment before trying again.";
        case 500:
          return "Internal server error. Please try again later.";
        case 503:
          return "Service unavailable. The API is temporarily down. Please try again later.";
        default:
          return `Server error (${status}): ${statusText}. Please try again later.`;
      }
    }

    // Handle network errors
    if (error.request) {
      return "Network error. Please check your internet connection and try again.";
    }

    // Handle other errors (including validation errors)
    return error.message || "An unexpected error occurred. Please try again.";
  }

  /**
   * Generates content using Gemini AI
   * @param {string} question - The question to ask
   * @returns {Promise<string>} - The generated response
   */
  async generateContent(question) {
    try {
      // Validate inputs
      this.validateQuestion(question);
      this.validateApiKey();

      console.log("Making API request...");
      console.log("API Key:", API_KEY ? "Present" : "Missing");
      
      // Make the API request
      const response = await axios({
        method: 'post',
        url: API_URL,
        data: {
          "contents": [
            {
              "parts": [
                {
                  "text": question
                }
              ]
            }
          ]
        },
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Validate and extract response
      const responseText = this.validateResponse(response);
      
      console.log("Response received successfully");
      return responseText;
      
    } catch (error) {
      // Handle and re-throw with user-friendly message
      const userFriendlyError = this.handleError(error);
      throw new Error(userFriendlyError);
    }
  }

  /**
   * Generates both answer and improved prompt suggestion using Gemini AI
   * @param {string} question - The question to ask
   * @returns {Promise<Object>} - Object containing both answer and improved prompt
   */
  async generateContentWithPromptSuggestion(question) {
    try {
      // Validate inputs
      this.validateQuestion(question);
      this.validateApiKey();

      console.log("Making API request for answer and prompt suggestion...");
      
      // Create a comprehensive prompt that asks for both answer and improved prompt
      const enhancedPrompt = `Please provide two things:

1. ANSWER: Answer the following question: "${question}"

2. IMPROVED_PROMPT: Suggest a better, more specific version of the user's question that would yield a more detailed, accurate, or useful response. Consider what additional context, constraints, or specifics would help get a better answer.

Format your response exactly like this:
ANSWER:
[Your answer here]

IMPROVED_PROMPT:
[Your improved prompt suggestion here]`;

      // Make the API request
      const response = await axios({
        method: 'post',
        url: API_URL,
        data: {
          "contents": [
            {
              "parts": [
                {
                  "text": enhancedPrompt
                }
              ]
            }
          ]
        },
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Validate and extract response
      const responseText = this.validateResponse(response);
      
      // Parse the response to extract answer and improved prompt
      const { answer, improvedPrompt } = this.parseResponseWithPrompt(responseText);
      
      console.log("Response with prompt suggestion received successfully");
      return { answer, improvedPrompt };
      
    } catch (error) {
      // Handle and re-throw with user-friendly message
      const userFriendlyError = this.handleError(error);
      throw new Error(userFriendlyError);
    }
  }

  /**
   * Parses the API response to extract answer and improved prompt
   * @param {string} responseText - The raw response text
   * @returns {Object} - Object containing answer and improvedPrompt
   */
  parseResponseWithPrompt(responseText) {
    const answerMatch = responseText.match(/ANSWER:\s*([\s\S]*?)(?=IMPROVED_PROMPT:|$)/i);
    const promptMatch = responseText.match(/IMPROVED_PROMPT:\s*([\s\S]*?)$/i);

    const answer = answerMatch ? answerMatch[1].trim() : responseText;
    const improvedPrompt = promptMatch ? promptMatch[1].trim() : "Here's a more specific version of your question: " + responseText.substring(0, 100) + "...";

    return { answer, improvedPrompt };
  }

  /**
   * Gets the current API configuration
   * @returns {Object} - API configuration object
   */
  getConfig() {
    return {
      apiKey: API_KEY ? "Present" : "Missing",
      apiUrl: API_URL,
      timeout: this.timeout
    };
  }
}

// Export a singleton instance
export default new ApiService();
