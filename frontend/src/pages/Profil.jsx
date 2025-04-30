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
    const { commentsData, loading: commentsLoading } = useUserComments(userId, currentUser?.token);

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
        if (!userId || !currentUser?.token) return;

        const fetchData = async () => {
            try {
                const [createdStats, participationCount, rating] = await Promise.all([
                    getCreatedEventsStats(userId),
                    getParticipationCount(userId),
                    getUserAverageRating(userId)
                ]);

                setCreatedEvents(createdStats.events.slice(0, 5));

                if (isOwner || isAdmin) {
                    const history = await getEventHistory(currentUser.token, userId);
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
    }, [userId, currentUser?.token, isOwner, isAdmin]);

    console.log("STATS →", stats);

    const handleUpdateProfileImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('profileImage', file);

            const userIdToUpdate = isOwner ? currentUser.id : userId;
            await update(formData, userIdToUpdate);

            window.location.reload();
        } catch (err) {
            console.error("Erreur mise à jour image :", err.message);
        }
    };

    const handleUpdateProfileField = async (field, value) => {
        try {
            if (!value.trim()) return;

            const userIdToUpdate = isOwner ? currentUser.id : userId;
            await update({ [field]: value }, userIdToUpdate);

            setProfile((prev) => ({
                ...prev,
                [field]: value
            }));
        } catch (err) {
            console.error(`Erreur mise à jour ${field} :`, err.message);
        }
    };

    if (error) return <div className="text-center text-red-500">Erreur : {error}</div>;
    if (!profile) return <SkeletonProfileCard />;

    const shouldShowGlobalNoActivityMessage = isAdmin && !isOwner && stats.created === 0 && stats.participated === 0;

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
                        <>
                            {shouldShowGlobalNoActivityMessage && (
                                <SectionWrapper title="Activité de l'utilisateur">
                                    <p className="text-gray-600 text-lg">
                                        Cet utilisateur n’a pour l’instant participé à aucun événement ni créé d’événement.
                                    </p>
                                </SectionWrapper>
                            )}

                            {(isOwner || isAdmin) && !shouldShowGlobalNoActivityMessage && (
                                <SectionWrapper title="Événements Participés">
                                    <EventsSection
                                        events={participatedEvents}
                                        emptyMessage={
                                            stats.participated === 0
                                                ? isOwner
                                                    ? "Vous n'avez encore participé à aucun événement. Rejoignez-en un dès maintenant !"
                                                    : "Cet utilisateur n’a pour l’instant participé à aucun événement."
                                                : null
                                        }
                                        {...(isOwner && stats.participated === 0 && {
                                            buttonLink: "/allevents",
                                            emptyButtonText: "Voir tous les événements"
                                        })}
                                        {...(participatedEvents.length > 0 && {
                                            linkText: "Voir tout l’historique"
                                        })}
                                    />
                                </SectionWrapper>
                            )}

                            {(stats.created > 0 || isOwner || (isAdmin && !shouldShowGlobalNoActivityMessage)) && (
                                <SectionWrapper title="Événements Créés">
                                    <EventsSection
                                        events={createdEvents}
                                        emptyMessage={
                                            stats.created === 0
                                                ? isOwner
                                                    ? "Vous n'avez pas encore créé d'événement."
                                                    : isAdmin && !isOwner
                                                        ? "Cet utilisateur n’a pour l’instant créé aucun événement."
                                                        : "Cet utilisateur n'a pas encore créé d'événement."
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
                    }
                />
            </section>
            <Footer />
        </>
    );
};

export default Profil;