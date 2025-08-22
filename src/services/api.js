import axios from "axios";

// Environment detection
const isDevelopment =
  import.meta.env.MODE === "development" ||
  window.location.hostname === "localhost"

// API Base URLs
const API_BASE_URL = isDevelopment
  ? "http://localhost:3000"
  : "https://notebooklm-clone-backend-1rmg.onrender.com";

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);

    // Handle common errors
    if (error.response?.status === 404) {
      throw new Error("Resource not found");
    } else if (error.response?.status === 500) {
      throw new Error("Server error. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please check your connection.");
    } else if (error.message === "Network Error") {
      throw new Error("Network error. Please check your internet connection.");
    }

    return Promise.reject(error);
  }
);

// API Service Class
class APIService {
  // File Upload Methods
  async uploadPDF(file) {
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message || error.message || "Upload failed"
      );
    }
  }

  async getPDFInfo(fileId) {
    try {
      const response = await apiClient.get(`/pdf/${fileId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.message ||
          "Failed to get PDF info"
      );
    }
  }

  async deletePDF(fileId) {
    try {
      const response = await apiClient.delete(`/pdf/${fileId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.message ||
          "Failed to delete PDF"
      );
    }
  }

  async getAllPDFs() {
    try {
      const response = await apiClient.get("/pdfs");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.message ||
          "Failed to get PDFs"
      );
    }
  }

  // Chat Methods
  async sendChatMessage(question, fileId, options = {}) {
    try {
      const response = await apiClient.post("/chat", {
        question,
        fileId,
        options,
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.message ||
          "Chat request failed"
      );
    }
  }

  // AI Service Methods
  async getAvailableModels() {
    try {
      const response = await apiClient.get("/models");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.message ||
          "Failed to get models"
      );
    }
  }

  async getAIStatus() {
    try {
      const response = await apiClient.get("/ai/status");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.message ||
          "Failed to get AI status"
      );
    }
  }

  // System Methods
  async healthCheck() {
    try {
      const response = await apiClient.get("/health");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.message ||
          "Health check failed"
      );
    }
  }

  async getStats() {
    try {
      const response = await apiClient.get("/stats");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.message ||
          "Failed to get stats"
      );
    }
  }
}

// Create and export singleton instance
const apiService = new APIService();
export default apiService;

// Export axios instance for direct use if needed
export { apiClient };
