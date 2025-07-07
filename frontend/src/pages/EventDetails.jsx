import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

import Header from '../components/Partials/Header';
import Footer from '../components/Partials/Footer';

import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../hooks/Animations/useTextAnimation';
import NotFound from './NotFound';

import useEventDetails from '../hooks/Events/useEventDetails';
import useComments from '../hooks/Comments/useComments';
import useParticipantsByEvent from '../hooks/Participant/useParticipantsByEvent';
import { useAuth } from '../config/authHeader';
import useAddComment from '../hooks/Comments/useAddComment';
import useReplyComment from '../hooks/Comments/useReplyComment';
import useAddParticipant from '../hooks/Participant/useAddParticipant';
import useUpdateEvent from '../hooks/Events/useUpdateEvent';
import useEventAverageRating from '../hooks/Rating/useEventAverageRating';

import EventHeaderInfo from '../components/Events/Event_Details/EventHeaderInfo';
import EventMainLeftColumn from '../components/Events/Event_Details/EventMainLeftColumn';
import EventMainRightColumn from '../components/Events/Event_Details/EventMainRightColumn';
import RatingBanner from '../components/Events/Event_Details/RatingBanner';

import useAddEventImages from '../hooks/Events/useAddEventImages';
import useDeleteEventImage from '../hooks/Events/useDeleteEventImage';
import useSetMainEventImage from '../hooks/Events/useSetMainEventImage';
import useUpdateEventImage from '../hooks/Events/useUpdateEventImage';

import vector1 from "../assets/img/et-3-event-vector.svg";
import vector2 from "../assets/img/et-3-event-vector-2.svg";

import { formatEuro } from '../utils/format';


