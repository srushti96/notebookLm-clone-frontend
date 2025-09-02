import { useState, useRef } from "react";
import { FiUpload, FiFile, FiX, FiAlertCircle } from "react-icons/fi";
import apiService from "../services/api";

const FileUploader = ({ pdfFile, setPdfFile, pdfInfo, setPdfInfo }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return { valid: false, error: "No file selected" };
    if (file.type !== "application/pdf")
      return { valid: false, error: "PDF files only" };
    if (file.size > 10 * 1024 * 1024)
      return { valid: false, error: "File too large (10MB max)" };
    return { valid: true };
  };

  const handleUpload = async (file) => {
    const validation = validateFile(file);
    if (!validation.valid) return setError(validation.error);

    setIsUploading(true);
    setError(null);

    try {
      const response = await apiService.uploadPDF(file);
      if (!response.success)
        throw new Error(response.message || "Upload failed");

      setPdfInfo({
        fileId: response.data.fileId,
        fileName: response.data.fileName,
        fileUrl: response.data.fileUrl,
        pages: response.data.pages,
        textLength: response.data.textLength,
        uploadedAt: response.data.uploadedAt,
      });
    } catch (err) {
      setError(err.message || "Upload failed");
      setPdfFile(null);
      fileInputRef.current.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      setPdfFile(file);
      handleUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleRemove = () => {
    setPdfFile(null);
    setPdfInfo(null);
    setError(null);
    fileInputRef.current.value = "";
  };

  const dragHandlers = {
    onDragOver: (e) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    onDragLeave: (e) => {
      e.preventDefault();
      setIsDragOver(false);
    },
    onDrop: handleDrop,
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        {...dragHandlers}
      >
        {!pdfFile ? (
          <>
            <FiUpload size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-700">
              Drop PDF here or{" "}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 hover:text-blue-600 underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500">Max 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <FiFile
              size={24}
              className={error ? "text-red-500" : "text-green-500"}
            />
            <span className="text-sm font-medium truncate max-w-xs">
              {pdfFile.name}
            </span>
            {!isUploading && (
              <button
                onClick={handleRemove}
                className="text-gray-400 hover:text-red-500"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        )}

        {isUploading && (
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-600">Processing...</span>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiAlertCircle className="text-red-500" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      {pdfInfo && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiFile className="text-green-500" />
              <span className="text-sm text-green-800">Ready for chat</span>
            </div>
            <span className="text-xs text-green-600">
              {pdfInfo.pages} pages
            </span>
          </div>
          {pdfInfo.textLength && (
            <p className="text-xs text-green-600 mt-1">
              {Math.round(pdfInfo.textLength / 1000)}k characters
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
