import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/Profil/ProfileCard';
import EventsSection from '../components/Profil/EventsSection';
import useProfile from '../hooks/User/useProfile';
import useFavoris from '../hooks/Favoris/useFavoris';
import { getCreatedEventsStats } from '../services/eventService';
import { getEventHistory, getParticipationCount } from '../services/userService';
import useUpdateProfile from '../hooks/User/useUpdateProfile';
import { getAllFavoris } from '../services/favorisService';
import { useUserComments } from '../hooks/Comments/useUserComments';
import SkeletonProfileCard from '../components/SkeletonLoading/SkeletonProfileCard';
import { motion } from 'framer-motion';
import { getUserAverageRating } from '../services/ratingService';
import { useParams } from 'react-router-dom';
import { useAuth } from '../config/authHeader';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Profil = () => {
    const { userId } = useParams();
    const { profile, accessLevel, isOwner, isAdmin, loading, error, setProfile } = useProfile(userId);
    const [participatedEvents, setParticipatedEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    const [stats, setStats] = useState({ created: 0, participated: 0 });
    const { favoris, loading: favorisLoading } = useFavoris();
    const { update, loading: updateLoading, error: updateError } = useUpdateProfile();

    const { user: currentUser } = useAuth();
    const { commentsData, loading: commentsLoading } = useUserComments(userId);

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
                                    Cet utilisateur n’a pour l’instant participé à aucun événement ni créé d’événement.
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
                                                        : "Cet utilisateur n’a pour l’instant participé à aucun événement."
                                                    : null
                                            }
                                            {...(isOwner && participatedEvents.length === 0 && {
                                                buttonLink: "/allevents",
                                                emptyButtonText: "Voir tous les événements"
                                            })}
                                            {...(participatedEvents.length > 0 && {
                                                linkText: "Voir tout l’historique"
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
                                                        : "Cet utilisateur n’a pour l’instant créé aucun événement."
                                                    : null
                                            }
                                            buttonLink={isOwner ? "/createevent" : undefined}
                                            emptyButtonText={isOwner ? "Créer un événement" : undefined}
                                            {...(createdEvents.length > 0 && {
                                                linkText: "Voir tout l’historique"
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
                                                date: favori.date,
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
            <Footer />
        </>
    );
};

export default Profil;