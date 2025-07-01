import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoreVertical } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useDeleteComment from '../../hooks/Comments/useDeleteComment';
import useUpdateComment from '../../hooks/Comments/useUpdateComment';

const EditDeleteDropdown = ({ comment, onEditSuccess, onDeleteSuccess }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { remove } = useDeleteComment();
    const { update } = useUpdateComment();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = async () => {
        const confirm = await Swal.fire({
            title: 'Supprimer ce commentaire ?',
            text: 'Cette action est irréversible.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
        });
        if (confirm.isConfirmed) {
            try {
                await remove(comment.id);
                Swal.fire('Supprimé', 'Le commentaire a été supprimé.', 'success');
                if (onDeleteSuccess) onDeleteSuccess(); 
            } catch (err) {
                Swal.fire('Erreur', err.message, 'error');
            }
        }
    }

    const handleEdit = async () => {
        const { value: newMessage } = await Swal.fire({
            title: 'Modifier le commentaire',
            input: 'textarea',
            inputLabel: 'Votre commentaire',
            inputValue: comment.message,
            showCancelButton: true
        });
        if (newMessage && newMessage.trim() !== '') {
            try {
                await update(comment.id, { message: newMessage });
                Swal.fire('Modifié', 'Le commentaire a été mis à jour.', 'success');
                if (onEditSuccess) onEditSuccess(newMessage);
            } catch (err) {
                Swal.fire('Erreur', err.message, 'error');
            }
        }
    };

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="p-2 rounded-full hover:bg-gray-200 transition"
            >
                <FiMoreVertical size={20} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-10 bg-white rounded-lg shadow-xl p-2 w-52 z-50"
                    >
                        <button
                            onClick={handleEdit}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={handleDelete}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-red-600"
                        >
                            Supprimer
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditDeleteDropdown;