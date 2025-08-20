import { useState, useRef } from "react";
import { FiUpload, FiFile, FiX } from "react-icons/fi";

export default function FileUploader({
  pdfFile,
  setPdfFile,
  pdfInfo,
  setPdfInfo,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      let response;
      try {
        response = await res.json();
      } catch (e) {
        throw new Error("Server returned an invalid response.");
      }

      if (!res.ok || !response?.success) {
        const message =
          response?.error ||
          response?.error?.message ||
          `Upload failed (${res.status})`;
        throw new Error(message);
      }

      setPdfInfo({
        fileId: response.data.fileId,
        fileName: response.data.fileName,
        fileUrl: response.data.fileUrl,
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Upload failed. Please try again.");
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
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
                  className="text-blue-500 hover:text-blue-600 underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Only PDF files are supported
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
              <FiFile size={24} className="text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                {pdfFile.name}
              </span>
            </div>
            {isUploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-green-600">
                  ✓ Uploaded successfully
                </span>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* File Info */}
      {pdfInfo && !isUploading && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiFile size={16} className="text-green-500" />
              <span className="text-sm font-medium text-green-800">
                Document ready for chat
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
