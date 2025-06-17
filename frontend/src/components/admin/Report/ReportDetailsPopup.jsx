import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { XIcon, ArrowRightIcon } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import useReportDetails from '../../../hooks/Report/useReportDetails';
import ReportReplies from './ReportReplies';
import RowSkeletonReport from '../../SkeletonLoading/RowSkeletonReport';

const isImage = (file) => /\.(jpg|jpeg|png|gif)$/i.test(file.file_path);
const isPdf = (file) => /\.pdf$/i.test(file.file_path);

const ReportDetailsPopup = ({ reportId, onClose }) => {
    const { report, loading, error } = useReportDetails(reportId);
    const [lightbox, setLightbox] = useState({ open: false, index: 0, images: [] });

    const imageFiles = report?.files?.filter(isImage).map(f => `http://localhost:8080${f.file_path}`) || [];

    const Backdrop = () => (
        <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-0 cursor-pointer" />
    );

    const stopPropagation = (e) => e.stopPropagation();

    if (loading) {
        return (
            <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
                <Backdrop />
                <div className="z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full" onClick={stopPropagation}>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <RowSkeletonReport key={idx} />
                        ))}
                    </div>
                </div>
            </Dialog>
        );
    }

    if (error || !report) {
        return (
            <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
                <Backdrop />
                <div className="z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full" onClick={stopPropagation}>
                    <p className="text-red-600 text-lg font-semibold">Erreur de chargement: {error}</p>
                </div>
            </Dialog>
        );
    }

    const goToProfile = (userId) => {
        window.location.href = `/profile/${userId}`;
    };

    return (
        <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
            <Backdrop />
            <motion.div
                onClick={stopPropagation}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative z-10 bg-white rounded-2xl shadow-xl mx-auto my-10 max-w-5xl w-full p-8 space-y-8"
            >
                <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700">
                    <XIcon size={24} />
                </button>

                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
                    <h2 className="text-3xl font-extrabold text-indigo-600 font-serif">Détails du Signalement</h2>
                    <p className="text-sm text-gray-400 mt-1">{new Date(report.date_reported).toLocaleString()}</p>
                </motion.div>

                <div className="space-y-6">
                    <h4 className="text-lg font-bold text-gray-700 mb-4">Information du report</h4>
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => goToProfile(report.reportingUser?.id)}>
                        <img
                            src={report.reportingUser?.profileImage ? `http://localhost:8080${report.reportingUser.profileImage}` : '/default-avatar.png'}
                            alt="Reporter"
                            className="w-14 h-14 rounded-full object-cover shadow"
                        />
                        <div>
                            <h4 className="text-xl font-semibold">{report.reportingUser?.name || 'Utilisateur inconnu'}</h4>
                            <p className="text-md text-gray-500">Statut: <span className="font-medium text-indigo-600">{report.status}</span></p>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-indigo-50 border border-indigo-200">
                        <h5 className="text-lg font-bold text-indigo-800 mb-2">Message :</h5>
                        <p className="text-gray-700 text-base leading-relaxed">{report.message}</p>
                    </div>

                    {report.reportedUser && (
                        <div className="text-md text-gray-600">
                            Utilisateur signalé: <span className="text-gray-800 font-semibold">{report.reportedUser.name}</span>
                        </div>
                    )}
                </div>

                {report.files?.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h4 className="text-lg font-bold text-gray-700 mb-4">Pièces jointes</h4>
                        <div className="flex flex-wrap gap-4">
                            {report.files.map((file, idx) => {
                                const fileUrl = `http://localhost:8080${file.file_path}`;
                                if (isImage(file)) {
                                    return (
                                        <div key={`${file.file_path}-${idx}`}
                                        className="relative w-32 h-40 group">
                                            <img
                                                src={fileUrl}
                                                className="object-cover w-full h-full rounded-lg shadow-md cursor-pointer group-hover:opacity-80 transition"
                                                onClick={() => setLightbox({ open: true, index: idx, images: imageFiles })}
                                                alt="piece jointe"
                                            />
                                        </div>
                                    );
                                } else if (isPdf(file)) {
                                    return (
                                        <div key={`${file.file_path}-${idx}`}
                                        className="relative w-48 h-40 border rounded-lg overflow-hidden shadow hover:shadow-lg">
                                            <iframe
                                                src={fileUrl}
                                                className="w-full h-full"
                                                title="Aperçu PDF"
                                            />
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </motion.div>
                )}

                {report.event && (
                    <>
                        <h4 className="text-lg font-bold text-gray-700">Event Report</h4>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-2xl border bg-gray-50 hover:shadow-lg transition">
                            <div className="flex items-start gap-4">
                                {report.event?.EventImages?.[0]?.image_url && (
                                    <img src={`http://localhost:8080${report.event.EventImages[0].image_url}`} alt="event" className="w-24 h-24 object-cover rounded-lg" />
                                )}
                                <div className="flex flex-col">
                                    <h5 className="text-lg font-bold text-indigo-600 cursor-pointer" onClick={() => window.location.href = `/event/${report.event.id}`}>
                                        {report.event.title}
                                    </h5>
                                    <p className="text-sm text-gray-600">{report.event.description}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                        <span>{new Date(report.event.date).toLocaleDateString()}</span>
                                        <ArrowRightIcon size={16} />
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => goToProfile(report.event.organizer?.id)}>
                                            <img
                                                src={report.event.organizer?.profileImage ? `http://localhost:8080${report.event.organizer.profileImage}` : '/default-avatar.png'}
                                                className="w-6 h-6 rounded-full object-cover"
                                                alt="Organisateur"
                                            />
                                            <span>{report.event.organizer?.name || 'Organisateur inconnu'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                <div className="mt-8">
                    <h4 className="text-lg font-bold text-gray-700 mb-4">Réponses au Signalement</h4>
                    <ReportReplies reportId={reportId} />
                </div>

                {lightbox.open && (
                    <Lightbox
                        open={lightbox.open}
                        index={lightbox.index}
                        close={() => setLightbox({ open: false, index: 0, images: [] })}
                        slides={lightbox.images.map((src) => ({ src }))}
                    />
                )}
            </motion.div>
        </Dialog>
    );
};

export default ReportDetailsPopup;