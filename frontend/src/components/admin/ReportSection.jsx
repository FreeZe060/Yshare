import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateReportStatus } from '../../services/reportService';
import useReports from '../../hooks/Report/useReports';
import { useAuth } from '../../config/authHeader';
import { showConfirmation } from '../../utils/showConfirmation';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Dialog } from '@headlessui/react';
import { XIcon, ReplyIcon, EyeIcon } from 'lucide-react';
import useReportMessages from '../../hooks/Report/useReportMessages';
import useReplyToReport from '../../hooks/Report/useReplyToReport';
import RowSkeletonReport from '../SkeletonLoading/RowSkeletonReport';
import ReportDetailsPopup from './ReportDetailsPopup';

const isImage = (file) => /\.(jpg|jpeg|png|gif)$/i.test(file.file_path);
const isPdf = (file) => /\.pdf$/i.test(file.file_path);

const ReportReplies = ({ reportId }) => {
    const { messages, loading } = useReportMessages(reportId);
    const { sendReply, loading: sending } = useReplyToReport();
    const [newMessage, setNewMessage] = useState('');

    const handleReply = async () => {
        if (!newMessage.trim()) return;
        await sendReply(reportId, newMessage);
        setNewMessage('');
    };

    return (
        <div className="bg-gray-50 border-t border-gray-200 p-4">
            {loading ? <p>Chargement des réponses...</p> : (
                <div className="space-y-2">
                    {messages.length === 0 ? (
                        <p>Aucune réponse pour le moment.</p>
                    ) : messages.map(msg => (
                        <div key={msg.id} className="border p-2 rounded">
                            <p className="text-sm text-gray-600">{new Date(msg.date_sent).toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{msg.sender.name}</p>
                            <p>{msg.message}</p>
                        </div>
                    ))}

                    <div className="mt-2">
                        <textarea
                            className="w-full border rounded p-2"
                            rows={3}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Répondre à ce signalement..."
                        />
                        <button
                            onClick={handleReply}
                            disabled={sending}
                            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const getReportContentPreview = (report) => {
    return report.message?.slice(0, 30) + '...';
};

const getReportTypeIcon = (report, onClick) => {
    if (report.type === 'event')
        return (
            <i
                className="fas fa-calendar text-indigo-500 cursor-pointer"
                title="Événement"
                onClick={onClick}
            />
        );
    if (report.type === 'comment')
        return (
            <i
                className="fas fa-comment text-indigo-500 cursor-pointer"
                title="Commentaire"
                onClick={onClick}
            />
        );
    if (report.type === 'user')
        return (
            <i
                className="fas fa-user text-indigo-500 cursor-pointer"
                title="Utilisateur"
                onClick={onClick}
            />
        );
    return null;
};


const ReportSection = () => {
    const { user } = useAuth();
    const { reports, setReports, fetchReports, loading, error } = useReports();
    const [sortField, setSortField] = useState('date_reported');
    const [sortDirection, setSortDirection] = useState('desc');
    const [lightbox, setLightbox] = useState({ open: false, index: 0, images: [] });
    const [popupReport, setPopupReport] = useState(null);
    const [openReplies, setOpenReplies] = useState({});

    const sortedReports = useMemo(() => {
        if (!reports) return [];
        return [...reports].sort((a, b) => {
            const valA = a[sortField]?.toString().toLowerCase();
            const valB = b[sortField]?.toString().toLowerCase();
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [reports, sortField, sortDirection]);

    const handleUpdateStatus = async (report) => {
        const newStatus = report.status === 'Validé' ? 'Rejeté' : 'Validé';
        const { isConfirmed } = await showConfirmation({
            title: 'Confirmer la mise à jour',
            text: `Voulez-vous marquer ce signalement comme '${newStatus}' ?`,
            icon: 'warning',
            confirmText: `Oui, ${newStatus}`,
        });
    
        if (isConfirmed) {
            await updateReportStatus(report.id, newStatus, user.token);
            await fetchReports();
        }
    };

    const openLightbox = (images, index) => {
        setLightbox({ open: true, index, images });
    };

    const openPopup = (report) => setPopupReport(report);

    if (loading) {
            return (
                <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                    <table className="w-full whitespace-nowrap text-sm sm:text-xs">
                        <thead className="bg-indigo-100 text-indigo-700">
                            <tr>
                                {['Type', 'Signalé par', 'Contenu', 'Fichiers', 'Réponses', 'Statut', 'Date', 'Actions'].map((field, i) => (
                                    <th key={i} className={`text-left py-3 px-2 ${i === 0 ? 'rounded-l-lg' : ''}`}>
                                        {field}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <RowSkeletonReport key={i} />
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    if (error) return <p className="text-red-500">Erreur : {error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tous les signalements</h2>
            <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                <table className="w-full whitespace-nowrap text-sm">
                    <thead className="bg-indigo-100 text-indigo-700">
                        <tr>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Signalé par</th>
                            <th className="px-4 py-3">Contenu</th>
                            <th className="px-4 py-3">Fichiers</th>
                            <th className="px-4 py-3">Réponses</th>
                            <th className="px-4 py-3">Statut</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {sortedReports.map((report, index) => {
                                const images = report.files?.filter(isImage).map(f => `http://localhost:8080${f.file_path}`) || [];
                                const pdfs = report.files?.filter(isPdf) || [];
                                return (
                                    <>
                                        <motion.tr
                                            key={report.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-b border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">{getReportTypeIcon(report, () => openPopup(report))}</td>
                                            <td className="px-4 py-3">{report.reportingUser.name || 'Inconnu'}</td>
                                            <td className="px-4 py-3">{getReportContentPreview(report)}</td>
                                            <td className="px-4 py-3 space-x-2">
                                                {images.length > 0 && (
                                                    <i
                                                        className="fas fa-image text-indigo-400 cursor-pointer"
                                                        onClick={() => openLightbox(images, 0)}
                                                    />
                                                )}
                                                {pdfs.length > 0 && (
                                                    <a
                                                        href={`http://localhost:8080${pdfs[0].file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <i className="fas fa-file-pdf text-red-500 ml-2" />
                                                    </a>
                                                )}
                                                {images.length + pdfs.length === 0 && <span className="text-gray-400">0 fichier</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => setOpenReplies(prev => ({ ...prev, [report.id]: !prev[report.id] }))}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {report.messages?.length || 0} réponse{(report.messages?.length || 0) > 1 ? 's' : ''}
                                                </button>
                                            </td>
                                            <td className={`px-4 py-3 font-medium ${report.status === 'Validé' ? 'text-green-600' : 'text-yellow-600'}`}>{report.status}</td>
                                            <td className="px-4 py-3">{new Date(report.date_reported).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 flex items-center space-x-2">
                                                <button onClick={() => openPopup(report)} className="text-indigo-500 hover:text-indigo-700">
                                                    <EyeIcon size={18} />
                                                </button>
                                                <button onClick={() => handleUpdateStatus(report)} className="text-yellow-500 hover:text-yellow-600">
                                                    <i className="fas fa-sync-alt" />
                                                </button>
                                                <button
                                                    onClick={() => setOpenReplies(prev => ({ ...prev, [report.id]: true }))}
                                                    className="text-green-500 hover:text-green-700"
                                                >
                                                    <ReplyIcon size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                        {openReplies[report.id] && (
                                            <tr key={`replies-${report.id}`}>
                                                <td colSpan={8}><ReportReplies reportId={report.id} /></td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {lightbox.open && (
                <Lightbox
                    open={lightbox.open}
                    index={lightbox.index}
                    slides={lightbox.images.map((src) => ({ src }))}
                    close={() => setLightbox({ open: false, index: 0, images: [] })}
                />
            )}

            {popupReport && (
                <ReportDetailsPopup reportId={popupReport.id} onClose={() => setPopupReport(null)} openLightbox={openLightbox} />
            )}
        </div>
    );
};

export default ReportSection;