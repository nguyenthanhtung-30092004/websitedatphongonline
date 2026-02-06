import React from 'react';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

interface ChatMessageProps {
    role: 'user' | 'bot';
    content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
    const isUser = role === 'user';

    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
                <Avatar
                    icon={isUser ? <UserOutlined /> : <RobotOutlined />}
                    className={isUser ? 'bg-blue-500' : 'bg-green-500'}
                />
                <div
                    className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${isUser
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                        }`}
                >
                    {content}
                </div>
            </div>
        </div>
    );
};
