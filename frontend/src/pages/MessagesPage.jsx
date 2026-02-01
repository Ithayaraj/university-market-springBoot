import { useState, useEffect } from 'react';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const MessagesPage = () => {
    const navigate = useNavigate();
    const { showToast } = useNotification();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await api.get(`/chat/conversations/${user.userId}`);
            setConversations(res.data.data || []);
        } catch (err) {
            showToast('Failed to fetch conversations', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const res = await api.get(`/chat/messages/${conversationId}`);
            setMessages(res.data.data || []);
        } catch (err) {
            showToast('Failed to load messages', 'error');
            console.error(err);
        }
    };

    const handleSelectConversation = (conv) => {
        setSelectedConversation(conv);
        fetchMessages(conv.conversationId);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            await api.post('/chat/send', {
                senderId: user.userId,
                receiverId: selectedConversation.otherUserId,
                productId: selectedConversation.productId,
                content: newMessage
            });
            setNewMessage('');
            fetchMessages(selectedConversation.conversationId);
        } catch (err) {
            showToast('Failed to send message', 'error');
            console.error(err);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">Messages</h1>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden flex h-[600px] transition-colors">
                    {/* Conversations List */}
                    <div className="w-1/3 border-r border-gray-200 dark:border-slate-800 overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-colors">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <MessageCircle size={48} className="mx-auto mb-4 text-gray-300 dark:text-slate-700" />
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.conversationId}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`p-4 border-b border-gray-100 dark:border-slate-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors ${selectedConversation?.conversationId === conv.conversationId ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary font-bold">
                                                {conv.otherUserName?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate transition-colors">{conv.otherUserName}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate transition-colors">{conv.productTitle}</p>
                                            {conv.lastMessage && (
                                                <p className="text-xs text-gray-500 dark:text-gray-500 truncate mt-1 transition-colors">{conv.lastMessage}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 transition-colors">
                        {selectedConversation ? (
                            <>
                                {/* Header */}
                                <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setSelectedConversation(null)}
                                            className="lg:hidden dark:text-white"
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                        <div>
                                            <h2 className="font-bold text-gray-900 dark:text-white transition-colors">{selectedConversation.otherUserName}</h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{selectedConversation.productTitle}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950 transition-colors">
                                    <AnimatePresence>
                                        {messages.map((msg) => (
                                            <motion.div
                                                key={msg.messageId}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${msg.senderId === user.userId ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs px-4 py-2 rounded-2xl ${msg.senderId === user.userId
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-800 transition-colors'
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className={`text-xs mt-1 ${msg.senderId === user.userId ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {new Date(msg.sentAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="btn-primary px-6 py-2 rounded-full disabled:opacity-50"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                <div className="text-center">
                                    <MessageCircle size={64} className="mx-auto mb-4 text-gray-300 dark:text-slate-800" />
                                    <p>Select a conversation to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
