import { useState, useRef, useEffect } from "react";
import { FiSend, FiUser, FiMessageCircle, FiAlertCircle } from "react-icons/fi";
import apiService from "../services/api";

const ChatBox = ({ fileId }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll and focus effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fileId && textareaRef.current?.focus();
  }, [fileId]);

  // Message handling
  const addMessage = (message) => {
    setMessages((prev) => [
      ...prev,
      { ...message, id: Date.now() + Math.random() },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !fileId || isLoading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.sendChatMessage(input.trim(), fileId);

      if (response.success) {
        addMessage({
          role: "assistant",
          content: response.data.answer,
          citations: response.data.citations,
          model: response.data.model,
          timestamp: new Date(),
        });
      } else {
        throw new Error(response.message || "Failed to get response");
      }
    } catch (err) {
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        error: true,
        timestamp: new Date(),
      });
      setError(err.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setInput("");
    textareaRef.current?.focus();
  };

  // No file state
  if (!fileId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiMessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No Document Loaded
          </h3>
          <p className="text-gray-500">
            Upload a PDF document to start asking questions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-3 border-b bg-gray-50 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Chat with Document
        </h2>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 rounded"
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex-shrink-0 px-6 py-3 bg-red-50 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiAlertCircle size={16} className="text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Start a conversation
            </h3>
            <p className="text-gray-500">
              Ask questions about your uploaded document
            </p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Try asking:</p>
              <p className="italic">"What is this document about?"</p>
              <p className="italic">"Summarize the key points"</p>
              <p className="italic">"What are the main conclusions?"</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl flex items-start space-x-3 ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : message.error
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {message.role === "user" ? (
                    <FiUser size={16} />
                  ) : message.error ? (
                    <FiAlertCircle size={16} />
                  ) : (
                    <FiMessageCircle size={16} />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : message.error
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.citations && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs text-gray-600 mb-2 font-medium">
                        Sources:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.citations.map((page, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            Page {page}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <FiMessageCircle size={16} />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-gray-100">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t p-4">
        <div className="flex items-end space-x-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your document..."
            className="flex-1 px-4 py-3 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="1"
            style={{ minHeight: "44px", maxHeight: "120px" }}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSend size={18} />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
