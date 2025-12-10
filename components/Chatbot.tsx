'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! 👋 How can we help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Event-related questions
    if (lowerMessage.includes('change') && (lowerMessage.includes('event') || lowerMessage.includes('time') || lowerMessage.includes('schedule'))) {
      return "Yes, you can change event times after they've been created! Go to your event type settings and update the availability. If there are existing bookings, you can reschedule them individually from the Meetings page."
    }

    if (lowerMessage.includes('create') && (lowerMessage.includes('event') || lowerMessage.includes('meeting'))) {
      return "To create a new event type, click the '+ Create' button in the header or sidebar. You can choose between One-on-One, Group, or Round Robin meetings. Fill in the details like duration, platform, and availability, then save!"
    }

    if (lowerMessage.includes('delete') && (lowerMessage.includes('event') || lowerMessage.includes('meeting'))) {
      return "To delete an event type, click the three-dot menu (⋯) on the event card and select 'Delete'. Note that this won't cancel existing bookings, but it will prevent new ones from being scheduled."
    }

    // Availability questions
    if (lowerMessage.includes('availability') || lowerMessage.includes('available') || lowerMessage.includes('time slot')) {
      return "You can manage your availability in the 'Availability' section in the sidebar. Set your working hours, time zone, and block off specific dates when you're unavailable. Your availability settings apply to all your event types."
    }

    // Link/copy questions
    if (lowerMessage.includes('link') || lowerMessage.includes('share') || lowerMessage.includes('copy')) {
      return "To share your event, click the 'Copy link' button on any event card. This gives you a direct link that you can send to others. They can use it to book a time slot with you!"
    }

    // Duration/time questions
    if (lowerMessage.includes('duration') || lowerMessage.includes('how long') || lowerMessage.includes('length')) {
      return "You can set the duration when creating or editing an event type. Common durations are 15, 30, 45, or 60 minutes. The duration determines how long each booking slot will be."
    }

    // Platform/integration questions
    if (lowerMessage.includes('google meet') || lowerMessage.includes('zoom') || lowerMessage.includes('platform') || lowerMessage.includes('video')) {
      return "You can choose the meeting platform when creating an event type. Options include Google Meet, Zoom, Microsoft Teams, Phone Call, or In Person. The platform link will be automatically included in the confirmation email."
    }

    // Booking/questions
    if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
      return "When someone uses your scheduling link, they'll see your available time slots based on your calendar and availability settings. They can select a time, fill in their details, and the meeting will be automatically added to both calendars!"
    }

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 I'm here to help you with anything related to scheduling. What would you like to know?"
    }

    // Help/questions
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
      return "I'd be happy to help! You can ask me about creating events, managing availability, sharing links, changing event settings, or anything else about scheduling. What specific question do you have?"
    }

    // Default response
    return "Thanks for your question! I understand you're asking about scheduling. Could you provide a bit more detail? For example, are you asking about creating events, managing availability, sharing links, or something else? I'm here to help!"
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim()) return

    const userText = inputValue.trim()

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Generate and send bot response after a short delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userText)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-calendly-blue text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-calendly-blue font-bold text-sm">C</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Calendly Support</h3>
                <p className="text-xs text-blue-100">We typically reply in minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="w-6 h-6 bg-calendly-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 shadow-sm max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-calendly-blue text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-xs font-medium">U</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-calendly-blue focus:border-calendly-blue"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-calendly-blue text-white p-2 rounded-md hover:bg-calendly-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-calendly-blue text-white w-14 h-14 rounded-full shadow-lg hover:bg-calendly-blue-dark hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <span className="text-2xl">×</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </div>
  )
}

