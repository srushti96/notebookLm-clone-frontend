import { useState, useRef } from "react";
import { FiUpload, FiFile, FiX, FiAlertCircle } from "react-icons/fi";
import apiService from "../services/api";

const FileUploader = ({ pdfFile, setPdfFile, pdfInfo, setPdfInfo }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) {
      return { valid: false, error: "No file selected" };
    }

    if (file.type !== "application/pdf") {
      return { valid: false, error: "Please upload a PDF file only" };
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return { valid: false, error: "File size must be less than 10MB" };
    }

    return { valid: true };
  };

  const handleUpload = async (file) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      console.log("📤 Starting file upload:", file.name);
      const response = await apiService.uploadPDF(file);

      if (response.success) {
        setPdfInfo({
          fileId: response.data.fileId,
          fileName: response.data.fileName,
          fileUrl: response.data.fileUrl,
          pages: response.data.pages,
          textLength: response.data.textLength,
          uploadedAt: response.data.uploadedAt,
        });
        console.log("✅ Upload successful:", response.data);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err.message || "Upload failed. Please try again.");
      // Clear file on error
      setPdfFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      await handleUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setPdfFile(file);
      await handleUpload(file);
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setPdfInfo(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRetry = () => {
    if (pdfFile) {
      handleUpload(pdfFile);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!pdfFile ? (
          <div className="space-y-3">
            <FiUpload size={32} className="mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop your PDF here, or{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Only PDF files are supported (Max 10MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <FiFile
                size={24}
                className={error ? "text-red-500" : "text-green-500"}
              />
              <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                {pdfFile.name}
              </span>
            </div>

            {isUploading && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-blue-600">
                  Uploading and processing...
                </span>
              </div>
            )}

            {!isUploading && !error && pdfInfo && (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-green-600">
                  ✓ Uploaded successfully
                </span>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  title="Remove file"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}

            {!isUploading && !pdfInfo && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={handleRemoveFile}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-red-500 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <FiAlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            {pdfFile && (
              <button
                onClick={handleRetry}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success Info */}
      {pdfInfo && !isUploading && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiFile size={16} className="text-green-500" />
              <span className="text-sm font-medium text-green-800">
                Document ready for chat
              </span>
            </div>
            <div className="text-xs text-green-600">
              {pdfInfo.pages && `${pdfInfo.pages} pages`}
            </div>
          </div>
          {pdfInfo.textLength && (
            <p className="text-xs text-green-600 mt-1">
              {Math.round(pdfInfo.textLength / 1000)}k characters extracted
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
