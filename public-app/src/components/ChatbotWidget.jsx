import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChatbubbleEllipses, IoClose } from 'react-icons/io5';
import { MdSend } from 'react-icons/md';
import { getChatbotResponse } from '../services/chatbotService';

const WidgetContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const FloatingButton = styled(motion.button)`
  background: var(--primary-color, #007bff);
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: background 0.3s ease;

  &:hover {
    background: var(--primary-dark, #0056b3);
  }
`;

const ChatWindowContainer = styled(motion.div)`
  width: 350px;
  height: 500px;
  background: var(--bg-color, #ffffff);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid var(--border-color, #e0e0e0);

  @media (max-width: 400px) {
    width: calc(100vw - 48px);
    height: 400px;
  }
`;

const ChatHeader = styled.div`
  background: var(--primary-color, #007bff);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  button {
    background: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--bg-secondary, #f8f9fa);
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 0.95rem;
  line-height: 1.4;
  word-wrap: break-word;
  
  ${(props) =>
    props.isUser
      ? `
    background: var(--primary-color, #007bff);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  `
      : `
    background: white;
    color: var(--text-primary, #333);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border: 1px solid var(--border-color, #e0e0e0);
  `}
`;

const ChatInputContainer = styled.form`
  display: flex;
  padding: 12px;
  background: white;
  border-top: 1px solid var(--border-color, #e0e0e0);
  align-items: center;
  gap: 8px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 24px;
  font-size: 0.95rem;
  outline: none;
  background: var(--bg-color, #ffffff);
  color: var(--text-primary, #333);

  &:focus {
    border-color: var(--primary-color, #007bff);
  }
`;

const SendButton = styled.button`
  background: var(--primary-color, #007bff);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.2s;

  &:disabled {
    background: var(--text-muted, #999);
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark, #0056b3);
  }
`;

const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: white;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  align-self: flex-start;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid var(--border-color, #e0e0e0);

  span {
    width: 6px;
    height: 6px;
    background: var(--text-muted, #999);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  span:nth-child(1) { animation-delay: -0.32s; }
  span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;


const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your virtual assistant. How can I help you today?", isUser: false }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const responseText = await getChatbotResponse(userMessage.text);
      const botMessage = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get chatbot response", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WidgetContainer>
      <AnimatePresence>
        {isOpen && (
          <ChatWindowContainer
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ChatHeader>
              <h3>Assistant</h3>
              <button onClick={toggleChat} aria-label="Close Chat">
                <IoClose />
              </button>
            </ChatHeader>
            
            <ChatBody ref={chatBodyRef}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} isUser={msg.isUser}>
                  {msg.text}
                </MessageBubble>
              ))}
              {isLoading && (
                <LoadingDots>
                  <span /><span /><span />
                </LoadingDots>
              )}
            </ChatBody>

            <ChatInputContainer onSubmit={handleSendMessage}>
              <ChatInput
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
              />
              <SendButton type="submit" disabled={!inputText.trim() || isLoading} aria-label="Send Message">
                <MdSend />
              </SendButton>
            </ChatInputContainer>
          </ChatWindowContainer>
        )}
      </AnimatePresence>

      <FloatingButton
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle Chat"
      >
        {isOpen ? <IoClose /> : <IoChatbubbleEllipses />}
      </FloatingButton>
    </WidgetContainer>
  );
};

export default ChatbotWidget;
