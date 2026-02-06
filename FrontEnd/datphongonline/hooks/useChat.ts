import { useState } from 'react';
import axios from 'axios';

interface Message {
    id: string;
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

interface UseChatReturn {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    isOpen: boolean;
    toggleChat: () => void;
}

const API_URL = 'http://localhost:5071/api/Chat/send'; // Adjust port if needed

export const useChat = (): UseChatReturn => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'bot',
            content: 'Chào bạn! Mình có thể giúp gì cho bạn về đặt phòng hôm nay?',
            timestamp: new Date(),
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);
        setError(null);

        try {
            // Get token from localStorage or cookie if needed
            // const token = localStorage.getItem('token'); 
            // For now assuming public or cookie-based auth handling in axios defaults or custom instance

            // Note: You need to ensure axios sends credentials if your backend requires auth
            const res = await axios.post(API_URL, { content }, {
                withCredentials: true // Important for cookies/JWT if backend expects them
            });

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                content: res.data.reply,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err: any) {
            console.error('Chat error:', err);
            const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
            setError(errorMsg);

            // Add error message to chat to inform user
            setMessages((prev) => [...prev, {
                id: Date.now().toString(), // unique id
                role: 'bot',
                content: `⚠️ Lỗi: ${errorMsg}`,
                timestamp: new Date()
            }]);

        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        isOpen,
        toggleChat,
    };
};