function EventDetails() {
    useSlideUpAnimation();
    useTextAnimation();

    const { user, isAuthenticated } = useAuth();
    /***********
    * EVENTS:
    ************/
    const { eventId } = useParams();
    const { event, loading, error, refetchEvent } = useEventDetails(eventId);
    /***********
    * RATINGS:
    ************/
    const { averageRating, ratings, loading: ratingLoading, error: ratingError } = useEventAverageRating(eventId);
    const [showRatingsPopup, setShowRatingsPopup] = useState(false);
    /***********
    * COMMENTS :
    ************/
    const { add } = useAddComment();
    const { reply } = useReplyComment();
    const [newComment, setNewComment] = useState('');
    const { participants } = useParticipantsByEvent(eventId);
    const { comments, refetchComments } = useComments(eventId);
    /***********
    * PARTICIPANTS:
    ************/
    const { addNewParticipant } = useAddParticipant();
    const [ticketCount, setTicketCount] = useState(1);
    const [errors, setError] = useState("");
    const [errorCount, setErrorCount] = useState(0);
    const [guestCount, setGuestCount] = useState(0);
    const maxGuests = 3;
    const [guests, setGuests] = useState([]);
    /***********
   * ACCESS CONTROL:
   ************/
    const isCreator = user && event && user.id === event.organizer?.id;
    const isAdmin = user && user.role === 'Administrateur';
    const isParticipantRegistered = participants?.some(p => p.user.id === user?.id && p.status === "Inscrit");
    const eventTermine = event?.status === "Terminé";
    /***********
    * IMAGES EVENT EDITING:
    ************/
    const { addImages } = useAddEventImages();
    const { deleteImage } = useDeleteEventImage();
    const { setMainImage } = useSetMainEventImage();
    /***********
     * EVENTS EDITING STATE:
    ************/
    const { handleUpdateEvent } = useUpdateEvent();
    const { handleUpdateImage } = useUpdateEventImage();
    const [editing, setEditing] = useState(false);
    const [newStartDate, setNewStartDate] = useState(event?.start_time);
    const [newEndDate, setNewEndDate] = useState(event?.end_time);
    const [originalTitle, setOriginalTitle] = useState('');
    const [originalDescription, setOriginalDescription] = useState('');
    const [originalPrice, setOriginalPrice] = useState(0);
    const [originalMaxParticipants, setOriginalMaxParticipants] = useState(0);
    const [originalStreet, setOriginalStreet] = useState('');
    const [originalStreetNumber, setOriginalStreetNumber] = useState('');
    const [originalPostalCode, setOriginalPostalCode] = useState('');
    const [originalCity, setOriginalCity] = useState('');
    const [originalStartDate, setOriginalStartDate] = useState('');
    const [originalEndDate, setOriginalEndDate] = useState('');

    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newPrice, setNewPrice] = useState(0);
    const [newMaxParticipants, setNewMaxParticipants] = useState(0);
    const [newStreet, setNewStreet] = useState('');
    const [newStreetNumber, setNewStreetNumber] = useState('');
    const [newPostalCode, setNewPostalCode] = useState('');
    const [newCity, setNewCity] = useState('');

    /***********
    * PARTICIPANTS / EDIT:
    ************/

    const addGuestField = () => {
        if (guestCount < maxGuests) {
            setGuestCount(guestCount + 1);
            setGuests([...guests, { firstname: '', lastname: '', email: '' }]);
        } else {
            Swal.fire('Limite atteinte', "Vous ne pouvez ajouter que 3 invités.", 'warning');
        }
    };

    const updateGuestInfo = (index, field, value) => {
        const updated = [...guests];
        updated[index][field] = value;
        setGuests(updated);
    };

    const renderGuestInputs = (count) => {
        let fields = '';
        for (let i = 1; i < count; i++) {
            fields += `
            <hr class="my-4 border-gray-300 border-t"/>
            <div class="mb-2 font-semibold text-[#C320C0] text-sm">Invité n°${i}</div>
            <div class="space-y-3">
                <input type="text" id="guest-firstname-${i}" placeholder="Prénom" class="px-3 py-2 border rounded-md w-full text-sm" />
                <input type="text" id="guest-lastname-${i}" placeholder="Nom" class="px-3 py-2 border rounded-md w-full text-sm" />
                <input type="email" id="guest-email-${i}" placeholder="Email" class="px-3 py-2 border rounded-md w-full text-sm" />
            </div>
        `;
        }
        return fields;
    };

    const handleIncrease = () => {
        if (ticketCount < 4) {
            setTicketCount(ticketCount + 1);
            setError("");
        } else {
            setError("Il est possible de réserver un maximum de 4 places par utilisateur.");
            setErrorCount(prev => prev + 1);
        }
    };

    const handleDecrease = () => {
        if (ticketCount > 1) {
            const newCount = ticketCount - 1;
            setTicketCount(newCount);
            if (newCount < 4) {
                setError("");
            }
        }
    };

    const handleApplyToEvent = async () => {
        if (!isAuthenticated) {
            return Swal.fire({
                icon: 'info',
                title: 'Connexion requise',
                html: `<p class="text-gray-700 text-sm">Veuillez vous connecter pour candidater à cet événement.</p>`,
                confirmButtonText: 'Se connecter',
                cancelButtonText: 'Annuler',
                showCancelButton: true,
                confirmButtonColor: '#C320C0',
            }).then(res => {
                if (res.isConfirmed) window.location.href = '/login';
            });
        }

        const mainImage = event?.EventImages?.find(img => img.is_main) || event?.EventImages?.[0];
        const imageUrl = mainImage?.image_url?.startsWith('http') ? mainImage.image_url : `${API_BASE_URL}${mainImage?.image_url || ''}`;

        const { value: formValues } = await Swal.fire({
            customClass: {
                popup: 'p-0 overflow-hidden rounded-xl shadow-2xl',
            },
            html: `
            <div class="flex flex-col bg-white text-[15px] text-gray-700 text-left">
    
                <div class="relative overflow-hidden">
                    <img src="${imageUrl}" class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" alt="Événement">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="bottom-2 left-4 absolute font-bold text-white text-xl">${event.title}</div>
                </div>
    
                <div class="space-y-4 px-6 pt-4 pb-1">
                    <div>
                        <h3 class="font-semibold text-[#C320C0] text-lg">🎯 Récapitulatif</h3>
                        <div class="mt-1 text-gray-800">
                            <p><strong>📅 Date :</strong> ${new Date(event.start_time).toLocaleDateString('fr-FR')}</p>
                            <p><strong>📍 Lieu :</strong> ${event.city || 'À venir'}</p>
                            <p><strong>💰 Prix :</strong> ${event.price > 0 ? `${formatEuro(event.price)}` : 'Gratuit'}</p>
                        </div>
                    </div>
    
                    <hr class="border-gray-200 border-t"/>
    
                    <div>
                        <label class="block mb-1 font-medium text-gray-700 text-sm">💬 Message au créateur</label>
                        <textarea id="message" class="px-3 py-2 border focus:border-[#C320C0] rounded-md focus:ring-[#C320C0] w-full resize-none" rows="4" placeholder="Expliquez pourquoi vous voulez participer..."></textarea>
                    </div>

                    ${ticketCount > 1 ? renderGuestInputs(ticketCount) : ''}
    
                </div>
            </div>
            `,
            showCancelButton: true,
            confirmButtonText: '🎉 Valider la candidature',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#C320C0',
            width: '640px',
            padding: 0,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const message = document.getElementById('message')?.value?.trim();
                const guests = [];

                if (!message) {
                    Swal.showValidationMessage('Veuillez rédiger un message pour le créateur.');
                    return false;
                }

                if (ticketCount > 1) {
                    for (let i = 1; i < ticketCount; i++) {
                        const firstname = document.getElementById(`guest-firstname-${i}`)?.value?.trim();
                        const lastname = document.getElementById(`guest-lastname-${i}`)?.value?.trim();
                        const email = document.getElementById(`guest-email-${i}`)?.value?.trim();

                        if (!firstname || !lastname || !email) {
                            Swal.showValidationMessage(`Veuillez compléter les champs de l'invité n°${i}.`);
                            return false;
                        }

                        guests.push({ firstname, lastname, email });
                    }
                }

                return { message, guests };
            },
            backdrop: 'rgba(0,0,0,0.4)',
        });

        if (formValues) {
            try {
                await addNewParticipant(eventId, formValues.message, formValues.guests || []);
                Swal.fire({
                    icon: 'success',
                    title: 'Candidature envoyée 🎉',
                    text: 'Votre demande a été transmise à l’organisateur.',
                    confirmButtonColor: '#C320C0'
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: err.message || 'Impossible d’envoyer votre demande.',
                });
            }
        }
    };

    /***********
    * COMMENTS:
    ************/

    const handleAddComment = async () => {
        if (!isAuthenticated) {
            Swal.fire({
                icon: 'warning',
                title: 'Connexion requise',
                text: '🛑 Vous devez être connecté pour écrire un commentaire.',
                confirmButtonColor: '#C320C0',
                confirmButtonText: 'Se connecter',
            });
            return;
        }

        if (!newComment.trim()) return;

        try {
            await add(eventId, {
                title: 'Nouveau commentaire',
                message: newComment,
            });
            setNewComment('');
            await refetchComments();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: err.message || 'Une erreur est survenue lors de l\'envoi du commentaire.',
            });
        }
    };

    /***********
    * EVENTS EDITING STATE:
    ************/

    useEffect(() => {
        if (event) {
            setOriginalTitle(event.title);
            setNewTitle(event.title);

            setOriginalDescription(event.description);
            setNewDescription(event.description);

            setOriginalPrice(event.price || 0);
            setNewPrice(event.price || 0);

            setOriginalMaxParticipants(event.max_participants || 0);
            setNewMaxParticipants(event.max_participants || 0);

            setOriginalStreet(event.street || '');
            setNewStreet(event.street || '');

            setOriginalStreetNumber(event.street_number || '');
            setNewStreetNumber(event.street_number || '');

            setOriginalPostalCode(event.postal_code || '');
            setNewPostalCode(event.postal_code || '');

            setOriginalCity(event.city || '');
            setNewCity(event.city || '');

            setNewStartDate(formatDateForInput(event.start_time));
            setNewEndDate(formatDateForInput(event.end_time));

            setOriginalStartDate(formatDateForInput(event.start_time));
            setOriginalEndDate(formatDateForInput(event.end_time));
        }
    }, [event]);

    const handleSaveAllEdits = async () => {
        if (!event) return;

        const updatedFields = {};

        if (newTitle !== originalTitle) updatedFields.title = newTitle;
        if (newDescription !== originalDescription) updatedFields.description = newDescription;
        if (newPrice !== originalPrice) updatedFields.price = newPrice;
        if (newMaxParticipants !== originalMaxParticipants) updatedFields.max_participants = newMaxParticipants;
        if (newStreet !== originalStreet) updatedFields.street = newStreet;
        if (newStreetNumber !== originalStreetNumber) updatedFields.street_number = newStreetNumber;
        if (newPostalCode !== originalPostalCode) updatedFields.postal_code = newPostalCode;
        if (newCity !== originalCity) updatedFields.city = newCity;
        if (newStartDate !== originalStartDate) updatedFields.start_time = newStartDate;
        if (newEndDate !== originalEndDate) updatedFields.end_time = newEndDate;

        if (Object.keys(updatedFields).length === 0) {
            setEditing(false);
            return;
        }

        try {
            await handleUpdateEvent(event.id, updatedFields);
            setOriginalTitle(newTitle);
            setOriginalDescription(newDescription);
            setOriginalPrice(newPrice);
            setOriginalMaxParticipants(newMaxParticipants);
            setOriginalStreet(newStreet);
            setOriginalStreetNumber(newStreetNumber);
            setOriginalPostalCode(newPostalCode);
            setOriginalCity(newCity);
            setOriginalStartDate(newStartDate);
            setOriginalEndDate(newEndDate);

            await refetchEvent();
            Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'success',
                title: 'Modifications enregistrées avec succès',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });

        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message || 'Une erreur est survenue lors de l’enregistrement.',
            });
        }

        setEditing(false);
    };

    function formatDateForInput(datetime) {
        if (!datetime) return '';
        const date = new Date(datetime);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    }

    const handleCancelTitleDescription = () => {
        setNewTitle(originalTitle);
        setNewDescription(originalDescription);
    };

    const handleCancelDates = () => {
        setNewStartDate(originalStartDate);
        setNewEndDate(originalEndDate);
    };

    /***********
    * IMAGE EVENT EDITING:
    ************/

    const handleUpload = async (e, imageId = null) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            if (imageId) {
                await handleUpdateImage(imageId, files[0], user.token);
            } else {
                await addImages(event.id, files);
            }

            await refetchEvent();

        } catch (err) {
            Swal.fire('Erreur', err.message, 'error');
        }
    };

    const handleDelete = async (imageId) => {
        const confirm = await Swal.fire({
            title: 'Supprimer cette image ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#C320C0',
            confirmButtonText: 'Oui, supprimer'
        });
        if (confirm.isConfirmed) {
            try {
                await deleteImage(imageId);
                await refetchEvent();
            } catch (err) {
                Swal.fire('Erreur', err.message, 'error');
            }
        }
    };

    const handleSetMain = async (imageId) => {
        const confirm = await Swal.fire({
            title: 'Définir comme image principale ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#C320C0',
            confirmButtonText: 'Oui, définir'
        });
        if (confirm.isConfirmed) {
            try {
                await setMainImage(event.id, imageId);
                await refetchEvent();
            } catch (err) {
                Swal.fire('Erreur', err.message, 'error');
            }
        }
    };

    const canEditDate = !!user && !!event && (user.role === 'Administrateur' || user.id === event.organizer?.id);
    const isParticipant = event?.isParticipant;
    const hasRated = event?.hasRatedByUser;

    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

    // if (loading) return <p className="mt-10 text-center">Chargement...</p>;
    if (error) return <NotFound />;

    console.log(event);
    const mainImage = event?.EventImages?.find(img => img.is_main) || event?.EventImages?.[0];
    const mainImageUrl = mainImage?.image_url?.startsWith('http')
        ? mainImage.image_url
        : `${API_BASE_URL}${mainImage?.image_url || ''}`;

    const address = event?.street && event?.city
        ? `${event.street_number || ''} ${event.street}, ${event.postal_code || ''} ${event.city}`
        : '';
    const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

    return (
        <>
            <Header />
            <main>
                <section style={{
                    backgroundImage: `linear-gradient(to top right, #580FCA, #F929BB), url(${vector1})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundBlendMode: 'overlay',
                }}
                    className="z-[1] before:-z-[1] before:absolute relative bg-gradient-to-tr from-[#580FCA] to-[#F929BB] before:bg-cover before:bg-center before:opacity-30 pt-[210px] sm:pt-[160px] lg:pt-[190px] pb-[130px] sm:pb-[80px] lg:pb-[110px] et-breadcrumb">
                    <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full text-white text-center container">
                        <h1 className="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title anim-text">Détails de l’événement</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><a href="/" className="hover:text-[#C320C0] anim-text">Home</a></li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="current-page anim-text">Détails de l’événement</li>
                        </ul>
                    </div>
                </section>

                <section className="z-[1] relative overflow-hidden">
                    {event && event.status === "Terminé" && isParticipant && !hasRated && (
                        <RatingBanner
                            eventId={eventId}
                            userId={user?.id}
                            eventStatus={event?.status}
                            hasRated={hasRated}
                            isParticipant={isParticipant}
                            openPopup={() => setShowRatingsPopup(true)}
                        />
                    )}
                    <div className="py-[130px] md:py-[60px] lg:py-[80px] et-event-details-content">
                        <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full container">
                            <EventHeaderInfo
                                event={event}
                                canEditDate={canEditDate}
                                editing={editing}
                                setEditing={setEditing}
                                newStartDate={newStartDate}
                                setNewStartDate={setNewStartDate}
                                newEndDate={newEndDate}
                                setNewEndDate={setNewEndDate}
                                handleSaveAllEdits={handleSaveAllEdits}
                                handleCancelDates={handleCancelDates}
                                averageRating={averageRating}
                                ratingLoading={ratingLoading}
                                ratings={ratings}
                                onClickRating={() => setShowRatingsPopup(true)}
                            />
                            <div className="flex md:flex-col md:items-center gap-[30px] lg:gap-[20px]">
                                <EventMainLeftColumn
                                    event={event}
                                    mainImageUrl={mainImageUrl}
                                    user={user}
                                    comments={comments}
                                    participants={participants}
                                    eventId={eventId}
                                    newComment={newComment}
                                    setNewComment={setNewComment}
                                    handleAddComment={handleAddComment}
                                    handleApplyToEvent={handleApplyToEvent}
                                    API_BASE_URL={API_BASE_URL}
                                    canEdit={canEditDate}
                                    handleUpload={handleUpload}
                                    handleDelete={handleDelete}
                                    handleSetMain={handleSetMain}
                                    editing={editing}
                                    newTitle={newTitle}
                                    setNewTitle={setNewTitle}
                                    newDescription={newDescription}
                                    setNewDescription={setNewDescription}
                                    newMaxParticipants={newMaxParticipants}
                                    setNewMaxParticipants={setNewMaxParticipants}
                                    originalMaxParticipants={originalMaxParticipants}
                                    handleCancelTitleDescription={handleCancelTitleDescription}
                                    Swal={Swal}
                                    isCreator={isCreator}
                                    isAdmin={isAdmin}
                                    isParticipantRegistered={isParticipantRegistered}
                                    eventTermine={eventTermine}
                                    onRateClick={() => setShowRatingsPopup(true)}
                                    hasRated={hasRated}
                                />
                                <EventMainRightColumn
                                    event={event}
                                    handleApplyToEvent={handleApplyToEvent}
                                    ticketCount={ticketCount}
                                    handleIncrease={handleIncrease}
                                    handleDecrease={handleDecrease}
                                    errors={errors}
                                    errorCount={errorCount}
                                    address={address}
                                    googleMapUrl={googleMapUrl}
                                    formatEuro={formatEuro}
                                    editing={editing}
                                    newPrice={newPrice}
                                    setNewPrice={setNewPrice}
                                    originalPrice={originalPrice}
                                    setOriginalPrice={setOriginalPrice}
                                    newStreet={newStreet}
                                    setNewStreet={setNewStreet}
                                    originalStreet={originalStreet}
                                    setOriginalStreet={setOriginalStreet}
                                    newStreetNumber={newStreetNumber}
                                    setNewStreetNumber={setNewStreetNumber}
                                    originalStreetNumber={originalStreetNumber}
                                    setOriginalStreetNumber={setOriginalStreetNumber}
                                    newPostalCode={newPostalCode}
                                    setNewPostalCode={setNewPostalCode}
                                    originalPostalCode={originalPostalCode}
                                    setOriginalPostalCode={setOriginalPostalCode}
                                    newCity={newCity}
                                    setNewCity={setNewCity}
                                    originalCity={originalCity}
                                    setOriginalCity={setOriginalCity}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="*:-z-[1] *:absolute">
                        <h3 className="xl:hidden top-[420px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">Event</h3>
                        <div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
                        <div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
                        <img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
                        <img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
                        <img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
                        <img src={vector2} alt="vector" className="top-[1033px] -left-[175px] animate-[etSpin_7s_linear_infinite]" />
                    </div>

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

                            {ratingLoading && <p>Chargement...</p>}
                            {ratingError && <p className="text-red-500">Erreur : {ratingError}</p>}
                            {!ratingLoading && ratings && ratings.length === 0 && <p>Aucune note reçue.</p>}

                            {ratings.map((rating, index) => (
                                <div key={rating.id} className="mb-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`${API_BASE_URL}${rating.user.profileImage}`}
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


                                    {index !== ratings.length - 1 && (
                                        <hr className="my-4 border-gray-300" />
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                )}
            </main >
            <Footer />
        </>
    );
}

export default EventDetails;