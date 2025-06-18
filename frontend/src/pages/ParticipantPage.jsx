import React, { useState, useEffect, useRef } from 'react';
import 'animate.css';
import Header from "../components/Partials/Header";
import Footer from "../components/Partials/Footer";
import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../hooks/Animations/useTextAnimation';
import { Link, useParams } from 'react-router-dom';
import vector1 from "../assets/img/et-3-event-vector.svg";
import vector2 from "../assets/img/et-3-event-vector-2.svg";
import useParticipantsByEvent from '../hooks/Participant/useParticipantsByEvent';
import useUpdateParticipantStatus from '../hooks/Participant/useUpdateParticipantStatus';
import Swal from 'sweetalert2';
import { useAuth } from '../config/authHeader';


const ParticipantPage = () => {
    const { eventId } = useParams();
    const { participants, loading } = useParticipantsByEvent(eventId);
    const { updateStatus } = useUpdateParticipantStatus();
    // const [expandedIndex, setExpandedIndex] = useState(null);
    const [expandedGuestsIndex, setExpandedGuestsIndex] = useState(null);
    const [expandedBioIndex, setExpandedBioIndex] = useState(null);
    const { user } = useAuth();

    // const titleRef = useRef(null);
    // const invitesRef = useRef(null);

    const handleToggleBio = (index) => {
        setExpandedBioIndex(expandedBioIndex === index ? null : index);
    };

    const handleToggleGuests = (index) => {
        setExpandedGuestsIndex(expandedGuestsIndex === index ? null : index);
    };

    const statusStyles = {
        'Inscrit': 'text-green-600 font-semibold',
        'En Attente': 'text-yellow-600 font-semibold',
        'Refusé': 'text-red-600 font-semibold',
        'Annulé': 'text-gray-500 font-medium'
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleStatusChange = async (participant) => {
        const { value: formValues } = await Swal.fire({
            title: `Modifier le statut de ${participant.user.name} ${participant.user.lastname}`,
            html:
                `<select id="status" class="swal2-input">
                    <option value="Inscrit">Inscrit</option>
                    <option value="Refusé">Refusé</option>
                    <option value="En Attente">En Attente</option>
                </select>
                <textarea id="message" class="swal2-textarea" placeholder="Message pour le participant"></textarea>`,
            focusConfirm: false,
            preConfirm: () => {
                const status = document.getElementById('status').value;
                const message = document.getElementById('message').value;
                if (!message && !user?.role?.includes('administrateur')) {
                    Swal.showValidationMessage('Un message est requis pour cette mise à jour.');
                }
                return { status, message };
            }
        });

        if (formValues) {
            try {
                await updateStatus(
                    eventId,
                    participant.participantId,
                    formValues.status,
                    formValues.message
                );

                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'success',
                    title: 'Statut mis à jour avec succès',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true
                });

                window.location.reload();
            } catch (err) {
                Swal.fire('Erreur', err.message, 'error');
            }
        }
    };

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
                        <h1 className="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title anim-text">Participants à l'événement</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><a href="/" className="hover:text-[#C320C0] anim-text">Home</a></li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="opacity-80 hover:text-blue-400 cursor-pointer">
                                <a href="/event-created">Toutes vos créations</a>
                            </li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="current-page">Participants</li>
                        </ul>
                    </div>
                </section>

                <section className="z-[1] relative py-[60px] md:py-[60px] xl:py-[80px] overflow-hidden">
                    <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                        <div className="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
                            <h6 className="after:top-[46%] after:right-0 after:absolute mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] anim-text et-3-section-sub-title">
                                Vos participants
                            </h6>
                            <h2 className="mb-[26px] text-center anim-text et-3-section-title">Tous les participants de votre événement</h2>
                        </div>
                    </div>
                    <div className="py-[130px] md:py-[60px] lg:py-[80px]">
                        <section className="et-team">
                            <div className="mx-auto px-[12px] max-w-[1300px] container">
                                <div className="justify-center gap-[30px] lg:gap-[20px] grid grid-cols-3 xxs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                    {loading ? (
                                        <p className="text-center col-span-3">Chargement...</p>
                                    ) : participants.map((participant, index) => (
                                        <div key={participant.participantId} className="group et-member">
                                            <div className="rounded-[16px] overflow-hidden et-member__img h-[280px]">
                                                <img
                                                    src={`http://localhost:8080${participant.user.profileImage}`}
                                                    alt="Participant"
                                                    className="w-full h-full object-cover group-hover:scale-110 duration-[400ms]"
                                                />
                                            </div>

                                            <div className="bg-white shadow-[0_4px_60px_rgba(18,96,254,0.12)] mx-[25px] -mt-[44px] px-[25px] pb-[30px] rounded-[16px] relative">
                                                <p className={`absolute pt-6 right-2 text-sm ${statusStyles[participant.status] || 'text-etGray'}`}>
                                                    {participant.status}
                                                </p>

                                                <Link to={`/profile/${participant.user.id}`}>
                                                    <h5 className="text-[20px] font-semibold text-etBlack pt-4 flex gap-2 justify-center max-w-[80%] mx-auto text-center cursor-pointer hover:text-blue-600 no-underline transition-colors duration-200">
                                                        <span>
                                                            {participant.user.name.length > 10
                                                                ? participant.user.name.slice(0, 10) + '…'
                                                                : participant.user.name}
                                                        </span>
                                                        <span>
                                                            {participant.user.lastname.length > 10
                                                                ? participant.user.lastname.slice(0, 10) + '…'
                                                                : participant.user.lastname}
                                                        </span>
                                                    </h5>
                                                </Link>

                                                <div className="mt-4 text-left mx-auto w-[90%] flex flex-col items-start justify-center gap-2 text-etGray text-sm">
                                                    <p><strong>Email :</strong> {participant.user.email}</p>

                                                    <p>
                                                        <strong>{participant.status === 'Inscrit' ? 'Inscrit depuis :' : 'Demande faite le :'}</strong>{' '}
                                                        {formatDate(participant.validatedAt || participant.joinedAt)}
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            {participant.organizerResponse && participant.organizerResponse !== '(aucune réponse)'
                                                                ? 'Votre message :'
                                                                : 'Demande du participant :'}
                                                        </strong>
                                                        <br />
                                                        {participant.organizerResponse && participant.organizerResponse !== '(aucune réponse)'
                                                            ? participant.organizerResponse
                                                            : participant.requestMessage}
                                                    </p>
                                                </div>

                                                <div className="mt-6 text-center">
                                                    <p
                                                        className="text-etGray text-sm leading-relaxed transition-all duration-500 overflow-hidden mx-auto"
                                                        style={{ maxHeight: expandedBioIndex === index ? '1000px' : '65px', maxWidth: '90%' }}
                                                    >
                                                        {participant.user.bio || 'Aucune bio'}
                                                    </p>
                                                    {participant.user.bio && (
                                                        <button
                                                            onClick={() => handleToggleBio(index)}
                                                            className="text-etBlue hover:underline mt-4 text-sm"
                                                        >
                                                            {expandedBioIndex === index ? 'Masquer la bio' : 'En savoir plus'}
                                                        </button>
                                                    )}
                                                    {user && (user.id === participant.organizer.id || user.role === 'administrateur') && (
                                                        <button onClick={() => handleStatusChange(participant)} className="w-full mt-4 py-2 bg-etBlue text-white rounded-md hover:bg-blue-700">
                                                            Mettre à jour le statut
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="mt-4 text-center">
                                                    <button
                                                        onClick={() => handleToggleGuests(index)}
                                                        className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all"
                                                    >
                                                        {expandedGuestsIndex === index ? 'Masquer les invités' : 'Voir les invités'}
                                                    </button>

                                                    {expandedGuestsIndex === index && (
                                                        <div className="mt-4 animate__animated animate__fadeIn">
                                                            {participant.guests.length === 0 ? (
                                                                <p className="text-etGray text-sm">Aucun invité.</p>
                                                            ) : (
                                                                participant.guests.map((guest) => (
                                                                    <div key={guest.id} className="text-etGray text-sm py-2 border-b border-gray-200">
                                                                        <p><strong>{guest.firstname} {guest.lastname}</strong></p>
                                                                        <p>{guest.email}</p>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="*:-z-[1] *:absolute">
                        <h3 className="xl:hidden bottom-[120px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">
                            Participants
                        </h3>
                        <div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
                        <div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
                        <img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
                        <img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
                        <img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ParticipantPage;