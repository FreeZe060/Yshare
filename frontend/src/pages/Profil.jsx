import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/Profil/ProfileCard';
import EventsSection from '../components/Profil/EventsSection';
import useProfile from '../hooks/User/useProfile';
import { getCreatedEvents } from '../services/eventService';
import { getEventHistory } from '../services/userService';
import { getAllFavoris } from '../services/favorisService';
import { useParams } from 'react-router-dom';
import { useAuth } from '../config/authHeader';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Profil = () => {
    const { userId } = useParams();
    const { profile, accessLevel, loading, error } = useProfile(userId);
    const [participatedEvents, setParticipatedEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    const [favoriteEvents, setFavoriteEvents] = useState([]);

    const { user: currentUser } = useAuth();

    console.log("userId param:", userId);
    console.log("currentUser:", currentUser);

    const isOwner = accessLevel === 'private';

    useEffect(() => {
        if (!isOwner) return;

        const fetchParticipatedEvents = async () => {
            try {
                const data = await getEventHistory();
                setParticipatedEvents(data.slice(0, 5));
            } catch (err) {
                console.error(err);
            }
        };

        const fetchFavoriteEvents = async () => {
            try {
                const data = await getAllFavoris();
                const formatted = data.map(favori => ({
                    id: favori.Event.id,
                    title: favori.Event.title,
                    date: favori.Event.date,
                    status: "Favori",
                    image: favori.Event.img
                }));
                setFavoriteEvents(formatted.slice(0, 5));
            } catch (err) {
                console.error(err);
            }
        };

        fetchParticipatedEvents();
        fetchFavoriteEvents();
    }, [isOwner]);

    useEffect(() => {
        const fetchCreatedEvents = async () => {
            try {
                const data = await getCreatedEvents(userId);
                setCreatedEvents(data.slice(0, 5));
            } catch (err) {
                console.error(err);
            }
        };

        fetchCreatedEvents();
    }, [userId]);

    const handleUpdateProfileImage = (file) => {
        console.log('Mise à jour de l’image avec :', file);
    };

    const handleUpdateProfileField = (field, value) => {
        console.log(`Mise à jour de ${field} avec :`, value);
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
                        rating: profile.rating, 
                        eventsParticipated: isOwner ? participatedEvents.length : undefined,
                        eventsCreated: createdEvents.length
                    }} 
                    editable={isOwner} 
                    onUpdateProfileImage={handleUpdateProfileImage}
                    onUpdateProfileField={handleUpdateProfileField}
                />

                {isOwner && (
                    <EventsSection 
                        title="Événements Participés"
                        linkText="Voir tous l’historique"
                        events={participatedEvents}
                        emptyMessage="Vous n'avez encore participé à aucun événement. Rejoignez-en un dès maintenant !"
                        buttonLink="/allevents"
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

                {createdEvents.length === 0 && (
                    <EventsSection 
                        title="Événements Créés"
                        events={createdEvents}
                        emptyMessage="Cet utilisateur n'a pas encore créé d'événement."
                    />
                )}

                {isOwner && favoriteEvents.length > 0 && (
                    <EventsSection 
                        title="Favoris"
                        linkText="Voir tous les favoris"
                        events={favoriteEvents}
                        emptyMessage="Vous n'avez pas encore de favoris."
                        buttonLink="/allevents"
                    />
                )}
            </section>
            <Footer />
        </>
    );
};

export default Profil;