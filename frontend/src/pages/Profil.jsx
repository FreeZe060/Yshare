import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/Profil/ProfileCard';
import EventsSection from '../components/Profil/EventsSection';
import useProfile from '../hooks/User/useProfile';
import useFavoris from '../hooks/Favoris/useFavoris';
import { getCreatedEventsStats } from '../services/eventService';
import { getEventHistory, getParticipationCount} from '../services/userService';
import useUpdateProfile from '../hooks/User/useUpdateProfile';
import { getAllFavoris } from '../services/favorisService';
import { getUserAverageRating } from '../services/ratingService';
import { useParams } from 'react-router-dom';
import { useAuth } from '../config/authHeader';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Profil = () => {
    const { userId } = useParams();
    const { profile, accessLevel, loading, error } = useProfile(userId);
    const [participatedEvents, setParticipatedEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    const [stats, setStats] = useState({ created: 0, participated: 0 });
    const { favoris, loading: favorisLoading } = useFavoris();
    const { update, loading: updateLoading, error: updateError } = useUpdateProfile();
    

    const { user: currentUser } = useAuth();

    console.log("userId param:", userId);
    console.log("currentUser:", currentUser);

    const isOwner = accessLevel === 'private';

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

				if (isOwner) {
					const history = await getEventHistory(currentUser?.token, currentUser?.id);
					setParticipatedEvents(history.slice(0, 5));
				}

				setStats({
					created: createdStats.count,
					participated: isOwner ? participationCount : undefined,
                    rating: rating || 0
				});
			} catch (err) {
				console.error("Erreur lors de la récupération des données du profil :", err);
			}
		};

		fetchData();
	}, [userId, isOwner, currentUser?.token]);

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
        } catch (err) {
            console.error(`Erreur mise à jour ${field} :`, err.message);
        }
    };

    if (loading) return <div className="text-center text-2xl">Chargement...</div>;
    if (error) return <div className="text-center text-red-500">Erreur : {error}</div>;
    if (!profile) return null;

    return (
        <>
            <Header />
            <section className="container mx-auto pt-32 md:pt-32 p-8 space-y-12">
                <ProfileCard 
                    user={{
                        ...profile,
                        rating: stats.rating ?? 0,
                        eventsParticipated: stats.participated,
                        eventsCreated: stats.created
                    }} 
                    editable={isOwner} 
                    onUpdateProfileImage={handleUpdateProfileImage}
                    onUpdateProfileField={handleUpdateProfileField}
                />


                {isOwner && (
                    <EventsSection 
                        title="Événements Participés"
                        events={participatedEvents}
                        emptyMessage="Vous n'avez encore participé à aucun événement. Rejoignez-en un dès maintenant !"
                        buttonLink="/allevents"
                        emptyButtonText="Voir tous les événements"
                        {...(participatedEvents.length > 0 && {
                            linkText: "Voir tous l’historique"
                        })}
                    />
                )}


                {createdEvents.length > 0 && (
                    <EventsSection 
                        title="Événements Créés"
                        linkText="Voir tous l’historique"
                        events={createdEvents}
                        emptyMessage="Vous n'avez pas encore créé d'événement."
                        buttonLink="/allevents"
                    />
                )}

                {!isOwner && createdEvents.length === 0 && (
                    <EventsSection 
                        title="Événements Créés"
                        events={createdEvents}
                        emptyMessage="Cet utilisateur n'a pas encore créé d'événement."
                    />
                )}

                {isOwner && createdEvents.length === 0 && (
                    <EventsSection 
                        title="Événements Créés"
                        events={createdEvents}
                        emptyMessage="Vous n'avez pas encore créé d'événement."
                        buttonLink="/createevent"
                        emptyButtonText="Créer un événement"
                        {...(createdEvents.length > 0 && {
                            linkText: "Voir tous l’historique",
                            buttonLink: "/allevents"
                        })}
                    />
                )}

                {isOwner && (
                    <EventsSection
                        title="Favoris"
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
                )}
            </section>
            <Footer />
        </>
    );
};

export default Profil;