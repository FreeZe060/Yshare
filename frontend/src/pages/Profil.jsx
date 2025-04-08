import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/Profil/ProfileCard';
import EventsSection from '../components/Profil/EventsSection';
import useProfile from '../hooks/User/useProfile';
import { getCreatedEvents } from '../services/eventService';
import { getEventHistory } from '../services/userService';
import { getAllFavoris } from '../services/favorisService';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';


const Profil = () => {
    const { userId } = useParams();
    const { profile, loading, error } = useProfile(userId);
    const [participatedEvents, setParticipatedEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    const [favoriteEvents, setFavoriteEvents] = useState([]);

    const isEditable = !userId;

    useEffect(() => {
        const fetchParticipatedEvents = async () => {
            try {
                const data = await getEventHistory();
                setParticipatedEvents(data.slice(0, 5)); 
            } catch (err) {
                console.error(err);
            }
        };

        fetchParticipatedEvents();

        const fetchCreatedEvents = async () => {
            try {
                const data = await getCreatedEvents();
                setCreatedEvents(data.slice(0, 5));
            } catch (err) {
                console.error(err);
            }
        };

        fetchCreatedEvents();

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

        fetchFavoriteEvents();
    }, []);

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
            <div className="container mx-auto p-8 space-y-12">
                <ProfileCard 
                    user={{
                        ...profile,
                        rating: profile.rating, 
                        eventsParticipated: profile.eventsParticipated,
                        eventsCreated: profile.eventsCreated
                    }} 
                    editable={isEditable} 
                    onUpdateProfileImage={handleUpdateProfileImage}
                    onUpdateProfileField={handleUpdateProfileField}
                />

                <div>
                    <EventsSection 
                        title="Événements Participés"
                        linkText="Voir tous l’historique"
                        events={participatedEvents}
                        emptyMessage="Vous n'avez encore participé à aucun événement. Rejoignez-en un dès maintenant !"
                        buttonLink="/allevents"
                    />
                </div>

                {createdEvents.length > 0 && (
                    <div>
                        <EventsSection 
                            title="Événements Créés"
                            linkText="Voir tous l’historique"
                            events={createdEvents}
                            emptyMessage="Vous n'avez pas encore créé d'événement."
                            buttonLink="/allevents"
                        />
                    </div>
                )}

                {favoriteEvents.length > 0 && (
                    <div>
                        <EventsSection 
                            title="Favoris"
                            linkText="Voir tous les favoris"
                            events={favoriteEvents}
                            emptyMessage="Vous n'avez pas encore de favoris."
                            buttonLink="/allevents"
                        />
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default Profil;