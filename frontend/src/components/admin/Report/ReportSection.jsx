import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { XIcon, EyeIcon, ReplyIcon } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import ReportReplies from './ReportReplies';
import ReportDetailsPopup from './ReportDetailsPopup';

const isImage = (file) => /\.(jpg|jpeg|png|gif)$/i.test(file.file_path);
const isPdf = (file) => /\.pdf$/i.test(file.file_path);

const sortFunctions = {
    type: (a, b) => a.type.localeCompare(b.type),
    reportingUser: (a, b) => (a.reportingUser.name || '').localeCompare(b.reportingUser.name || ''),
    date_reported: (a, b) => new Date(a.date_reported) - new Date(b.date_reported),
    messageCount: (a, b) => (a.messageCount || 0) - (b.messageCount || 0),
    status: (a, b) => a.status.localeCompare(b.status),
};

const getStatusColor = (status) => {
    if (status === 'Validé') return 'text-green-600';
    if (status === 'En attente') return 'text-orange-500';
    return 'text-red-500';
};

const getReportTypeIcon = (type, onClick) => {
    const types = {
        event: 'fas fa-calendar',
        comment: 'fas fa-comment',
        user: 'fas fa-user',
    };
    return types[type] ? (
        <i className={`${types[type]} text-indigo-500 cursor-pointer`} title={type} onClick={onClick} />
    ) : null;
};

const ReportSection = ({ reports, loading, error, onUpdateStatus }) => {
    const [sortField, setSortField] = useState('date_reported');
    const [sortDirection, setSortDirection] = useState('desc');
    const [lightbox, setLightbox] = useState({ open: false, index: 0, images: [] });
    const [popupReport, setPopupReport] = useState(null);
    const [openPopupReplies, setOpenPopupReplies] = useState(null);
    const tableRef = useRef(null);

    const sortedReports = useMemo(() => {
        if (!reports) return [];
        const sorted = [...reports].sort(sortFunctions[sortField]);
        return sortDirection === 'asc' ? sorted : sorted.reverse();
    }, [reports, sortField, sortDirection]);

    const toggleSort = (field) => {
        if (!sortFunctions[field]) return;
        setSortField(field);
        setSortDirection(prev => (field === sortField && prev === 'asc') ? 'desc' : 'asc');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (tableRef.current && !tableRef.current.contains(e.target)) {
                setSortField(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // if (loading) return <p>Chargement...</p>;
    if (error) return <p className="text-red-500">Erreur : {error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tous les signalements</h2>

            <div className="rounded-lg shadow-md bg-white overflow-x-auto" ref={tableRef}>
                <table className="w-full text-sm whitespace-nowrap">
                    <thead className="bg-indigo-100 text-indigo-700">
                        <tr>
                            {[
                                { label: 'Type', field: 'type' },
                                { label: 'Signalé par', field: 'reportingUser' },
                                { label: 'Contenu' },
                                { label: 'Fichiers' },
                                { label: 'Réponses', field: 'messageCount' },
                                { label: 'Statut', field: 'status' },
                                { label: 'Date', field: 'date_reported' },
                                { label: 'Actions' },
                            ].map(({ label, field }) => (
                                <th
                                    key={label}
                                    className={`relative px-4 py-3 ${field ? 'cursor-pointer hover:underline select-none' : ''}`}
                                    onClick={field ? () => toggleSort(field) : undefined}
                                >
                                    <span className="flex items-center gap-1">
                                        {label}
                                        {field && sortField === field && (
                                            <span className="absolute right-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {sortedReports.map((report) => {
                                const images = report.files?.filter(isImage).map(f => `http://localhost:8080${f.file_path}`) || [];
                                const pdfs = report.files?.filter(isPdf) || [];

                                return (
                                    <React.Fragment key={report.id}>
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-b border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">{getReportTypeIcon(report.type, () => setPopupReport(report))}</td>
                                            <td className="px-4 py-3">{report.reportingUser.name || 'Inconnu'}</td>
                                            <td className="px-4 py-3">{report.message.slice(0, 30)}...</td>
                                            <td className="px-4 py-3">
                                                {images.length > 0 && (
                                                    <i className="fas fa-image text-indigo-400 cursor-pointer" onClick={() => setLightbox({ open: true, index: 0, images })} />
                                                )}
                                                {pdfs.length > 0 && (
                                                    <a href={`http://localhost:8080${pdfs[0].file_path}`} target="_blank" rel="noopener noreferrer">
                                                        <i className="fas fa-file-pdf text-red-500 ml-2" />
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => setOpenPopupReplies(report)} className="text-blue-600 hover:underline">
                                                    {report.messageCount || 0} réponse{report.messageCount > 1 ? 's' : ''}
                                                </button>
                                            </td>
                                            <td className={`px-4 py-3 font-semibold ${getStatusColor(report.status)}`}>
                                                {report.status}
                                            </td>
                                            <td className="px-4 py-3">{new Date(report.date_reported).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 flex space-x-2">
                                                <button onClick={() => setPopupReport(report)} className="text-indigo-500 hover:text-indigo-700">
                                                    <EyeIcon size={18} />
                                                </button>
                                                <button onClick={() => onUpdateStatus(report)} className="text-yellow-500 hover:text-yellow-600">
                                                    <i className="fas fa-sync-alt" />
                                                </button>
                                                <button onClick={() => setOpenPopupReplies(report)} className="text-green-500 hover:text-green-700">
                                                    <ReplyIcon size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    </React.Fragment>
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
                    slides={lightbox.images.map(src => ({ src }))}
                    close={() => setLightbox({ open: false, index: 0, images: [] })}
                />
            )}

            {popupReport && (
                <ReportDetailsPopup
                    reportId={popupReport.id}
                    onClose={() => setPopupReport(null)}
                />
            )}

            {openPopupReplies && (
                <Dialog open={true} onClose={() => setOpenPopupReplies(null)} className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setOpenPopupReplies(null)} />
                    <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
                        <button onClick={() => setOpenPopupReplies(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                            <XIcon size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Réponses</h2>
                        <ReportReplies reportId={openPopupReplies.id} limit={null} />
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default ReportSection;   