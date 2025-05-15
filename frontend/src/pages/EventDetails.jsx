import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../hooks/Animations/useTextAnimation';

import useEventDetails from '../hooks/Events/useEventDetails';
import useComments from '../hooks/Comments/useComments';
import useParticipantsByEvent from '../hooks/Participant/useParticipantsByEvent';
import { useAuth } from '../config/authHeader';
import useAddComment from '../hooks/Comments/useAddComment';
import useReplyComment from '../hooks/Comments/useReplyComment';
import useAddParticipant from '../hooks/Participant/useAddParticipant';

import CommentBlock from '../components/CommentBlock';


import vector1 from "../assets/img/et-3-event-vector.svg";
import vector2 from "../assets/img/et-3-event-vector-2.svg";

import soiree from '../assets/img/soiree.jpg';

import { formatEuro, getFormattedDayAndMonthYear, capitalizeFirstLetter } from '../utils/format';


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
    
                    ${event.price > 0 ? `
                    <div class="space-y-2">
                        <hr class="border-t border-gray-200"/>
                        <label class="block font-medium text-sm text-gray-700">💳 Informations de paiement</label>
                        <input
                            id="card"
                            inputmode="numeric"
                            maxlength="19"
                            placeholder="1234 5678 9012 3456"
                            class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C320C0]"
                            oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();"
                        />
                        <p class="text-xs text-gray-500">Le paiement est simulé. Aucun montant ne sera débité.</p>
                    </div>
                    ` : ''}
    
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
                const card = document.getElementById('card')?.value;

                if (!message) {
                    Swal.showValidationMessage('Veuillez rédiger un message pour le créateur.');
                    return false;
                }

                if (event.price > 0) {
                    const cleanCard = card?.replace(/\s/g, '');
                    if (!cleanCard || cleanCard.length < 16) {
                        Swal.showValidationMessage('Numéro de carte invalide (16 chiffres requis).');
                        return false;
                    }
                }

                return { message, card };
            },
            backdrop: 'rgba(0,0,0,0.4)',
        });

        if (formValues) {
            try {
                await addNewParticipant(eventId);
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


    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    // if (loading) return <p className="mt-10 text-center">Chargement...</p>;
    if (error) return <p className="mt-10 text-red-600 text-center">Erreur: {error}</p>;

    console.log(event);
    const mainImage = event?.EventImages?.find(img => img.is_main) || event?.EventImages?.[0];
    const mainImageUrl = mainImage?.image_url?.startsWith('http')
        ? mainImage.image_url
        : `${API_BASE_URL}${mainImage?.image_url || ''}`;

    const address = `${event?.street_number || ''} ${event?.street}, ${event?.postal_code} ${event?.city}`;
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
                    class="z-[1] before:-z-[1] before:absolute relative bg-gradient-to-tr from-[#580FCA] to-[#F929BB] before:bg-cover before:bg-center before:opacity-30 pt-[210px] sm:pt-[160px] lg:pt-[190px] pb-[130px] sm:pb-[80px] lg:pb-[110px] et-breadcrumb">
                    <div class="mx-auto px-[12px] max-w-[1200px] xl:max-w-full text-white text-center container">
                        <h1 class="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title anim-text">Détails de l’événement</h1>
                        <ul class="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li class="opacity-80"><a href="/" class="hover:text-[#C320C0] anim-text">Home</a></li>
                            <li><i class="fa-angle-right fa-solid"></i><i class="fa-angle-right fa-solid"></i></li>
                            <li class="current-page anim-text">Détails de l’événement</li>
                        </ul>
                    </div>
                </section>

                <section className="z-[1] relative overflow-hidden">


                    <div class="py-[130px] md:py-[60px] lg:py-[80px] et-event-details-content">
                        <div class="mx-auto px-[12px] max-w-[1200px] xl:max-w-full container">

                            <div className="flex md:flex-row flex-col justify-between items-start md:items-end gap-4 mb-12 pb-8 border-[#e5e5e5] border-b">
                                <div class="flex flex-row justify-between items-center gap-2 w-full">
                                    <h1 className="font-bold text-[42px] text-etBlack xs:text-[32px] leading-tight">
                                        {capitalizeFirstLetter(event?.title)}
                                    </h1>
                                    {event && event.status && (
                                        <div className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2
                                            ${event.status === 'Planifié' ? 'bg-blue-100 text-blue-700' : ''}
                                            ${event.status === 'En Cours' ? 'bg-green-100 text-green-700' : ''}
                                            ${event.status === 'Terminé' ? 'bg-gray-200 text-gray-700' : ''}
                                            ${event.status === 'Annulé' ? 'bg-red-100 text-red-700' : ''}
                                        `}>
                                            {event.status}
                                        </div>
                                    )}

                                </div>

                                {/* Infos date + status */}
                                <div className="flex flex-col gap-2">
                                    <p className="mt-2 font-light text-[16px] text-etGray">
                                        Créé par
                                        {event?.organizer ? (
                                            <div>
                                                <Link
                                                    to={`/profile/${event.organizer.id}`}
                                                >
                                                    <img
                                                        src={`http://localhost:8080${event.organizer.profileImage}`}
                                                        alt="Organizer"
                                                        className="w-8 h-8 rounded-full inline-block mr-2"
                                                    />
                                                    <span className="font-medium text-[#C320C0]">
                                                        {event.organizer.name} {event.organizer.lastname}
                                                    </span>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="text-etGray text-sm">Organisateur inconnu</div>
                                        )}
                                    </p>
                                    <div className="text-left">
                                        <p className="text-sm text-etGray mb-1 font-light tracking-wide uppercase">Quand</p>
                                        <p className="text-[17px] leading-relaxed text-etBlack font-semibold font-sans">
                                            <span className="text-etPurple font-bold">Du</span>{' '}
                                            {new Date(event?.start_time).toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}{' '}
                                            à {new Date(event?.start_time).toLocaleTimeString("fr-FR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                            <br />
                                            <span className="text-etPink font-bold">Au</span>{' '}
                                            {new Date(event?.end_time).toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}{' '}
                                            à {new Date(event?.end_time).toLocaleTimeString("fr-FR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>

                                    {/* Badge status */}

                                </div>
                            </div>


                            <div class="flex md:flex-col md:items-center gap-[30px] lg:gap-[20px]">
                                <div class="left">
                                    <div class="relative rounded-[8px] overflow-hidden rev-slide-up">
                                        <img src={mainImageUrl || soiree} alt="event-details-img" class="bg-cover" />
                                        <span class="inline-block top-[20px] left-[20px] absolute bg-[#C320C0] px-[12px] py-[5px] rounded-[6px] font-normal text-[16px] text-white">Hall No: 59</span>
                                    </div>

                                    <div class="rev-slide-up">
                                        <h4 class="mt-[27px] mb-[11px] font-medium text-[30px] text-etBlack xs:text-[25px] xxs:text-[22px]">
                                            {event?.title}
                                        </h4>

                                        <p class="mb-[15px] font-light text-[16px] text-etGray">
                                            {event?.description}
                                        </p>

                                        {/* <h4 class="mt-[19px] mb-[11px] font-medium text-[30px] text-etBlack xs:text-[25px] xxs:text-[22px]">
                                            Requirements for the event
                                        </h4>

                                        <p class="mb-[21px] font-light text-[16px] text-etGray">
                                            Nulla facilisi. Vestibulum tristique sem in eros eleifend imperdiet...
                                        </p>

                                        <ul class="gap-[20px] xxs:gap-[10px] grid grid-cols-2 xxs:grid-cols-1 font-light text-[16px] text-etGray et-event-details-requirements-list">
                                            <li>Ut viverra bibendum lorem, at tempus nibh</li>
                                            <li>Duis aute irure and dolor in reprehenderit.</li>
                                            <li>quis nostrud exercitation ullamco laboris nisi</li>
                                            <li>ante rutrum sed the is sodales augue</li>
                                        </ul> */}

                                        {event?.EventImages?.filter(img => !img.is_main).length > 0 && (
                                            <div class="gap-[30px] lg:gap-[20px] grid grid-cols-2 xxs:grid-cols-1 mt-[38px] mb-[33px]">
                                                {event.EventImages.filter(img => !img.is_main).map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={`${API_BASE_URL}${img.image_url}`}
                                                        alt="event-details-img"
                                                        className="rounded-[8px] w-full h-[306px] object-cover"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* <p class="mb-[43px] font-light text-[16px] text-etGray">
                                        </p> */}
                                    </div>


                                    <div class="flex xxs:flex-col items-center gap-[20px] py-[24px] border-[#d9d9d9] border-y rev-slide-up">
                                        <button
                                            onClick={handleApplyToEvent}
                                            className="inline-flex items-center gap-[10px] bg-[#C320C0] hover:bg-white px-[20px] border-[#C320C0] border-2 rounded-full h-[50px] font-medium text-[17px] text-white hover:text-[#C320C0] transition-all duration-300"
                                        >
                                            Candidater maintenant
                                            <i className="fa-arrow-right-long fa-solid" />
                                        </button>
                                    </div>

                                    <div class="mt-[50px] rev-slide-up">
                                        <h3 class="mb-[30px] xs:mb-[15px] font-semibold text-[30px] text-etBlack xs:text-[25px] anim-text">Liste des participants à l’événement</h3>

                                        {participants?.length === 0 ? (
                                            <div class="text-center p-[30px] border border-dashed border-[#C320C0] rounded-[12px] bg-[#fdf5ff] animate-fade-in">
                                                <h4 class="text-[24px] font-bold text-[#C320C0] mb-[10px] animate-bounce">
                                                    Aucun participant n'est encore inscrit
                                                </h4>
                                                <p class="text-[16px] text-etGray mb-[10px] animate-slide-up">
                                                    Soyez le premier à rejoindre cette aventure et faites partie des pionniers !
                                                </p>
                                                <a
                                                    href="#"
                                                    class="inline-block mt-[20px] px-[24px] py-[12px] text-white bg-[#C320C0] hover:bg-[#a51899] transition-all duration-300 rounded-full text-[16px] font-medium shadow-lg animate-pulse"
                                                >
                                                    Candidater maintenant
                                                </a>
                                            </div>
                                        ) : (
                                            participants.map((participant, index) => {
                                                const user = participant?.User;

                                                if (!user) {
                                                    console.warn("⚠️ Participant sans user défini :", participant);
                                                    return null;
                                                }

                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex xs:flex-col gap-x-[25px] gap-y-[10px] mb-[30px] p-[30px] lg:p-[20px] border border-[#d9d9d9] rounded-[12px]"
                                                    >
                                                        <div className="rounded-[6px] overflow-hidden shrink-0">
                                                            <Link to={`/profile/${user.id}`} >
                                                                <img
                                                                    src={`http://localhost:8080${user.profileImage || '/default-profile.jpg'}`}
                                                                    alt="Participant"
                                                                    className="w-[168px] aspect-square object-cover"
                                                                />
                                                            </Link>
                                                        </div>

                                                        <div className="grow">
                                                            <div className="flex flex-wrap justify-between items-center gap-[10px] pb-[15px] border-[#d9d9d9] border-b">
                                                                <div>
                                                                    <Link to={`/profile/${user.id}`} >
                                                                        <h5 className="font-semibold text-[20px] text-etBlack">
                                                                            {user.name} {user.lastname}
                                                                        </h5>
                                                                    </Link>
                                                                    <span className="inline-block text-[16px] text-etGray2">
                                                                        {user.email}
                                                                    </span>
                                                                </div>
                                                                <span className="inline-block px-[12px] py-[4px] text-sm bg-green-100 text-green-700 rounded-full font-medium">
                                                                    {participant.status}
                                                                </span>
                                                            </div>

                                                            <p className="pt-[20px] font-light text-[16px] text-etGray2">
                                                                {user.bio || "Aucune biographie fournie."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div className="mt-[60px] animate-fade-in">
                                        <h3 className="mb-[30px] text-[30px] font-semibold text-etBlack">Commentaires</h3>
                                        <div className="rounded-[16px] border border-[#f0f0f0] shadow-lg p-[30px] bg-white space-y-[20px]">
                                            <div className="space-y-8">
                                                <div className="flex gap-4">
                                                    <img
                                                        src={
                                                            user?.profileImage
                                                                ? `http://localhost:8080${user.profileImage}`
                                                                : "https://assets.codepen.io/285131/hat-man.png"
                                                        }
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        alt="avatar"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleAddComment();
                                                            }
                                                        }}
                                                        placeholder={user ? "Ajouter un commentaire..." : "Connectez-vous pour commenter"}
                                                        className={`flex-1 h-12 px-4 rounded-md border border-gray-200 placeholder-gray-400 ${user ? "focus:outline-none focus:ring-2 focus:ring-gray-100" : "cursor-not-allowed bg-gray-100"
                                                            }`}
                                                        disabled={!user}
                                                    />
                                                </div>

                                                {comments?.map((comment) => (
                                                    <CommentBlock key={comment.id} comment={comment} eventId={eventId} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="right space-y-[30px] w-[370px] lg:w-[360px] max-w-full shrink-0">
                                    <div class="border border-[#e5e5e5] rounded-[16px] overflow-hidden et-event-details-ticket-widgget">
                                        <div class="bg-[#C320C0] p-[16px] xxs:p-[12px]">
                                            <h5 class="font-medium text-[20px] text-white text-center">Sélectionnez la date et l’heure</h5>
                                        </div>

                                        <div class="p-[22px] lg:p-[16px]">
                                            <div class="flex justify-between items-center mt-[6px] mb-[16px]">
                                                <h6 class="font-medium text-[#232323] text-[16px]">Plage horaire</h6>

                                                <div class="flex items-center gap-[20px] text-[16px]" id="et-event-details-ticket-time-slider-nav">
                                                    <button class="hover:text-[#C320C0] prev"><i class="fa-angle-left fa-solid"></i></button>
                                                    <button class="hover:text-[#C320C0] next"><i class="fa-angle-right fa-solid"></i></button>
                                                </div>
                                            </div>

                                            <div class="mb-[24px] overflow-visible et-event-details-ticket-time-slider swiper">
                                                <div class="swiper-wrapper">
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <form class="space-y-[10px] mb-[30px]">
                                                <div class="px-[16px] py-[7px] border border-[#d9d9d9] rounded-[6px] radio-container">
                                                    <label for="schedule1" class="relative flex gap-[15px] font-normal text-[#232323] text-[14px]">
                                                        <span>posuere turpis, eget molestie Nulla at nibh et.</span>
                                                        <span class="flex items-center">
                                                            <input type="radio" id="schedule1" name="options" value="schedule1" class="appearance-none" checked />
                                                            <span class="before:top-[50%] after:top-[50%] before:right-0 after:right-0 before:-z-[1] before:absolute after:absolute before:content-normal after:content-normal before:bg-white after:bg-[#C320C0] after:opacity-0 mr-[28px] after:mr-[4px] before:border before:border-etBlue before:rounded-full after:rounded-full before:w-[16px] after:w-[8px] before:h-[16px] after:h-[8px] before:-translate-y-[50%] after:-translate-y-[50%]">15,00 €</span>
                                                        </span>
                                                    </label>
                                                </div>

                                                <div class="px-[16px] py-[7px] border border-[#d9d9d9] rounded-[6px] radio-container">
                                                    <label for="schedule2" class="relative flex gap-[15px] font-normal text-[#232323] text-[14px]">
                                                        <span>posuere turpis, eget molestie Nulla at nibh et.</span>
                                                        <span class="flex items-center">
                                                            <input type="radio" id="schedule2" name="options" value="schedule2" class="appearance-none" />
                                                            <span class="before:top-[50%] after:top-[50%] before:right-0 after:right-0 before:-z-[1] before:absolute after:absolute before:content-normal after:content-normal before:bg-white after:bg-[#C320C0] after:opacity-0 mr-[28px] after:mr-[4px] before:border before:border-etBlue before:rounded-full after:rounded-full before:w-[16px] after:w-[8px] before:h-[16px] after:h-[8px] font-normal text-[#232323] text-[14px] before:-translate-y-[50%] after:-translate-y-[50%]">13,00 €</span>
                                                        </span>
                                                    </label>
                                                </div>

                                                <div class="px-[16px] py-[7px] border border-[#d9d9d9] rounded-[6px] radio-container">
                                                    <label for="schedule3" class="relative flex gap-[15px] font-normal text-[#232323] text-[14px]">
                                                        <span>posuere turpis, eget molestie Nulla at nibh et.</span>
                                                        <span class="flex items-center">
                                                            <input type="radio" id="schedule3" name="options" value="schedule3" class="appearance-none" />
                                                            <span class="before:top-[50%] after:top-[50%] before:right-0 after:right-0 before:-z-[1] before:absolute after:absolute before:content-normal after:content-normal before:bg-white after:bg-[#C320C0] after:opacity-0 mr-[28px] after:mr-[4px] before:border before:border-etBlue before:rounded-full after:rounded-full before:w-[16px] after:w-[8px] before:h-[16px] after:h-[8px] font-normal text-[#232323] text-[14px] before:-translate-y-[50%] after:-translate-y-[50%]">14,00 €</span>
                                                        </span>
                                                    </label>
                                                </div>
                                            </form>

                                            <div class="mb-[30px] px-[80px] xxs:px-[30px] border-[#d9d9d9] border-[0.5px] rounded-full">
                                                <div class="flex justify-between items-center gap-[15px] py-[17px]">
                                                    <button type="button" id="decreaseButton" class="inline-flex justify-center items-center bg-[#C320C0]/10 hover:bg-[#C320C0] rounded-full w-[28px] aspect-square font-extralight text-[35px] hover:text-white decrease">
                                                        <span class="h-[28px] leading-[22px]">&minus;</span>
                                                    </button>
                                                    <span class="font-light text-[16px]"><span id="ticketNumber">1</span> Ticket</span>

                                                    <button type="button" id="increaseButton" class="inline-flex justify-center items-center bg-[#C320C0]/10 hover:bg-[#C320C0] rounded-full w-[28px] aspect-square font-extralight text-[35px] hover:text-white increase">
                                                        <span class="h-[28px] leading-[22px]">&plus;</span>
                                                    </button>
                                                </div>
                                            </div>


                                            <button class="flex justify-center items-center gap-x-[10px] bg-[#C320C0] hover:bg-white px-[15px] border-[#C320C0] border-2 rounded-full w-full h-[50px] text-[15px] text-white hover:text-[#C320C0]">

                                                <span>{`${event?.price > 0 ? "Candidater" : "Candidater"} (${formatEuro(event?.price)}) `}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="border border-[#e5e5e5] rounded-[16px]">
                                        <div class="bg-[#C320C0] p-[16px] xxs:p-[12px] rounded-t-[16px]">
                                            <h5 class="font-medium text-[17px] text-white text-center"><i className="mr-2 fas fa-map-marker-alt"></i>{address}</h5>
                                        </div>
                                        <iframe
                                            src={googleMapUrl}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="rounded-b-[16px] w-full h-[280px]"
                                            title="Event Location"
                                        />
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VECTORS + BACKGROUND */}
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
