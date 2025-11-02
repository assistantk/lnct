"use client"

import { useState, useEffect, useRef } from "react"
import {
  MessageCircle,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Send,
  User,
  Bot,
  Keyboard,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Lightbulb,
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import "./ChatBot.css" // Make sure you have this CSS file with your styles

export default function ModernChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: uuidv4(),
      text: "Hi! I'm UniBot, your AI assistant for university information. I can help you with admissions, courses, campus life, and more. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "Tell me about admission requirements",
        "What courses do you offer?",
        "How can I schedule a campus tour?",
        "What financial aid options are available?",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [botStatus, setBotStatus] = useState("Online")
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Voice recognition states
  const [isListening, setIsListening] = useState(false)
  const [isVoiceSupported, setIsVoiceSupported] = useState(false)
  const [voiceError, setVoiceError] = useState(null)
  const [lastVoiceCommand, setLastVoiceCommand] = useState(null)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true)
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)

  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [voiceTranscription, setVoiceTranscription] = useState({
    isActive: false,
    transcript: "",
    interimTranscript: "",
    confidence: 0,
    isListening: false,
    error: null,
  })
  const [transcriptionHistory, setTranscriptionHistory] = useState([])

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  const keyboardShortcuts = [
    { key: "Esc", description: "Close chat window" },
    { key: "Enter", description: "Send message" },
    { key: "Shift + Enter", description: "Add new line" },
    { key: "Ctrl + B", description: "Clear chat history" },
    { key: "Ctrl + M", description: "Maximize/minimize chat" },
    { key: "Ctrl + V", description: "Toggle voice recognition" },
    { key: "?", description: "Show/hide keyboard shortcuts" },
  ]

  const voiceCommands = [
    {
      command: "send message",
      action: () => handleSendMessage(),
      description: "Send the current message",
    },
    {
      command: "clear chat",
      action: () => clearChat(),
      description: "Clear chat history",
    },
    {
      command: "close chat",
      action: () => setIsOpen(false),
      description: "Close the chat window",
    },
    {
      command: "maximize chat",
      action: () => setIsMaximized(true),
      description: "Maximize chat window",
    },
    {
      command: "minimize chat",
      action: () => setIsMaximized(false),
      description: "Minimize chat window",
    },
    {
      command: "show shortcuts",
      action: () => setShowShortcuts(true),
      description: "Show keyboard shortcuts",
    },
    {
      command: "hide shortcuts",
      action: () => setShowShortcuts(false),
      description: "Hide keyboard shortcuts",
    },
    {
      command: "stop listening",
      action: () => stopListening(),
      description: "Stop voice recognition",
    },
  ]

  // NOTE: The hardcoded `getContextualResponse` function has been removed.
  // The bot's logic is now handled by the backend server via an API call.

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const speechSynthesis = window.speechSynthesis

      if (SpeechRecognition) {
        setIsVoiceSupported(true)
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onstart = () => {
          setIsListening(true)
          setVoiceError(null)
          setIsProcessingVoice(false)
          setVoiceTranscription((prev) => ({ ...prev, isListening: true, error: null }))
        }

        recognition.onresult = (event) => {
          let finalTranscript = ""
          let interimTranscript = ""
          let confidence = 0

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            confidence = event.results[i][0].confidence

            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          if (interimTranscript) {
            setInputValue(interimTranscript)
            setVoiceTranscription((prev) => ({ ...prev, interimTranscript }))
          }

          if (finalTranscript) {
            setIsProcessingVoice(true)
            const command = finalTranscript.toLowerCase().trim()
            setLastVoiceCommand(command)
            setVoiceTranscription((prev) => ({ ...prev, transcript: finalTranscript, confidence, interimTranscript: "" }))
            setTranscriptionHistory((prev) => [...prev, finalTranscript])

            const matchedCommand = voiceCommands.find((vc) => command.includes(vc.command.toLowerCase()))

            if (matchedCommand) {
              setInputValue("")
              matchedCommand.action()
              setTimeout(() => {
                setLastVoiceCommand(null)
                setIsProcessingVoice(false)
              }, 2000)
            } else {
              setInputValue(finalTranscript.trim())
              setIsProcessingVoice(false)
              if (showVoiceModal) {
                setTimeout(() => {
                  handleSendMessage(finalTranscript.trim())
                  setShowVoiceModal(false)
                }, 1000)
              }
            }
          }
        }

        recognition.onerror = (event) => {
          setVoiceError(`Voice recognition error: ${event.error}`)
          setIsListening(false)
          setIsProcessingVoice(false)
          setVoiceTranscription((prev) => ({ ...prev, isListening: false, error: `Error: ${event.error}` }))
        }

        recognition.onend = () => {
          setIsListening(false)
          setIsProcessingVoice(false)
          setVoiceTranscription((prev) => ({ ...prev, isListening: false }))
        }

        recognitionRef.current = recognition
      }

      if (speechSynthesis) {
        synthRef.current = speechSynthesis
      }
    }
    // eslint-disable-next-line
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      if (e.key === "?" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        setShowShortcuts((prev) => !prev)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
        setShowShortcuts(false)
        stopListening()
      }
      if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        clearChat()
      }
      if (e.key === "m" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setIsMaximized((prev) => !prev)
      }
      if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        toggleListening()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line
  }, [isOpen, isListening])

  const startListening = () => {
    if (recognitionRef.current && isVoiceSupported) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        setVoiceError("Could not start voice recognition")
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const openVoiceModal = () => {
    setShowVoiceModal(true)
    setVoiceTranscription({
      isActive: true,
      transcript: "",
      interimTranscript: "",
      confidence: 0,
      isListening: false,
      error: null,
    })
    setTimeout(() => {
      startListening()
    }, 300)
  }

  const closeVoiceModal = () => {
    stopListening()
    setShowVoiceModal(false)
    setVoiceTranscription((prev) => ({ ...prev, isActive: false }))
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      if (showVoiceModal) {
        startListening()
      } else {
        openVoiceModal()
      }
    }
  }

  const speakText = (text) => {
    if (synthRef.current && isSpeechEnabled) {
      synthRef.current.cancel()
      const cleanText = text.replace(/[*•#]/g, "").replace(/\n/g, " ")
      const utterance = new window.SpeechSynthesisUtterance(cleanText)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      synthRef.current.speak(utterance)
    }
  }

  const toggleSpeech = () => {
    setIsSpeechEnabled((prev) => !prev)
    if (synthRef.current) {
      synthRef.current.cancel()
    }
  }

  const handleSendMessage = async (manualMessage) => {
    let messageToSend = manualMessage !== undefined ? manualMessage : inputValue

    if (typeof messageToSend !== "string") {
      messageToSend = inputValue
    }

    if (!messageToSend || !messageToSend.trim()) return

    const userInput = messageToSend.trim()
    const newMessage = {
      id: uuidv4(),
      text: userInput,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsTyping(true)
    setBotStatus("Thinking...")

    if (isListening) {
      stopListening()
    }

    try {
      // Call your Express backend
      const apiResponse = await fetch("https://lnctworld.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      })

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`)
      }

      const response = await apiResponse.json()

      const botResponse = {
        id: uuidv4(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, botResponse])

      if (isSpeechEnabled) {
        speakText(response.text)
      }
    } catch (error) {
      console.error("Failed to fetch from chatbot API:", error)
      const errorResponse = {
        id: uuidv4(),
        text: "I'm sorry, but I'm having trouble connecting to my brain right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
        suggestions: [],
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
      setBotStatus("Online")
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion)
    inputRef.current?.focus()
  }

  const clearChat = () => {
    setMessages([
      {
        id: uuidv4(),
        text: "Hi! I'm UniBot, your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
        suggestions: [
          "Tell me about admission requirements",
          "What courses do you offer?",
          "How can I schedule a campus tour?",
          "What financial aid options are available?",
        ],
      },
    ])
    if (synthRef.current) {
      synthRef.current.cancel()
    }
  }

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleShortcuts = () => {
    setShowShortcuts((prev) => !prev)
  }

  // --- JSX Rendering ---
  return (
    <div className="chatbot-theme chatbot-container">
      <button
        className={`chat-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
        title="Open chat (? for keyboard shortcuts)"
      >
        <div className="toggle-icon">{isOpen ? <X size={24} /> : <MessageCircle size={24} />}</div>
        <div className="ripple-effect" />
      </button>

      <div className={`chat-window ${isOpen ? "open" : ""} ${isMaximized ? "fullscreen" : ""}`}>
        <div className="chat-backdrop" />

        <div className="chat-header">
          <div className="bot-info-section">
            <div className="bot-avatar">
              <Bot size={20} />
              <div className="status-indicator" />
            </div>
            <div className="bot-details">
              <h3>UniBot</h3>
              <span className="status">{botStatus}</span>
            </div>
          </div>

          <div className="header-controls">
            {isVoiceSupported && (
              <button
                className="control-btn"
                onClick={toggleSpeech}
                title={`${isSpeechEnabled ? "Disable" : "Enable"} text-to-speech`}
                aria-label="Toggle text-to-speech"
              >
                {isSpeechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            )}
            <button
              className="control-btn"
              onClick={toggleShortcuts}
              title="Keyboard shortcuts (?)"
              aria-label="Show keyboard shortcuts"
            >
              <Keyboard size={16} />
            </button>
            <button
              className="control-btn"
              onClick={() => setIsMaximized(!isMaximized)}
              title="Maximize/minimize (Ctrl+M)"
              aria-label="Maximize or minimize chat window"
            >
              {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              className="control-btn"
              onClick={clearChat}
              title="Clear chat (Ctrl+B)"
              aria-label="Clear chat history"
            >
              <Trash2 size={16} />
            </button>
            <button
              className="control-btn close-btn"
              onClick={() => setIsOpen(false)}
              title="Close (Esc)"
              aria-label="Close chat window"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {showShortcuts && (
          <div className="shortcuts-panel">
            <div className="shortcuts-header">
              <h4>Keyboard Shortcuts & Voice Commands</h4>
              <button
                className="close-shortcuts"
                onClick={() => setShowShortcuts(false)}
                aria-label="Close shortcuts panel"
              >
                <X size={16} />
              </button>
            </div>
            <div className="shortcuts-content">
              <div className="shortcuts-section">
                <h5>Keyboard Shortcuts</h5>
                <div className="shortcuts-list">
                  {keyboardShortcuts.map((shortcut, index) => (
                    <div key={index} className="shortcut-item">
                      <kbd>{shortcut.key}</kbd>
                      <span>{shortcut.description}</span>
                    </div>
                  ))}
                </div>
              </div>
              {isVoiceSupported && (
                <div className="shortcuts-section">
                  <h5>Voice Commands</h5>
                  <div className="voice-commands-list">
                    {voiceCommands.slice(0, 8).map((command, index) => (
                      <div key={index} className="voice-command-item">
                        <span className="command">"{command.command}"</span>
                        <span className="description">{command.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="messages-area">
          <div className="messages-pattern" />
          {messages.map((message, index) => (
            <div key={message.id}>
              <div
                className={`message ${message.isUser ? "user" : "bot"}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="message-avatar">{message.isUser ? <User size={16} /> : <Bot size={16} />}</div>
                <div className="message-bubble">
                  {/* Using dangerouslySetInnerHTML to render markdown from Gemini if needed.
                      For simple text, <p>{message.text}</p> is safer.
                      For a more robust solution, use a library like 'react-markdown'.
                  */}
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>

              {!isTyping && messages.length -1 === index && message.suggestions && message.suggestions.length > 0 && (
                <div className="suggestions-container">
                  <div className="suggestions-header">
                    <Lightbulb size={14} />
                    <span>Suggested questions:</span>
                  </div>
                  <div className="suggestions-list">
                    {message.suggestions.map((suggestion, suggestionIndex) => (
                      <button
                        key={suggestionIndex}
                        className="suggestion-btn"
                        onClick={() => handleSendMessage(suggestion)} // Updated to call handleSendMessage directly
                        style={{ animationDelay: `${suggestionIndex * 0.1}s` }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="message bot typing-message">
              <div className="message-avatar">
                <Bot size={16} />
              </div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-backdrop" />
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask me anything about the university..."
              className="message-input"
              aria-label="Message input"
              disabled={isTyping}
            />
            {isVoiceSupported && (
              <button
                className={`voice-btn ${isListening ? "listening" : ""} ${isProcessingVoice ? "processing" : ""}`}
                onClick={toggleListening}
                disabled={isProcessingVoice || isTyping}
                title={isListening ? "Stop listening (Ctrl+V)" : "Start voice input (Ctrl+V)"}
                aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                {isListening && <div className="voice-pulse" />}
              </button>
            )}
            <button
              className="send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              title="Send message (Enter)"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}