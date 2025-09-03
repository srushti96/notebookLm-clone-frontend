# React + Vite

# NotebookLM Clone

A modern React application that mimics Google's NotebookLM functionality, allowing users to upload PDF documents and chat with them using AI.

## Features

- 📄 **PDF Upload & Processing** - Drag & drop or browse to upload PDF files (max 10MB)
- 💬 **AI Chat Interface** - Ask questions about your uploaded documents
- 👁️ **PDF Viewer** - Built-in PDF viewer with zoom and navigation controls
- 🎨 **Modern UI** - Clean, responsive design inspired by Google NotebookLM
- ⚡ **Fast Performance** - Optimized with lazy loading and code splitting

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **PDF Handling**: react-pdf, pdfjs-dist
- **HTTP Client**: Axios
- **Icons**: React Icons (Feather)
- **Backend**: Node.js API (deployed on Render)

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notebookLm-clone-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── components/
│   ├── ChatBox.jsx      # AI chat interface
│   ├── FileUploader.jsx # PDF upload component
│   └── PDFViewer.jsx    # PDF display component
├── services/
│   └── api.js          # API service layer
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## Usage

1. **Upload a PDF**: Drag and drop a PDF file or click "browse" to select one
2. **Start Chatting**: Once uploaded, switch to the "Chat" tab and ask questions
3. **View Document**: Use the "Document" tab to view the PDF with zoom and navigation

## API Integration

The app connects to a backend API deployed on Render:
- **Base URL**: `https://notebooklm-clone-backend-1rmg.onrender.com`
- **Endpoints**:
  - `POST /api/upload` - Upload PDF
  - `POST /api/chat` - Send chat message
  - `GET /api/health` - Health check

## Build & Deploy

```bash
# Build for production
npm run build

# The dist/ folder contains the built application
# Deploy to your preferred hosting service (Vercel, Netlify, etc.)
```

## Features in Detail

### PDF Upload
- Validates file type (PDF only)
- File size limit: 10MB
- Drag & drop support
- Progress indication
- Error handling

### Chat Interface
- Real-time AI responses
- Message history
- Source citations (page numbers)
- Typing indicators
- Error handling

### PDF Viewer
- Page navigation
- Zoom controls (50% - 300%)
- Responsive design
- Loading states

## Performance Optimizations

- Lazy loading for components
- Code splitting for vendor libraries
- Optimized bundle size
- Tree shaking enabled
- CSS code splitting

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+