import { lazy, Suspense, useState, useCallback, memo } from "react";
const ChatBox = lazy(() => import("./components/ChatBox"));
const FileUploader = lazy(() => import("./components/FileUploader"));
const PDFViewer = lazy(() => import("./components/PDFViewer"));
import { FiMessageSquare, FiFileText, FiX, FiMenu } from "react-icons/fi";

// Memoized static icon components
const CloseIcon = memo(() => <FiX size={20} />);
const MenuIcon = memo(() => <FiMenu size={20} />);
const FileTextIconLarge = memo(() => (
  <FiFileText size={48} className="mx-auto text-gray-400 mb-4" />
));

// Memoized sidebar tab button
const SidebarButton = memo(({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
      active ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
));

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");

  // Memoize callbacks to avoid unnecessary re-renders
  const handleSetPdfFile = useCallback((file) => {
    setPdfFile(file);
  }, []);

  const handleSetPdfInfo = useCallback((info) => {
    setPdfInfo(info);
  }, []);

  const handleSetActiveTab = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-80" : "w-16"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-semibold text-gray-800">NotebookLM</h1>
          )}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-4">
          {sidebarOpen && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-700 mb-2">
                  Upload Document
                </h2>
                <Suspense
                  fallback={
                    <div className="text-sm text-gray-500">
                      Loading uploader…
                    </div>
                  }
                >
                  <FileUploader
                    pdfFile={pdfFile}
                    setPdfFile={handleSetPdfFile}
                    pdfInfo={pdfInfo}
                    setPdfInfo={handleSetPdfInfo}
                  />
                </Suspense>
              </div>

              {pdfInfo && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">
                    Current Document
                  </h3>
                  <p className="text-sm text-blue-700 truncate">
                    {pdfInfo.fileName}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-6">
            <SidebarButton
              active={activeTab === "chat"}
              onClick={() => handleSetActiveTab("chat")}
              icon={FiMessageSquare}
              label="Chat"
            />
            <SidebarButton
              active={activeTab === "document"}
              onClick={() => handleSetActiveTab("document")}
              icon={FiFileText}
              label="Document"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "chat" ? (
            <div className="h-full flex flex-col">
              <Suspense
                fallback={
                  <div className="p-6 text-gray-500">Loading chat…</div>
                }
              >
                <ChatBox fileId={pdfInfo?.fileId} />
              </Suspense>
            </div>
          ) : (
            <div className="h-full overflow-auto p-6">
              {pdfFile ? (
                <div className="max-w-4xl mx-auto">
                  <Suspense
                    fallback={
                      <div className="p-6 text-gray-500">Loading viewer…</div>
                    }
                  >
                    <PDFViewer file={pdfFile} />
                  </Suspense>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileTextIconLarge />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No Document Selected
                    </h3>
                    <p className="text-gray-500">
                      Upload a PDF document to view it here
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
