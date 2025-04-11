import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import useCreateReport from '../../hooks/Report/useCreateReport';
import Swal from 'sweetalert2';

const ReportPopupPortal = ({ type, eventId, commentId, reportedUserId, onClose }) => {
  const popupRef = useRef(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const { create, loading, error } = useCreateReport();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 6);
    setFiles(prev => [...prev, ...selected].slice(0, 6));
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) return;
    const formData = new FormData();
    formData.append("message", `[${title}] ${message}`);
    files.forEach((file) => formData.append("files", file));
    if (type === 'event') formData.append("id_event", eventId);
    if (type === 'user') formData.append("id_reported_user", reportedUserId);
    if (type === 'comment') formData.append("id_comment", commentId);

    try {
      await create(formData, true);
      Swal.fire("Merci !", "Votre signalement a été transmis.", "success");
      onClose();
    } catch (err) {
      console.error("Erreur report :", err);
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        ref={popupRef}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {type === 'event' ? "Signaler l'événement" :
           type === 'user' ? "Signaler l'utilisateur" :
           "Signaler le commentaire"}
        </h2>

        <input
          type="text"
          placeholder="Titre du problème"
          className="w-full mb-3 border rounded-lg p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Décrivez le problème..."
          className="w-full border rounded-lg p-3 min-h-[100px] mb-4"
          required
        />

        <div className="mb-4">
          <label className="block font-medium mb-1">Fichiers complémentaires (image ou PDF)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={handleFileChange}
          />
          <p className="text-xs text-gray-500 mt-1">Jusqu'à 3 images et/ou 3 PDF. (6 fichiers max)</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((file, idx) => (
              <div key={idx} className="relative bg-gray-100 px-2 py-1 rounded shadow text-sm">
                <span>{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(idx)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !title.trim() || !message.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
        >
          {loading ? 'Envoi...' : 'Envoyer le signalement'}
        </button>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ReportPopupPortal;