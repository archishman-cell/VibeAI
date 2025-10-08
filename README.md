# VibeAI 🤖

VibeAI is a modern, responsive AI chat application built with React and Vite. It provides a seamless and intuitive user experience for interacting with an AI, with a focus on providing high-quality responses and prompt suggestions.

## 🌐 Live Demo

[**View the live project here!**](https://vibe-ai-silk.vercel.app) 🚀

## ✨ Features

### 🎨 Enhanced Text Display
*   **📝 Markdown Rendering:** Rich text formatting with proper headings, lists, code blocks, and styling
*   **🎨 Syntax Highlighting:** Beautiful code syntax highlighting for multiple programming languages
*   **📊 Table Support:** Properly formatted tables with GitHub Flavored Markdown
*   **💬 Blockquotes & Emphasis:** Enhanced typography with quotes, bold, and italic text support

### 🤖 AI Interaction
*   **🤖 AI Chat:** Ask questions and get intelligent, well-formatted answers from Google Gemini API
*   **💡 Prompt Improvement:** VibeAI suggests improved prompts to help you get even better responses
*   **✒️ Typing Animation:** Watch the AI\'s response and prompt suggestions unfold with smooth typing animation
*   **📋 Enhanced Copy:** Copy formatted text with individual section copying capabilities
*   **💬 Chat History:** Save and revisit your previous conversations, stored locally in your browser.
*   **🗑️ Clear History:** Easily clear your entire chat history and start fresh.

### 🛡️ Reliability & Performance
*   **🔄 Robust Error Handling:** Comprehensive error handling with 60-second timeouts and user-friendly messages
*   **⏳ Enhanced Loading:** Beautiful loading animations with content placeholders
*   **📱 Mobile-First Design:** 90% mobile compatibility with responsive design and auto-scroll functionality
*   **📁 Collapsible Sidebar:** A collapsible sidebar to easily navigate and manage your chats.
*   **🔎 Search:** (Coming Soon) Quickly search through your chat history.
*   **🖼️ Gallery:** (Coming Soon) A gallery to showcase AI-generated images or other media.
*   **👤 User Profiles:** (Coming Soon) Personalize your VibeAI experience with user profiles.
*   **🚀 Upgrade to Pro:** (Coming Soon) Unlock advanced features with a Pro subscription.

## 🚀 Getting Started

### Prerequisites

*   Node.js (v14 or later)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/VibeAI.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd VibeAI
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

### Running the Application

```bash
npm run dev
```
or
```bash
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🛠️ Built With

### Core Technologies
*   [React](https://reactjs.org/) - A JavaScript library for building user interfaces
*   [Vite](https://vitejs.dev/) - Next-generation front-end tooling for fast development
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for responsive design

### Enhanced Text Rendering
*   [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown component for React
*   [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - Syntax highlighting for code blocks
*   [Remark GFM](https://github.com/remarkjs/remark-gfm) - GitHub Flavored Markdown support
*   [Rehype Raw](https://github.com/rehypejs/rehype-raw) - Raw HTML support in markdown

### API Integration
*   [Google Gemini API](https://ai.google.dev/) - Advanced AI language model
*   [Axios](https://axios-http.com/) - HTTP client for API requests
*   Custom service layer architecture for robust error handling
