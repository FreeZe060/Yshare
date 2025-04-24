import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { XIcon, DownloadIcon } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import useReportDetails from '../../hooks/Report/useReportDetails';
import ReportReplies from './ReportReplies';
import RowSkeletonReport from '../SkeletonLoading/RowSkeletonReport';

const isImage = (file) => /\.(jpg|jpeg|png|gif)$/i.test(file.file_path);
const isPdf = (file) => /\.pdf$/i.test(file.file_path);

const ReportDetailsPopup = ({ reportId, onClose }) => {
  const { report, loading, error } = useReportDetails(reportId);
  const [lightbox, setLightbox] = useState({ open: false, index: 0, images: [] });

  const Backdrop = () => (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm cursor-pointer z-0"
    />
  );

  const stopPropagation = (e) => e.stopPropagation();

  if (loading) {
    return (
      <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
        <Backdrop />
        <div className="z-10 bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative" onClick={stopPropagation}>
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
        <div className="z-10 bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative" onClick={stopPropagation}>
          <p className="text-red-500">Erreur de chargement : {error}</p>
        </div>
      </Dialog>
    );
  }

  const imageFiles = report.files?.filter(isImage).map(f => `http://localhost:8080${f.file_path}`) || [];

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Backdrop />
      <motion.div
        onClick={stopPropagation}
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="z-10 bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 relative font-sans"
      >
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <XIcon size={24} />
        </button>

        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-indigo-700">Détails du signalement</h3>
          <p className="text-sm text-gray-500">{new Date(report.date_reported).toLocaleString()}</p>
        </div>

        {report.event && (
          <motion.div layout className="mb-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Événement signalé</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {report.event?.EventImages?.[0]?.image_url && (
                <img
                  src={report.event.EventImages[0].image_url ? `http://localhost:8080${report.event.EventImages[0].image_url}` : '/default-avatar.png'}
                  alt="Événement"
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
              )}
              <div className="md:col-span-2 space-y-1">
                <h5 className="text-lg font-bold text-indigo-600">{report.event.title}</h5>
                <p className="text-sm text-gray-600 truncate">{report.event.description}</p>
                <p className="text-xs text-gray-400">Date : {new Date(report.event.date).toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={report.event.organizer?.profileImage ? `http://localhost:8080${report.event.organizer.profileImage}` : '/default-avatar.png'}
                    className="w-6 h-6 rounded-full"
                    alt="Organisateur"
                  />
                  <span className="text-sm text-gray-700">{report.event.organizer?.name || 'Inconnu'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div layout className="mb-4">
          <h4 className="text-lg font-medium text-gray-800">Informations générales</h4>
          <ul className="text-sm text-gray-600 space-y-1 mt-2">
            <li className="flex items-center gap-2">
              <img
                src={report.reportingUser?.profileImage ? `http://localhost:8080${report.reportingUser.profileImage}` : '/default-avatar.png'}
                className="w-6 h-6 rounded-full"
                alt="Reporter"
              />
              <strong>Signalé par :</strong> {report.reportingUser?.name || 'Inconnu'}
            </li>
            <li><strong>Statut :</strong> {report.status}</li>
            <li><strong>Message :</strong> {report.message}</li>
            {report.reportedUser && <li><strong>Utilisateur signalé :</strong> {report.reportedUser.name}</li>}
          </ul>
        </motion.div>

        {report.files?.length > 0 && (
          <motion.div layout className="mb-4">
            <h4 className="text-lg font-medium text-gray-800 mb-2">Pièces jointes</h4>
            <div className="flex flex-wrap gap-4">
              {report.files.map((file, index) => {
                const fileUrl = `http://localhost:8080${file.file_path}`;
                if (isImage(file)) {
                  return (
                    <div key={file.file_path} className="relative group w-32 h-32">
                      <img
                        src={fileUrl}
                        alt="Aperçu"
                        className="w-full h-full object-cover rounded-lg shadow cursor-pointer group-hover:brightness-75 transition duration-300"
                        onClick={() => setLightbox({ open: true, index, images: imageFiles })}
                      />
                      <a
                        href={fileUrl}
                        download
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
                      >
                        <i className="fas fa-download text-white text-xl drop-shadow" />
                      </a>
                    </div>
                  );
                } else if (isPdf(file)) {
                  return (
                    <div key={file.file_path} className="relative group w-72 h-32">
                      <iframe
                        src={fileUrl}
                        className="w-full h-full rounded-lg shadow group-hover:brightness-90 transition"
                        title="Aperçu PDF"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="text-white text-xl"
                        >
                          <i className="fas fa-file-download drop-shadow" />
                        </a>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </motion.div>
        )}

        <motion.div layout className="mt-4">
          <h4 className="text-lg font-medium text-gray-800 mb-2">Réponses</h4>
          <div className="bg-gray-100 rounded-lg p-4 shadow-inner max-h-60 overflow-y-auto">
            <ReportReplies reportId={reportId} />
          </div>
        </motion.div>
      </motion.div>

      {lightbox.open && (
        <Lightbox
          open={lightbox.open}
          index={lightbox.index}
          close={() => setLightbox({ open: false, index: 0, images: [] })}
          slides={lightbox.images.map((src) => ({ src }))}
          render={{
            download: ({ slide }) => (
              <a
                href={slide.src}
                download
                className="absolute top-4 right-16 bg-white rounded-full p-2 shadow hover:bg-gray-100 z-50"
              >
                <DownloadIcon className="w-5 h-5 text-gray-600" />
              </a>
            ),
            close: ({ close }) => (
              <button
                onClick={close}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-gray-100 z-50"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            )
          }}
        />
      )}
    </Dialog>
  );
};

export default ReportDetailsPopup;