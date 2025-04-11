import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoreVertical, FiX } from 'react-icons/fi';
import { useAuth } from '../../config/authHeader';
import Swal from 'sweetalert2';
import ReportPopupPortal from './ReportPopupPortal';

const ReportDropdown = ({ contextType, eventId, commentId, organizerId }) => {
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [reportType, setReportType] = useState(null);
  const dropdownRef = useRef(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectReport = (type) => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Non autorisé',
        text: 'Vous devez être connecté pour signaler.',
        confirmButtonText: 'OK'
      });
      return;
    }
    setReportType(type);
    setShowPopup(true);
    setOpen(false);
  };

  return (
    <div
      className="relative z-50"
      ref={dropdownRef}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition"
      >
        <FiMoreVertical size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-2 top-10 bg-white rounded-lg shadow-xl p-2 w-52 z-50"
          >
            {contextType === 'event' && (
              <>
                <button
                  onClick={() => handleSelectReport('event')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                >
                  Signaler l'événement
                </button>
                <button
                  onClick={() => handleSelectReport('user')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                >
                  Signaler l'organisateur
                </button>
              </>
            )}
            {contextType === 'comment' && (
              <>
                <button
                  onClick={() => handleSelectReport('comment')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                >
                  Signaler le commentaire
                </button>
                <button
                  onClick={() => handleSelectReport('user')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                >
                  Signaler l'auteur
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPopup && (
          <ReportPopupPortal
            type={reportType}
            eventId={reportType === 'event' ? eventId : null}
            commentId={reportType === 'comment' ? commentId : null}
            reportedUserId={reportType === 'user' ? organizerId : null}
            onClose={() => setShowPopup(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportDropdown;
