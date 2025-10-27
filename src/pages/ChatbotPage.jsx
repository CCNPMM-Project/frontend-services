import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { sendMessage } from '../services/chatbotService';

// Convert markdown to HTML
const formatMarkdown = (text) => {
  if (!text) return '';
  
  // Split into paragraphs
  const lines = text.split('\n');
  let inList = false;
  let listItems = [];
  let result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if line is a list item
    const numberedMatch = line.match(/^\d+\.\s(.+)$/);
    const bulletMatch = line.match(/^[-*]\s(.+)$/);
    
    if (numberedMatch || bulletMatch) {
      const itemText = numberedMatch ? numberedMatch[1] : bulletMatch[1];
      
      if (!inList) {
        inList = true;
        listItems = [];
      }
      
      // Process markdown in list item
      let processedText = itemText
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      
      listItems.push(`<li>${processedText}</li>`);
      
      // Check if next line is not a list item
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      const isNextListItem = /^(\d+\.|[*-])\s/.test(nextLine);
      
      if (!isNextListItem) {
        result.push(`<ul class="list-disc list-inside space-y-1">${listItems.join('')}</ul>`);
        inList = false;
        listItems = [];
      }
    } else {
      // Not a list item
      if (inList) {
        result.push(`<ul class="list-disc list-inside space-y-1">${listItems.join('')}</ul>`);
        inList = false;
        listItems = [];
      }
      
      if (line) {
        let processedLine = line
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        result.push(`<p class="mb-2">${processedLine}</p>`);
      } else {
        result.push('<br>');
      }
    }
  }
  
  // Process remaining list items
  if (inList && listItems.length > 0) {
    result.push(`<ul class="list-disc list-inside space-y-1">${listItems.join('')}</ul>`);
  }
  
  return result.join('');
};

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: 'Xin chào! Tôi là trợ lý tuyển dụng AI. Tôi có thể giúp bạn tìm việc làm phù hợp. Hãy cho tôi biết bạn đang tìm công việc gì nhé!',
      sender: 'bot',
      jobs: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom khi có tin nhắn mới, nhưng skip lần render đầu tiên
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      jobs: [],
      hasJobs: false
    };

    // Thêm user message vào UI ngay lập tức
    setMessages(prev => [...prev, userMessage]);
    const userInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessage(userInput);

      if (response.success) {
        const botMessage = {
          text: response.message,
          sender: 'bot',
          jobs: response.jobs || [],
          hasJobs: (response.jobs && response.jobs.length > 0)
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau.',
        sender: 'bot',
        jobs: []
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">

      {/* Chat Container */}
      <div className="flex-1 mt-5 max-w-4xl mx-auto w-full p-4 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-2 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div 
                  className="text-sm markdown-container"
                  style={{ textAlign: 'left' }}
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdown(message.text)
                  }}
                />
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Job Cards */}
          {messages.length > 0 && 
           messages[messages.length - 1]?.sender === 'bot' && 
           messages[messages.length - 1]?.jobs?.length > 0 && (
            <div className="space-y-3 mt-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Công việc phù hợp:
              </p>
              {messages[messages.length - 1].jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleJobClick(job._id)}
                >
                  <div className="flex items-start gap-3">
                    {job.company.avatarUrl && (
                      <img
                        src={job.company.avatarUrl}
                        alt={job.company.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {job.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {job.company.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {(job.salary.min / 1000000).toFixed(1)}-{(job.salary.max / 1000000).toFixed(1)} triệu
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                      {job.jobType}
                    </span>
                    {job.experienceLevel && (
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {job.experienceLevel}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;

