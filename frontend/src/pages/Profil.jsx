import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/Profil/ProfileCard';
import EventsSection from '../components/Profil/EventsSection';
import useProfile from '../hooks/User/useProfile';
import useFavoris from '../hooks/Favoris/useFavoris';
import { getCreatedEventsStats } from '../services/eventService';
import { getEventHistory, getParticipationCount } from '../services/userService';
import useUpdateProfile from '../hooks/User/useUpdateProfile';
import { useUserComments } from '../hooks/Comments/useUserComments';
import SkeletonProfileCard from '../components/SkeletonLoading/SkeletonProfileCard';
import { motion } from 'framer-motion';
import { getUserAverageRating } from '../services/ratingService';
import useRatingsByOrganizer from '../hooks/Rating/useRatingsByOrganizer';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../config/authHeader';
import Footer from '../components/Partials/Footer';
import Header from '../components/Partials/Header';
import { deleteAccount } from '../services/authService';
import Swal from 'sweetalert2';
import NotFound from './NotFound';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

const Profil = () => {
    const { userId } = useParams();
    const { profile, accessLevel, isOwner, isAdmin, loading, error, setProfile } = useProfile(userId);
    const [participatedEvents, setParticipatedEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    const [stats, setStats] = useState({ created: 0, participated: 0 });
    const { favoris, loading: favorisLoading } = useFavoris();
    const { update, loading: updateLoading, error: updateError } = useUpdateProfile();
    const { user: currentUser, logout } = useAuth();
    const { ratings, loading: ratingsLoading, error: ratingsError } = useRatingsByOrganizer(userId, currentUser?.token);
    const [showRatingsPopup, setShowRatingsPopup] = useState(false);
    const { commentsData, loading: commentsLoading } = useUserComments(userId);
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    console.log("userId param:", userId);
    console.log("currentUser:", currentUser);

    const SectionWrapper = ({ title, children }) => (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
        >
            <h2 className="bg-clip-text bg-gradient-to-r from-[#580FCA] to-[#F929BB] mb-4 font-bold text-transparent text-3xl">
                {title}
            </h2>
            <div className="mb-4 border-[#F929BB] border-t-4 rounded-full w-16"></div>
            {children}
        </motion.div>
    );
    

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const [createdStats, participationCount, rating] = await Promise.all([
                    getCreatedEventsStats(userId),
                    getParticipationCount(userId),
                    getUserAverageRating(userId)
                ]);

                setCreatedEvents(createdStats.events.slice(0, 5));

                if (isOwner || isAdmin) {
                    const history = await getEventHistory(currentUser?.token || null, userId);
                    setParticipatedEvents(history.slice(0, 5));
                }

                setStats({
                    created: createdStats.count,
                    participated: participationCount,
                    rating: rating || 0
                });
            } catch (err) {
                console.error("Erreur lors de la récupération des données du profil :", err);
            }
        };

        fetchData();
    }, [userId, currentUser, isOwner, isAdmin]);

    console.log("STATS →", stats);

    const handleUpdateProfileImage = async (file, type = 'profileImage') => {
        try {
            const formData = new FormData();
            formData.append(type, file);

            const userIdToUpdate = isOwner ? currentUser.id : userId;

            const endpoint =
                type === 'bannerImage'
                    ? `/profile/banner/${userIdToUpdate}`
                    : `/profile/${userIdToUpdate}`;

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${currentUser.token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Erreur lors de la mise à jour');
            }

            window.location.reload();
        } catch (err) {
            console.error(`Erreur mise à jour ${type} :`, err.message);
        }
    };

    const handleUpdateProfileField = async (field, value) => {
        try {
            const cleanedValue = typeof value === 'string' ? value.trim() : value;

            if (typeof cleanedValue === 'string' && cleanedValue === '') return;

            const userIdToUpdate = isOwner ? currentUser.id : userId;

            await update({ [field]: cleanedValue }, userIdToUpdate);

            setProfile((prev) => ({
                ...prev,
                [field]: cleanedValue
            }));
        } catch (err) {
            console.error(`Erreur mise à jour ${field} :`, err.message);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const result = await Swal.fire({
                title: 'Êtes-vous sûr ?',
                text: "Cette action est irréversible !",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Oui, supprimer mon compte',
                cancelButtonText: 'Annuler'
            });

            if (result.isConfirmed) {
                setIsDeleting(true);
                await deleteAccount();
                await logout();
                navigate('/');
                Swal.fire(
                    'Compte supprimé !',
                    'Votre compte a été supprimé avec succès.',
                    'success'
                );
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du compte:', error);
            Swal.fire(
                'Erreur !',
                'Une erreur est survenue lors de la suppression de votre compte.',
                'error'
            );
        } finally {
            setIsDeleting(false);
        }
    };

    if (error) return <NotFound />;
    if (!profile) return <SkeletonProfileCard />;

    const shouldShowGlobalNoActivityMessage = isAdmin && !isOwner && createdEvents.length === 0 && participatedEvents.length === 0;

    return (
        <>
            <Header />

            <section className="space-y-12 mx-auto pt-[100px] sm:pt-[160px] lg:pt-[190px] container">
                <ProfileCard
                    user={{
                        ...profile,
                        rating: stats.rating ?? 0,
                        eventsParticipated: stats.participated,
                        eventsCreated: stats.created,
                        commentsPosted: commentsData?.totalComments ?? 0
                    }}
                    editable={isOwner}
                    onUpdateProfileImage={handleUpdateProfileImage}
                    onUpdateProfileField={handleUpdateProfileField}
                    ratings={ratings}
                    ratingsLoading={ratingsLoading}
                    onClickRating={() => setShowRatingsPopup(true)}
                    extraSections={
                        shouldShowGlobalNoActivityMessage ? (
                            <SectionWrapper title="Activité de l'utilisateur">
                                <p className="text-[#580FCA] text-lg italic">
                                    Cet utilisateur n'a pour l'instant participé à aucun événement ni créé d'événement.
                                </p>
                            </SectionWrapper>
                        ) : (
                            <>
                                {(isOwner || isAdmin) && (
                                    <SectionWrapper title="Événements Participés">
                                        <EventsSection
                                            events={participatedEvents}
                                            emptyMessage={
                                                participatedEvents.length === 0
                                                    ? isOwner
                                                        ? "Vous n'avez encore participé à aucun événement. Rejoignez-en un dès maintenant !"
                                                        : "Cet utilisateur n'a pour l'instant participé à aucun événement."
                                                    : null
                                            }
                                            {...(isOwner && participatedEvents.length === 0 && {
                                                buttonLink: "/events",
                                                emptyButtonText: "Voir tous les événements",
                                                emptyButtonClass: "bg-gradient-to-r from-[#580FCA] to-[#F929BB] text-white rounded-md px-4 py-2 hover:opacity-90 transition"
                                            })}
                                            {...(participatedEvents.length > 0 && {
                                                linkText: "Voir tout l'historique",
                                                buttonLink: "/participation",
                                            })}
                                        />
                                    </SectionWrapper>
                                )}

                                {(stats.created > 0 || isOwner || isAdmin) && (
                                    <SectionWrapper title="Événements Créés">
                                        <EventsSection
                                            events={createdEvents}
                                            emptyMessage={
                                                stats.created === 0
                                                    ? isOwner
                                                        ? "Vous n'avez pas encore créé d'événement."
                                                        : "Cet utilisateur n'a pour l'instant créé aucun événement."
                                                    : null
                                            }
                                            buttonLink={isOwner ? "/event/created" : undefined}
                                            emptyButtonText={isOwner ? "Créer un événement" : undefined}
                                            emptyButtonClass="bg-gradient-to-r from-[#580FCA] to-[#F929BB] text-white rounded-md px-4 py-2 hover:opacity-90 transition"
                                            {...(createdEvents.length > 0 && {
                                                linkText: "Voir tout l'historique"
                                            })}
                                        />
                                    </SectionWrapper>
                                )}

                                {isOwner && (
                                    <SectionWrapper title="Favoris">
                                        <EventsSection
                                            events={favoris.slice(0, 5).map(favori => ({
                                                id: favori.id,
                                                title: favori.title,
                                                start_time: favori.start_time,
                                                status: "Favori",
                                                image: favori.image || null
                                            }))}
                                            emptyMessage="Vous n'avez pas encore de favoris."
                                            buttonLink="/favoris"
                                            emptyButtonText="Voir tous les événements"
                                            emptyButtonClass="bg-gradient-to-r from-[#580FCA] to-[#F929BB] text-white rounded-md px-4 py-2 hover:opacity-90 transition"
                                            {...(favoris.length > 0 && {
                                                linkText: "Voir tous les favoris"
                                            })}
                                        />
                                    </SectionWrapper>
                                )}
                            </>
                        )
                    }
                />
            </section>

            {showRatingsPopup && (
                <div
                    className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
                    onClick={() => setShowRatingsPopup(false)}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-gray-800 text-xl">Notes reçues</h2>
                            <button
                                onClick={() => setShowRatingsPopup(false)}
                                className="text-gray-600 hover:text-gray-800 text-xl"
                            >
                                &times;
                            </button>
                        </div>

                        {ratingsLoading && <p>Chargement...</p>}
                        {ratingsError && <p className="text-red-500">Erreur : {ratingsError}</p>}
                        {!ratingsLoading && ratings.length === 0 && <p>Aucune note reçue.</p>}

                        {ratings.map((rating, index) => (
                            <div key={rating.id} className="mb-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`http://localhost:8080${rating.user.profileImage}`}
                                        alt="PP"
                                        className="rounded-full w-12 h-12 object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold">
                                            {rating.user.name} {rating.user.lastname.charAt(0).toUpperCase()}.
                                        </p>
                                        <div className="group relative flex items-center mt-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <svg
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'
                                                        }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.376 2.455c-.784.57-1.838-.197-1.539-1.118l1.285-3.97a1 1 0 00-.364-1.118L2.63 9.397c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.97z" />
                                                </svg>
                                            ))}
                                            <div className="-top-6 left-1/2 absolute bg-white opacity-0 group-hover:opacity-100 shadow px-2 py-1 rounded min-w-[50px] text-gray-600 text-xs transition -translate-x-1/2">
                                                {rating.rating ? parseFloat(rating.rating).toFixed(1) : '0.0'} / 5
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {rating.message && (
                                    <p className="mt-2 ml-16 text-gray-700">Message : {rating.message}</p>
                                )}

                                <p className="mt-1 ml-16 text-gray-500 text-sm">Événement : {rating.event.title}</p>

                                {index !== ratings.length - 1 && (
                                    <hr className="my-4 border-gray-300" />
                                )}
                            </div>
                        ))}
                    </motion.div>
                </div>
            )}

            {isOwner && (
                <div className="mt-8 p-6 border-t">
                    <h3 className="mb-4 font-semibold text-gray-700 text-lg">Paramètres du compte</h3>
                    <div className="space-y-4">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                            {isDeleting ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Suppression en cours...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Supprimer mon compte</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default Profil;