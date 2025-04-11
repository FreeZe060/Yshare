import React from 'react';
import StarRating from '../StarRating';
import { FiUser, FiEdit2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../config/authHeader'; // Assurez-vous que le chemin est correct

const ProfileCard = ({ user, onUpdateProfileImage, onUpdateProfileField }) => {
	const auth = useAuth();
    const currentUser = auth?.user;
    const isAdmin = auth?.isAdmin;

	const editable = currentUser?.id === user.id || isAdmin;

	const handleImageChange = (e) => {
		if (onUpdateProfileImage) {
			const file = e.target.files[0];
			onUpdateProfileImage(file);
		}
	};

	const handleFieldChange = (field, value) => {
		if (onUpdateProfileField) {
			onUpdateProfileField(field, value);
		}
	};

	return (
        <motion.div
        className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Partie gauche : image + note */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative">
            {user.profileImage ? (
              <img
                src={`http://localhost:8080${user.profileImage}`}
                alt="Profile"
                className="w-40 h-40 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover cursor-pointer"
                onClick={() =>
                  editable && document.getElementById('profileImageInput').click()
                }
              />
            ) : (
              <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                onClick={() =>
                  editable && document.getElementById('profileImageInput').click()
                }
              >
                <FiUser size={48} className="text-white" />
              </div>
            )}
            {editable && (
              <div
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer"
                onClick={() => document.getElementById('profileImageInput').click()}
              >
                <FiEdit2 size={20} />
              </div>
            )}
            <input
              type="file"
              id="profileImageInput"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="mt-4 text-center">
            <StarRating rating={user.rating || 0} />
            <div className="text-2xl font-bold mt-2">
              {user.rating !== undefined && user.rating !== null
                ? user.rating.toFixed(1)
                : 'NA'}
            </div>
          </div>
        </div>
  
        {/* Partie droite : infos */}
        <div className="flex-1 mt-6 md:mt-0 md:ml-12 w-full">
          <div className="space-y-6">
            {['name', 'lastname'].map((field) => (
                <div key={field} className="flex items-center border-b border-gray-300 pb-2">
                    <label className="w-40 font-bold capitalize text-lg">
                        {field} :
                    </label>
                    {editable ? (
                        <input
                            type="text"
                            defaultValue={user[field]}
                            className="flex-1 text-base sm:text-lg md:text-3xl outline-none"
                            onBlur={(e) => handleFieldChange(field, e.target.value)}
                        />
                    ) : (
                        <span className="text-base sm:text-lg md:text-3xl">{user[field]}</span>
                    )}
                </div>
            ))}

            {/* Email visible seulement si editable */}
            {editable && (
              <div className="flex items-center border-b border-gray-300 pb-2">
                <label className="w-40 font-bold capitalize text-lg">email :</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="flex-1 text-base sm:text-lg md:text-2xl outline-none"
                  onBlur={(e) => handleFieldChange('email', e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center border-b border-gray-300 pb-2">
              <label className="w-40 font-bold text-lg">Événements Participés :</label>
              <span className="text-base sm:text-lg md:text-2xl">{user.eventsParticipated || 0}</span>
            </div>

            <div className="flex items-center">
              <label className="w-40 font-bold text-lg">Événements <br /> Créés :</label>
              <span className="text-base sm:text-lg md:text-2xl">{user.eventsCreated || 0}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
};

export default ProfileCard;
