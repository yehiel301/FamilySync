import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../UserContext';
import moment from 'moment';

const Chat = () => {
    const { currentUser } = useUser();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socket = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!currentUser?.familyId) return;

        // Connect to the family-specific chat endpoint
        socket.current = new WebSocket(`ws://localhost:8080/chat/${currentUser.familyId}`);

        socket.current.onopen = () => console.log("WebSocket connection established.");
        socket.current.onclose = () => console.log("WebSocket connection closed.");

        socket.current.onmessage = (event) => {
            try {
                const receivedMessage = JSON.parse(event.data);
                setMessages(prevMessages => [...prevMessages, receivedMessage]);
            } catch (error) {
                console.error("Error parsing incoming message:", error);
            }
        };

        return () => {
            if (socket.current) socket.current.close();
        };
    }, [currentUser]);

    const handleSendMessage = () => {
        if (socket.current?.readyState === WebSocket.OPEN && newMessage.trim() && currentUser) {
            const chatMessage = {
                sender: currentUser.name || 'Anonymous',
                content: newMessage,
            };
            socket.current.send(JSON.stringify(chatMessage));
            setNewMessage('');
        }
    };

    const handleDeleteHistory = async () => {
        if (!currentUser?.familyId || !window.confirm("האם אתה בטוח שברצונך למחוק את כל היסטוריית הצ'אט? לא ניתן לשחזר פעולה זו.")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/chat/${currentUser.familyId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessages([]); // Clear messages on client side
                alert("היסטוריית הצ'אט נמחקה.");
            } else {
                throw new Error('Failed to delete chat history.');
            }
        } catch (error) {
            console.error(error);
            alert("שגיאה במחיקת היסטוריית הצ'אט.");
        }
    };

    if (!currentUser) {
        return <div className="p-4">טוען...</div>;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-surface-container-low rounded-2xl shadow-lg m-4">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center">
                <h1 className="text-2xl font-bold text-on-surface">צ'אט משפחתי</h1>
                <button onClick={handleDeleteHistory} className="p-2 text-on-surface-variant hover:text-error transition-colors" title="מחק היסטוריה">
                    <span className="material-symbols-outlined">delete_history</span>
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-4 ${msg.sender === currentUser.name ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === currentUser.name ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}>
                            <p className="text-xs font-bold opacity-80 mb-1">{msg.sender}</p>
                            <p className="text-base whitespace-pre-wrap">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1 text-right">{moment(msg.timestamp).format('HH:mm')}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-surface-container">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="כתוב הודעה..."
                        className="flex-1 p-3 bg-surface-container-highest rounded-full border-0 focus:ring-2 focus:ring-primary transition-shadow text-on-surface"
                    />
                    <button onClick={handleSendMessage} className="p-3 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors shadow-md disabled:bg-on-surface-variant/50" disabled={!newMessage.trim()}>
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;