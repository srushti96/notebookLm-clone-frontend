import axios from "axios";

// Force production URL for testing
const API_BASE_URL = "https://notebooklm-clone-backend-1rmg.onrender.com";

console.log("🔗 Frontend Debug - API Base URL:", API_BASE_URL);
console.log("🌍 Frontend Debug - Current Location:", window.location.href);
console.log("🏠 Frontend Debug - Hostname:", window.location.hostname);
console.log("📍 Frontend Debug - Port:", window.location.port);
console.log("🔒 Frontend Debug - Protocol:", window.location.protocol);

// Create axios instance with detailed logging
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Enhanced request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log("🚀 Frontend Request Debug:");
    console.log(`   Method: ${config.method?.toUpperCase()}`);
    console.log(`   URL: ${config.url}`);
    console.log(`   Base URL: ${config.baseURL}`);
    console.log(`   Full URL: ${config.baseURL}${config.url}`);
    console.log(`   Headers:`, config.headers);
    return config;
  },
  (error) => {
    console.error("❌ Frontend Request Error:", error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ Frontend Response Debug:");
    console.log(`   Status: ${response.status}`);
    console.log(`   URL: ${response.config.url}`);
    console.log(`   Data:`, response.data);
    return response;
  },
  (error) => {
    console.error("❌ Frontend Response Error:");
    console.error(`   Status: ${error.response?.status}`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Response Data:`, error.response?.data);
    console.error(`   Full Error:`, error);

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

// API Service Class with enhanced debugging
class APIService {
  // Test connection to backend
  async testConnection() {
    try {
      console.log("🧪 Testing backend connection...");
      const response = await axios.get(`${API_BASE_URL}/health`);
      console.log("✅ Backend connection successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Backend connection failed:", error);
      throw error;
    }
  }

  // File Upload with enhanced debugging
  async uploadPDF(file) {
    try {
      console.log("📤 Upload Debug - Starting upload");
      console.log("📄 File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Test backend connection first
      await this.testConnection();

      const formData = new FormData();
      formData.append("pdf", file);

      console.log(
        "📤 Upload Debug - Making request to:",
        `${API_BASE_URL}/api/upload`
      );

      const response = await apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Upload successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Upload failed:");
      console.error("   Error message:", error.message);
      console.error("   Error response:", error.response?.data);
      console.error("   Full error:", error);

      throw new Error(
        error.response?.data?.error?.message || error.message || "Upload failed"
      );
    }
  }

  // Other methods remain the same...
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
}

// Test the connection when the module loads
const apiService = new APIService();

// Auto-test connection
apiService.testConnection().catch((error) => {
  console.error("🚨 Initial backend connection test failed:", error.message);
});

export default apiService;
export { apiClient };
