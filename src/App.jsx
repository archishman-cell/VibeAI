import { useState, useEffect, useRef } from 'react'
import logo from '/assets/logo.png'
import './App.css'
import apiService from './services/apiService'
import { useTypingAnimation } from './hooks/useTypingAnimation'

function App() {
  
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [improvedPrompt, setImprovedPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [copied, setCopied] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  
  // Ref for auto-scrolling
  const scrollContainerRef = useRef(null)
  const messagesEndRef = useRef(null)
  
  // Use typing animation for the answer and improved prompt
  const displayedAnswer = useTypingAnimation(answer, 2)
  const displayedImprovedPrompt = useTypingAnimation(improvedPrompt, 3)

  // Handle typing completion
  useEffect(() => {
    if (displayedAnswer.length === answer.length && answer.length > 0) {
      setIsTyping(false)
    }
  }, [displayedAnswer.length, answer.length])

  // Auto-scroll functionality
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [displayedAnswer, displayedImprovedPrompt])

  // Scroll to bottom when new content is generated
  useEffect(() => {
    if (answer || improvedPrompt) {
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [answer, improvedPrompt])

  // Handle copy functionality for answer
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Handle copy functionality for improved prompt
  const handlePromptCopy = async () => {
    try {
      await navigator.clipboard.writeText(improvedPrompt)
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy prompt: ', err)
    }
  }

  /**
   * Generates AI response using the API service with prompt suggestion
   */
  async function generate() {  
    // Reset previous error and set loading state
    setError("")
    setIsLoading(true)
    
    // Clear previous answer and input area
    setAnswer("")
    setImprovedPrompt("")
    setQuestion("")
    
    try {
      // Use the API service to generate content with prompt suggestion
      const { answer: response, improvedPrompt: promptSuggestion } = await apiService.generateContentWithPromptSuggestion(question)
      setIsTyping(true)
      setAnswer(response)
      setImprovedPrompt(promptSuggestion)
      
    } catch (error) {
      // Set error message from the API service
      setError(error.message)
    } finally {
      // Always reset loading state
      setIsLoading(false)
    }
              }



  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-50 border-r border-gray-200  flex-col hidden lg:flex">
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
          <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span onClick={() => {
                    setQuestion("")
                    setAnswer("")
                    setImprovedPrompt("")
                    setError("")
                  }}>New Chat</span>
          </button>
          
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

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          {/* Mobile brand (logo + text) */}
          <div className="flex items-center lg:hidden">
            <img src="./assets/logo.png" alt="Logo" className="h-9 w-9" />
            <span className="ml-2 text-base font-semibold text-gray-800">VibeAI</span>
          </div>
          
          <div className="hidden lg:block flex-1"></div>
          <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:text-white transition-normal hover:bg-black  flex items-center space-x-2">
            <span>Upgrade to Pro</span>
          </button>
          <button className="ml-4 p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollContainerRef} className="flex-1 flex flex-col p-4 sm:p-8 pb-24 lg:pb-28 overflow-y-auto">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {!answer && !isLoading && !error && (
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
                  onClick={() => {
                    setQuestion("")
                    setAnswer("")
                    setImprovedPrompt("")
                    setError("")
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Start New Chat
                </button>
              </div>
            )}
            
          
            {/* Loading Animation 
            {isLoading && (
              <div className="w-full max-w-3xl">
                <div className="flex items-start space-x-4 p-6">
                  <img src="./assets/logo.png" alt="Logo" className="w-9 h-9 bg-transparent rounded-lg flex items-center justify-center flex-shrink-0 p-1" />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}*/}
            {/* Loading Animation*/} 
            {isLoading && (
              <div className="max-w-3xl">
                <div className="flex items-start space-x-4 p-6">
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-4 border-1 border-gray-800">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Answer Display with Typing Animation */}
            {answer && !error && (
              <div className="max-w-3xl w-full space-y-4">
                {/* Main Answer */}
                <div className="flex items-start space-x-1">
                  <img src="./assets/logo.png" alt="Logo" className="w-9 h-9 bg-transparent rounded-lg flex items-center justify-center flex-shrink-0 p-1" />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="prose prose-sm max-w-none">
                        <div className="text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                          {displayedAnswer}
                          {isTyping && displayedAnswer.length < answer.length && (
                            <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse"></span>
                          )}
                        </div>
                      </div>
                      {displayedAnswer.length === answer.length && (
                        <div className="mt-4 flex items-center justify-between">
                          <button 
                            onClick={handleCopy}
                            className={`text-sm transition-colors flex items-center space-x-1 ${
                              copied 
                                ? 'text-green-600 font-medium' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {copied ? (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Copy Answer</span>
                              </>
                            )}
                          </button>
                          <span className="text-xs text-gray-400">Just now</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Improved Prompt Suggestion */}
                {improvedPrompt && displayedAnswer.length === answer.length && (
                  <div className="flex items-start space-x-1">
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-sm font-semibold text-blue-800">💡 Improved Prompt Suggestion</h3>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <div className="text-blue-700 whitespace-pre-wrap break-words leading-relaxed">
                            {displayedImprovedPrompt}
                            {displayedImprovedPrompt.length < improvedPrompt.length && (
                              <span className="inline-block w-2 h-5 bg-blue-400 ml-1 animate-pulse"></span>
                            )}
                          </div>
                        </div>
                        {displayedImprovedPrompt.length === improvedPrompt.length && (
                          <div className="mt-3 flex items-center justify-between">
                            <button 
                              onClick={handlePromptCopy}
                              className={`text-sm transition-colors flex items-center space-x-1 ${
                                promptCopied 
                                  ? 'text-green-600 font-medium' 
                                  : 'text-blue-600 hover:text-blue-800'
                              }`}
                            >
                              {promptCopied ? (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  <span>Copy Prompt</span>
                                </>
                              )}
                            </button>
                            <span className="text-xs text-blue-500">Use this for better results</span>
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
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10" style={{bottom: '0'}}>
            <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl p-3 shadow-lg">
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
            <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 p-4 z-20">
              <div className="w-full max-w-4xl mx-auto">
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
    </div>
  )
}

export default App
