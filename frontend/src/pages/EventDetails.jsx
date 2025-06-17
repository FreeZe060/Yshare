import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import Header from '../components/Partials/Header';
import Footer from '../components/Partials/Footer';

import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../hooks/Animations/useTextAnimation';

import useEventDetails from '../hooks/Events/useEventDetails';
import useComments from '../hooks/Comments/useComments';
import useParticipantsByEvent from '../hooks/Participant/useParticipantsByEvent';
import { useAuth } from '../config/authHeader';
import useAddComment from '../hooks/Comments/useAddComment';
import useReplyComment from '../hooks/Comments/useReplyComment';
import useAddParticipant from '../hooks/Participant/useAddParticipant';

import EventHeaderInfo from '../components/Event_Details/EventHeaderInfo';
import EventMainLeftColumn from '../components/Event_Details/EventMainLeftColumn';
import EventMainRightColumn from '../components/Event_Details/EventMainRightColumn';
import RatingBanner from '../components/Event_Details/RatingBanner';

import vector1 from "../assets/img/et-3-event-vector.svg";
import vector2 from "../assets/img/et-3-event-vector-2.svg";

import { formatEuro } from '../utils/format';


function EventDetails() {
    useSlideUpAnimation();
    useTextAnimation();

    const { eventId } = useParams();
    const { event, loading, error } = useEventDetails(eventId);
    const { comments, refetchComments } = useComments(eventId);
    const { participants } = useParticipantsByEvent(eventId);
    const { add } = useAddComment();
    const { addNewParticipant } = useAddParticipant();
    const { reply } = useReplyComment();
    const { user, isAuthenticated } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [ticketCount, setTicketCount] = useState(1);
    const [errors, setError] = useState("");
    const [errorCount, setErrorCount] = useState(0);

    const [guestCount, setGuestCount] = useState(0);
    const maxGuests = 3;
    const [guests, setGuests] = useState([]);

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
            <hr class="border-t border-gray-300 my-4"/>
            <div class="font-semibold text-[#C320C0] text-sm mb-2">Invité n°${i}</div>
            <div class="space-y-3">
                <input type="text" id="guest-firstname-${i}" placeholder="Prénom" class="w-full px-3 py-2 border rounded-md text-sm" />
                <input type="text" id="guest-lastname-${i}" placeholder="Nom" class="w-full px-3 py-2 border rounded-md text-sm" />
                <input type="email" id="guest-email-${i}" placeholder="Email" class="w-full px-3 py-2 border rounded-md text-sm" />
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

    const handleApplyToEvent = async () => {
        if (!isAuthenticated) {
            return Swal.fire({
                icon: 'info',
                title: 'Connexion requise',
                html: `<p class="text-sm text-gray-700">Veuillez vous connecter pour candidater à cet événement.</p>`,
                confirmButtonText: 'Se connecter',
                cancelButtonText: 'Annuler',
                showCancelButton: true,
                confirmButtonColor: '#C320C0',
            }).then(res => {
                if (res.isConfirmed) window.location.href = '/login';
            });
        }

        const mainImage = event?.EventImages?.find(img => img.is_main) || event?.EventImages?.[0];
        const imageUrl = mainImage?.image_url?.startsWith('http') ? mainImage.image_url : `http://localhost:8080${mainImage?.image_url || ''}`;

        const { value: formValues } = await Swal.fire({
            customClass: {
                popup: 'p-0 overflow-hidden rounded-xl shadow-2xl',
            },
            html: `
            <div class="flex flex-col text-left text-[15px] text-gray-700 bg-white">
    
                <div class="relative overflow-hidden">
                    <img src="${imageUrl}" class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105" alt="Événement">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-2 left-4 text-white text-xl font-bold">${event.title}</div>
                </div>
    
                <div class="px-6 pt-4 pb-1 space-y-4">
                    <div>
                        <h3 class="text-lg font-semibold text-[#C320C0]">🎯 Récapitulatif</h3>
                        <div class="text-gray-800 mt-1">
                            <p><strong>📅 Date :</strong> ${new Date(event.start_time).toLocaleDateString('fr-FR')}</p>
                            <p><strong>📍 Lieu :</strong> ${event.city || 'À venir'}</p>
                            <p><strong>💰 Prix :</strong> ${event.price > 0 ? `${formatEuro(event.price)}` : 'Gratuit'}</p>
                        </div>
                    </div>
    
                    <hr class="border-t border-gray-200"/>
    
                    <div>
                        <label class="block font-medium text-sm text-gray-700 mb-1">💬 Message au créateur</label>
                        <textarea id="message" class="w-full px-3 py-2 border rounded-md resize-none focus:ring-[#C320C0] focus:border-[#C320C0]" rows="4" placeholder="Expliquez pourquoi vous voulez participer..."></textarea>
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

    const isParticipant = event?.isParticipant;
    const hasRated = event?.hasRatedByUser;

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    // if (loading) return <p className="mt-10 text-center">Chargement...</p>;
    if (error) return <p className="mt-10 text-red-600 text-center">Erreur: {error}</p>;

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
                        />
                    )}
                    <div className="py-[130px] md:py-[60px] lg:py-[80px] et-event-details-content">
                        <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full container">
                            <EventHeaderInfo
                                event={event}
                            />
                            <div className="flex md:flex-col md:items-center gap-[30px] lg:gap-[20px]">
                                <EventMainLeftColumn
                                    event={event}
                                    mainImageUrl={mainImageUrl}
                                    user={user}
                                    newComment={newComment}
                                    setNewComment={setNewComment}
                                    handleAddComment={handleAddComment}
                                    handleApplyToEvent={handleApplyToEvent}
                                    participants={participants}
                                    comments={comments}
                                    eventId={eventId}
                                    API_BASE_URL={API_BASE_URL}
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
            </main >
            <Footer />
        </>
    );
}

export default EventDetails;