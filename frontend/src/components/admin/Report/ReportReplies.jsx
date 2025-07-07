import React, { useEffect, useRef, useState } from 'react';
import useReportMessages from '../../../hooks/Report/useReportMessages';
import useReplyToReport from '../../../hooks/Report/useReplyToReport';
import { useAuth } from '../../../config/authHeader';
import { motion } from 'framer-motion';
import MessageSkeleton from '../../SkeletonLoading/MessageSkeleton';
import useReportDetails from '../../../hooks/Report/useReportDetails';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/';

const ReportReplies = ({ reportId, limit = 4, disableAutoScroll = false }) => {
    const { user } = useAuth();
    const { messages, loading, refetch } = useReportMessages(reportId);
    const { sendReply, loading: sending } = useReplyToReport();
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef(null);
    const { report, loading: loadingReport } = useReportDetails(reportId);

    const roleColors = {
        Administrateur: {
            bg: 'bg-gradient-to-r from-[#BA28C0] to-purple-800',
            text: 'text-white',
            triangle: 'border-l-[#BA28C0]'
        },
        Utilisateur: {
            bg: 'bg-gradient-to-r from-pink-500 to-[#D232BE]',
            text: 'text-white',
            triangle: 'border-r-pink-500'
        },
        Default: {
            bg: 'bg-gradient-to-r from-pink-400 to-purple-500',
            text: 'text-white',
            triangle: 'border-r-purple-500'
        }
    };

    const handleReply = async () => {
        if (!newMessage.trim()) return;

        await sendReply(reportId, newMessage);
        setNewMessage('');
        await refetch();
    };

    useEffect(() => {
        if (!disableAutoScroll) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, disableAutoScroll]);

    const getStylesByRole = (role) => roleColors[role] || roleColors.Default;
    const displayedMessages = limit ? messages.slice(-limit) : messages;

    return (
        <div className="bg-white p-4 border rounded-md">
            <div className="h-64 overflow-y-auto space-y-4 px-1 flex flex-col">

                {loadingReport ? (
                    <MessageSkeleton align="left" />
                ) : report ? (
                    <div className="flex items-start">
                        <img
                            src={report.reportingUser?.profileImage ? `${REACT_APP_API_BASE_URL}${report.reportingUser.profileImage}` : '/default-avatar.png'}
                            alt="avatar"
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className={`relative max-w-xs px-4 py-2 rounded-xl text-sm shadow-md 
                            ${roleColors.Utilisateur.bg} ${roleColors.Utilisateur.text} rounded-bl-none`}>
                            <p className="font-semibold mb-1">
                                {report.reportingUser?.name} {report.reportingUser?.lastname}
                            </p>
                            <p>{report.message}</p>
                            <p className="text-xs text-white/70 mt-1 text-right">{new Date(report.date_reported).toLocaleString()}</p>
                            <div className="absolute bottom-0 left-0 -translate-x-full w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-[10px] border-r-pink-500" />
                        </div>
                    </div>
                ) : null}

                {loading ? (
                    <div className="space-y-3">
                        <MessageSkeleton align="left" />
                        <MessageSkeleton align="right" />
                        <MessageSkeleton align="left" />
                    </div>
                ) : displayedMessages.length === 0 ? (
                    <p className="text-center text-gray-500">Aucune réponse pour le moment.</p>
                ) : (
                    displayedMessages.map((msg, idx) => {
                        const isAdmin = msg.sender.role === 'Administrateur';
                        const side = isAdmin ? 'right' : 'left';
                        const roleStyle = getStylesByRole(msg.sender.role);

                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                className={`flex items-end ${side === 'right' ? 'justify-end' : 'justify-start'}`}
                            >
                                {side === 'left' && (
                                    <img
                                        src={msg.sender.profileImage ? `${REACT_APP_API_BASE_URL}${msg.sender.profileImage}` : '/default-avatar.png'}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                )}
                                <div className={`relative max-w-xs px-4 py-2 rounded-xl text-sm shadow-md 
                                    ${roleStyle.bg} ${roleStyle.text} ${side === 'right' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                                    <p className="font-semibold mb-1">{msg.sender.name}</p>
                                    <p>{msg.message}</p>
                                    <p className="text-xs text-white/70 mt-1 text-right">{new Date(msg.date_sent).toLocaleString('fr-FR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                    <div className={`absolute bottom-0 ${side === 'right' ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'}
                                        w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent
                                        ${side === 'right' ? `border-l-[10px] ${roleStyle.triangle}` : `border-r-[10px] ${roleStyle.triangle}`}
                                    `} />
                                </div>
                                {side === 'right' && (
                                    <img
                                        src={msg.sender.profileImage ? `${REACT_APP_API_BASE_URL}${msg.sender.profileImage}` : '/default-avatar.png'}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full ml-2"
                                    />
                                )}
                            </motion.div>
                        );
                    })
                )}

                <div ref={bottomRef} />
            </div>

            <div className="mt-4">
                <textarea
                    className="w-full border rounded p-2 text-sm"
                    rows={2}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrire un message..."
                />
                <button
                    onClick={handleReply}
                    disabled={sending}
                    className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-pink-700 text-sm w-full"
                >
                    {sending ? 'Envoi...' : 'Envoyer'}
                </button>
            </div>
        </div>
    );
};

export default ReportReplies;