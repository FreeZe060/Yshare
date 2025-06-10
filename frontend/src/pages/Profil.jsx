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
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../config/authHeader';
import Footer from '../components/Partials/Footer';
import Header from '../components/Partials/Header';
import { deleteAccount } from '../services/authService';
import Swal from 'sweetalert2';

const Profil = () => {
    const { userId } = useParams();
    const { profile, accessLevel, isOwner, isAdmin, loading, error, setProfile } = useProfile(userId);
    const [participatedEvents, setParticipatedEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    const [stats, setStats] = useState({ created: 0, participated: 0 });
    const { favoris, loading: favorisLoading } = useFavoris();
    const { update, loading: updateLoading, error: updateError } = useUpdateProfile();
    const { user: currentUser, logout } = useAuth();
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
            className="mb-10"
        >
            <h2 className="text-3xl font-bold mb-4 text-blue-700">{title}</h2>
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
                    ? `/api/profile/banner/${userIdToUpdate}`
                    : `/api/profile/${userIdToUpdate}`;

            const response = await fetch(`http://localhost:8080${endpoint}`, {
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

    if (error) return <div className="text-center text-red-500">Erreur : {error}</div>;
    if (!profile) return <SkeletonProfileCard />;

    const shouldShowGlobalNoActivityMessage = isAdmin && !isOwner && createdEvents.length === 0 && participatedEvents.length === 0;

    return (
        <>
            <Header />

            <section className="container mx-auto space-y-12 pt-[100px] lg:pt-[190px] sm:pt-[160px]">
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
                    extraSections={
                        shouldShowGlobalNoActivityMessage ? (
                            <SectionWrapper title="Activité de l'utilisateur">
                                <p className="text-gray-600 text-lg">
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
                                                buttonLink: "/participation",
                                                emptyButtonText: "Voir tous les événements"
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
                                            buttonLink={isOwner ? "/create-event" : undefined}
                                            emptyButtonText={isOwner ? "Créer un événement" : undefined}
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
                                            buttonLink="/allevents"
                                            emptyButtonText="Voir tous les événements"
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

            {isOwner && (
                <div className="mt-8 p-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Paramètres du compte</h3>
                    <div className="space-y-4">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-700 transition-colors flex items-center space-x-2"
                        >
                            {isDeleting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Suppression en cours...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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