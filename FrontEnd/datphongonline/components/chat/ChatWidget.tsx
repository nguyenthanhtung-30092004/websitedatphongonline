"use client";

import React, { useRef, useEffect } from 'react';
import { Button, Input, Card } from 'antd';
import { MessageOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';

export const ChatWidget = () => {
    const { messages, isLoading, sendMessage, isOpen, toggleChat } = useChat();
    const [inputValue, setInputValue] = React.useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        const text = inputValue;
        setInputValue('');
        await sendMessage(text);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card
                    className="mb-4 w-[350px] md:w-[400px] h-[500px] shadow-2xl flex flex-col overflow-hidden border-0"
                    styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}
                    title={
                        <div className="flex items-center gap-2 text-white">
                            <MessageOutlined />
                            <span>Trợ Lý Ảo (AI)</span>
                        </div>
                    }
                    extra={
                        <Button
                            type="text"
                            icon={<CloseOutlined className="text-white" />}
                            onClick={toggleChat}
                            className="hover:bg-white/20 text-white"
                        />
                    }
                    headStyle={{ backgroundColor: '#1677ff', color: 'white', border: 0 }}
                >
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                        ))}
                        {isLoading && (
                            <div className="text-gray-400 text-xs ml-10 italic mb-2">
                                Đang soạn tin...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <Input
                            placeholder="Nhập câu hỏi..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPressEnter={handleSend}
                            ref={inputRef}
                            disabled={isLoading}
                            className="rounded-full hover:border-blue-400 focus:border-blue-500"
                        />
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SendOutlined />}
                            onClick={handleSend}
                            loading={isLoading}
                            disabled={!inputValue.trim()}
                        />
                    </div>
                </Card>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    className="h-14 w-14 shadow-lg animate-bounce-subtle"
                    icon={<MessageOutlined style={{ fontSize: '24px' }} />}
                    onClick={toggleChat}
                />
            )}
        </div>
    );
};
