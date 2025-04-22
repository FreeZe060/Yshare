// Ce fichier est la version mise à jour de ReportSection avec tous les comportements demandés

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
              <p className="text-sm text-gray-600">{new Date(msg.date).toLocaleString()}</p>
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
  if (report.event) return report.event.title;
  if (report.reportedUser) return report.reportedUser.name;
  if (report.comment) return report.comment.content.slice(0, 30) + '...';
  return report.message?.slice(0, 30) + '...';
};

const getReportTypeIcon = (report, onClick) => {
  if (report.id_event)
    return (
      <i
        className="fas fa-calendar text-indigo-500 cursor-pointer"
        title="Événement"
        onClick={onClick}
      />
    );
  if (report.id_comment)
    return (
      <i
        className="fas fa-comment text-indigo-500 cursor-pointer"
        title="Commentaire"
        onClick={onClick}
      />
    );
  if (report.id_reported_user)
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
  const { reports, loading, error } = useReports();
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
      window.location.reload();
    }
  };

  const openLightbox = (images, index) => {
    setLightbox({ open: true, index, images });
  };

  const openPopup = (report) => setPopupReport(report);

  if (loading) return <p>Chargement des signalements...</p>;
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
                      <td className="px-4 py-3">{report.reportingUser?.name || 'Inconnu'}</td>
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
        <Dialog open={!!popupReport} onClose={() => setPopupReport(null)} className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-40" />
          <Dialog.Panel className="z-10 bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setPopupReport(null)}
            >
              <XIcon size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Détails du signalement</h3>
            <p><strong>Signalé par :</strong> {popupReport.reportingUser?.name || 'Inconnu'}</p>
            <p><strong>Date :</strong> {new Date(popupReport.date_reported).toLocaleString()}</p>
            <p><strong>Statut :</strong> {popupReport.status}</p>
            <p><strong>Message :</strong> {popupReport.message}</p>
            {popupReport.event && <p><strong>Événement :</strong> {popupReport.event.title}</p>}
            {popupReport.reportedUser && <p><strong>Utilisateur signalé :</strong> {popupReport.reportedUser.name}</p>}

            <div className="mt-4">
              <p className="font-semibold mb-1">Pièces jointes :</p>
              {popupReport.files?.length ? (
                <div className="flex flex-wrap gap-4">
                  {popupReport.files.map((file, index) => (
                    <div key={file.file_path} className="flex flex-col items-center">
                      {isImage(file) ? (
                        <img
                          src={`http://localhost:8080${file.file_path}`}
                          alt="image jointe"
                          className="w-20 h-20 object-cover rounded cursor-pointer"
                          onClick={() => openLightbox(popupReport.files.filter(isImage).map(f => `http://localhost:8080${f.file_path}`), index)}
                        />
                      ) : isPdf(file) ? (
                        <a
                          href={`http://localhost:8080${file.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500"
                        >
                          <i className="fas fa-file-pdf text-4xl" />
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucun fichier fourni.</p>
              )}
            </div>
            <div className="mt-6">
              <h4 className="font-semibold">Réponses :</h4>
              <ReportReplies reportId={popupReport.id} />
            </div>
          </Dialog.Panel>
        </Dialog>
      )}
    </div>
  );
};

export default ReportSection;
