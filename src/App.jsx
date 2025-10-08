import { useState, useEffect, useRef } from 'react'
import logo from '/assets/logo.png'
import './App.css'
import apiService from './services/apiService'
import { useTypingAnimation } from './hooks/useTypingAnimation'
import MarkdownRenderer from './components/MarkdownRenderer'
import CopyButton from './components/CopyButton'
import LoadingAnimation from './components/LoadingAnimation'
import ResponseSection from './components/ResponseSection'
import AboutModal from './components/AboutModal'

function App() {
  
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [improvedPrompt, setImprovedPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [userScrolledUp, setUserScrolledUp] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState("")
  
  // Ref for auto-scrolling
  const scrollContainerRef = useRef(null)
  const appMenuRef = useRef(null)
  const messagesEndRef = useRef(null)
  const abortControllerRef = useRef(null)
  
  // Use typing animation for the answer and improved prompt
  const displayedAnswer = useTypingAnimation(answer, 2, !isTyping)
  const displayedImprovedPrompt = useTypingAnimation(improvedPrompt, 3, !isTyping)

  // Load chat history from local storage on component mount
  useEffect(() => {
    const savedChatHistory = localStorage.getItem('chatHistory');
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }
  }, []);

  // Effect to handle clicks outside the app menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (appMenuRef.current && !appMenuRef.current.contains(event.target)) {
        setIsAppMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [appMenuRef]);

  // Handle typing completion
  useEffect(() => {
    if (displayedAnswer.length === answer.length && answer.length > 0) {
      setIsTyping(false)
    }
  }, [displayedAnswer.length, answer.length])

  // Detect user scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
        setUserScrolledUp(!isAtBottom);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Auto-scroll functionality - only scroll if user hasn't scrolled up
  useEffect(() => {
    if (answer && !userScrolledUp) {
      // Only scroll if user is at the bottom
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [answer, userScrolledUp])

  // Scroll to bottom when new content is generated
{/*
  useEffect(() => {
    if (answer || improvedPrompt) {
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [answer, improvedPrompt])
*/}

  /**
   * Generates AI response using the API service with prompt suggestion
   */
  async function generate() {  
    // Reset previous error and set loading state
    setError("")
    setIsLoading(true)
    setUserScrolledUp(false) // Reset scroll state for new question
    
    // Store the current question before clearing it
    const questionToProcess = question;
    setCurrentQuestion(questionToProcess);
    
    // Clear previous answer and input area
    setAnswer("")
    setImprovedPrompt("")
    setQuestion("")
    
    try {
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      // Use the API service to generate content with prompt suggestion
      const { answer: response, improvedPrompt: promptSuggestion } = await apiService.generateContentWithPromptSuggestion(questionToProcess, { signal })
      setIsTyping(true)
      setAnswer(response)
      setImprovedPrompt(promptSuggestion)

      // Create a new chat item and add it to the history
      const newChatItem = { question: questionToProcess, answer: response, improvedPrompt: promptSuggestion };
      const updatedChatHistory = [...chatHistory, newChatItem];
      setChatHistory(updatedChatHistory);

      // Save updated chat history to local storage
      localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
      
      // Clear current question after successful response
      setCurrentQuestion("");
      
    } catch (error) {
      // Don't show an error if the user stopped the generation
      if (error.message === "Generation stopped by user.") {
        console.log("Generation successfully stopped.");
      } else {
        // Set error message from the API service
        setError(error.message);
      }
    } finally {
      // Always reset loading state
      setIsLoading(false)
    }
              }


  /**
   * Stops the AI response generation
   */
  function stopGeneration() {
    if (isLoading) {
      abortControllerRef.current?.abort();
    }
  }

  /**
   * Resets the chat state to start a new conversation.
   */
  const startNewChat = () => {
    setQuestion("");
    setAnswer("");
    setImprovedPrompt("");
    setError("");
    setCurrentQuestion("");
    setIsSidebarOpen(false); // Close sidebar on mobile after action
  };

  /**
   * Clears all chat history and resets the conversation.
   */
  const clearChatHistory = () => {
    setChatHistory([]);
    setQuestion("");
    setAnswer("");
    setImprovedPrompt("");
    setError("");
    setCurrentQuestion("");
    localStorage.removeItem('chatHistory');
    setIsSidebarOpen(false); // Close sidebar on mobile after action
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-50 border-r border-gray-200 flex-col z-40 lg:flex transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <img src="./assets/logo.png" alt="Logo"  className="h-5 w-5 text-white" />
            
            <span className="text-lg font-semibold text-gray-800">VibeAI</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          <button onClick={startNewChat} className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>New Chat</span>
          </button>
          
          {chatHistory.length > 0 && (
            <button onClick={clearChatHistory} className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear History</span>
            </button>
          )}
          
          <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Gallery</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">U</span>
            </div>
            <span className="text-sm text-gray-600">User</span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col h-screen transition-all duration-300 ease-in-out">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-3 lg:p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          {/* Hamburger Menu for Mobile */}
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 hover:text-gray-800 lg:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="hidden lg:block flex-1"></div>
          <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:text-white transition-normal hover:bg-black  flex items-center space-x-2">
            <span>Upgrade to Pro</span>
          </button>
          <div ref={appMenuRef} className="relative ml-4">
            <button onClick={() => setIsAppMenuOpen(!isAppMenuOpen)} className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            {isAppMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <button
                  onClick={() => {
                    setIsAboutModalOpen(true);
                    setIsAppMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  About
                </button>
                <button
                  onClick={() => console.log('Export Chat clicked')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export Chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollContainerRef} className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 pb-32 lg:pb-40 overflow-y-auto">
          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="w-full max-w-4xl mx-auto space-y-6">
              {chatHistory.map((chatItem, index) => (
                <div key={index} className="space-y-4">
                  {/* User Question */}
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-wrap">{chatItem.question}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start space-x-4">
                    <img src="./assets/logo.png" alt="Logo" className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="prose prose-sm max-w-none">
                          <MarkdownRenderer 
                            content={chatItem.answer}
                            className="text-gray-800"
                          />
                        </div>
                        {chatItem.improvedPrompt && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-sm font-semibold text-blue-800">💡 Improved Prompt Suggestion</h3>
                            </div>
                            <div className="text-blue-700 text-sm">
                              <MarkdownRenderer 
                                content={chatItem.improvedPrompt}
                                className="text-blue-700"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {chatHistory.length === 0 && !answer && !isLoading && !error && (
              <div className="text-center max-w-2xl">
                <h1 className="text-2xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8">What can I help with?</h1>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="w-full max-w-3xl">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={startNewChat}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Start New Chat
                </button>
              </div>
            )}

            {/* Current Message Display */}
            {currentQuestion && (
              <div className="w-full max-w-4xl mx-auto space-y-4">
                {/* Current User Question */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{currentQuestion}</p>
                    </div>
                  </div>
                </div>

                {/* Loading Animation */}
                {isLoading && (
                  <div className="flex items-start space-x-4">
                    <img src="./assets/logo.png" alt="Logo" className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <LoadingAnimation />
                      </div>
                    </div>
                  </div>
                )}

                {/* Current AI Response */}
                {answer && !error && (
                  <div className="flex items-start space-x-4">
                    <img src="./assets/logo.png" alt="Logo" className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="prose prose-sm max-w-none">
                          <div className="text-gray-800">
                            <MarkdownRenderer 
                              content={displayedAnswer}
                              className="text-gray-800"
                            />
                            {isTyping && displayedAnswer.length < answer.length && (
                              <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse"></span>
                            )}
                          </div>
                        </div>
                        {improvedPrompt && displayedAnswer.length === answer.length && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-sm font-semibold text-blue-800">💡 Improved Prompt Suggestion</h3>
                            </div>
                            <div className="text-blue-700 text-sm">
                              <div>
                                <MarkdownRenderer 
                                  content={displayedImprovedPrompt}
                                  className="text-blue-700"
                                />
                                {displayedImprovedPrompt.length < improvedPrompt.length && (
                                  <span className="inline-block w-2 h-5 bg-blue-400 ml-1 animate-pulse"></span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Input Area - Mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-2 z-10">
            <div className="flex flex-col items-center w-full">
            </div>
            <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl p-2 shadow-lg">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything"
                className="flex-1 px-3 py-2 border-none outline-none resize-none text-gray-800 placeholder-gray-400 max-h-32"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generate();
                  }
                }}
              />
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <button 
                  onClick={generate}
                  disabled={isLoading || !question.trim()}
                  className={`p-2 rounded-lg transition-all ${
                    isLoading || !question.trim()
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-800'
                  }`}
                >
                  
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Input Area - Desktop */}
          <div className="hidden lg:block">
            <div className="fixed bottom-0 left-64 right-0 bg-white/80 backdrop-blur-sm p-4 z-20">
              <div className="w-full max-w-4xl mx-auto flex flex-col items-center">


                {/* Input Field */}
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask anything"
                    className="flex-1 px-4 py-2 border-none outline-none resize-none text-gray-800 placeholder-gray-400"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        generate();
                      }
                    }}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8" />
                      </svg>
                    </button>
                    <button 
                      onClick={generate}
                      disabled={isLoading || !question.trim()}
                      className={`p-2 rounded-lg transition-all ${
                        isLoading || !question.trim()
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-800 text-white hover:bg-grey-800'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </div>
  )
}

export default App
