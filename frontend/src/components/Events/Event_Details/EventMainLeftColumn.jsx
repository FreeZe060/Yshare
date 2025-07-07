import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentBlock from '../../Comments/CommentBlock';
import soiree from '../../../assets/img/soiree.jpg';

function EventMainLeftColumn({
    event,
    mainImageUrl,
    user,
    comments,
    participants,
    eventId,
    newComment,
    setNewComment,
    handleAddComment,
    handleApplyToEvent,
    API_BASE_URL,
    handleUpload,
    handleDelete,
    handleSetMain,
    editing,
    newTitle,
    setNewTitle,
    newDescription,
    setNewDescription,
    handleCancelTitleDescription,
    newMaxParticipants,
    setNewMaxParticipants,
    originalMaxParticipants,
    isCreator,
    isAdmin,
    isParticipantRegistered,
    eventTermine,
    hasRated,
    Swal,
    onRateClick
}) {
    const participantCountClass = participants?.length >= event?.max_participants
        ? "text-red-600"
        : participants?.length >= event?.max_participants * 0.8
            ? "text-yellow-600"
            : "text-green-600";

    const displayedParticipants = participants?.slice(-4);

    return (
        <div className="left grow">
            <div className="relative rounded-[8px] overflow-hidden rev-slide-up">
                <img src={mainImageUrl || soiree} alt="event-details-img" className="bg-cover" />

                <span className="inline-block top-[20px] left-[20px] absolute bg-[#C320C0] px-[12px] py-[5px] rounded-[6px] font-normal text-[16px] text-white">
                    Hall No: 59
                </span>

                {editing && (
                    <>
                        <label className="bottom-2 left-2 absolute bg-[#D232BE] hover:bg-[#D232BE] px-3 py-1 rounded text-white text-sm cursor-pointer">
                            Modifier
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleUpload(e, event?.EventImages?.find(img => img.is_main)?.id)}
                                className="hidden"
                            />
                        </label>
                    </>
                )}
            </div>

            <div className="rev-slide-up">
                {editing ? (
                    <>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="px-3 py-2 border rounded-md w-full font-medium text-[22px] text-etBlack"
                            placeholder="Titre"
                        />
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="px-3 py-2 border rounded-md w-full text-[16px] text-etGray"
                            rows={3}
                            placeholder="Description"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelTitleDescription}
                                className="bg-gray-400 hover:bg-gray-500 px-4 py-1 rounded text-white"
                            >
                                Annuler
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-start gap-3">
                            <h4 className="font-medium text-[30px] text-etBlack xs:text-[25px] xxs:text-[22px]">{event?.title}</h4>
                        </div>
                        <p className="font-light text-[16px] text-etGray">{event?.description}</p>
                    </>
                )}

                {event?.EventImages?.length > 0 && (
                    <div className="gap-[30px] lg:gap-[20px] grid grid-cols-2 xxs:grid-cols-1 mt-[38px] mb-[33px]">
                        {event.EventImages.map((img, index) => (
                            <div key={index} className="group relative">
                                {editing && event.EventImages.length > 1 && (
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        className="top-2 right-2 absolute flex justify-center items-center bg-red-600 hover:bg-red-700 shadow rounded-full w-8 h-8 text-white"
                                        title="Supprimer l'image"
                                    >
                                        &times;
                                    </button>
                                )}

                                <img
                                    src={`${API_BASE_URL}${img.image_url}`}
                                    alt="event-img"
                                    className="rounded-[8px] w-full h-[306px] object-cover"
                                />

                                {editing && !img.is_main && (
                                    <button
                                        onClick={() => handleSetMain(img.id)}
                                        className="right-2 bottom-2 absolute bg-[#C320C0] hover:bg-[#a51899] px-3 py-1 rounded text-white text-sm"
                                    >
                                        Définir comme principale
                                    </button>
                                )}

                                {editing && (
                                    <label className="bottom-2 left-2 absolute bg-[#D232BE] hover:bg-[#D232BE] px-3 py-1 rounded text-white text-sm cursor-pointer">
                                        Modifier
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleUpload(e, img.id)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        ))}

                        {editing && (
                            <label className="flex justify-center items-center hover:bg-[#f9e6f9] border-[#C320C0] border-2 border-dashed rounded-[8px] w-full h-[306px] transition cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleUpload(e)}
                                    className="hidden"
                                />
                                <span className="font-semibold text-[#C320C0] text-[24px]">+</span>
                            </label>
                        )}
                    </div>
                )}
            </div>

            <div className="flex xxs:flex-col items-center gap-[20px] py-[24px] border-[#d9d9d9] border-y rev-slide-up">
                <button
                    onClick={handleApplyToEvent}
                    className="inline-flex items-center gap-[10px] bg-[#C320C0] hover:bg-white px-[20px] border-[#C320C0] border-2 rounded-full h-[50px] font-medium text-[17px] text-white hover:text-[#C320C0] transition-all duration-300"
                >
                    Candidater maintenant
                    <i className="fa-arrow-right-long fa-solid" />
                </button>
            </div>

            <div className="mt-[50px] animate-fade-in">
                <h3 className="mb-[30px] xs:mb-[15px] font-semibold text-[30px] text-etBlack xs:text-[25px] anim-text">
                    Liste des participants à l’événement
                </h3>
                <h3 className={`mb-[10px] font-semibold text-[20px] ${participantCountClass}`}>
                    Nombre de participants : {participants?.length}
                    {editing ? (
                        <>
                            <input
                                type="number"
                                min="1"
                                value={newMaxParticipants}
                                onChange={(e) => setNewMaxParticipants(parseInt(e.target.value))}
                                className="px-2 py-1 border rounded w-20"
                            />
                            <button
                                onClick={() => setNewMaxParticipants(originalMaxParticipants)}
                                className="ml-2 text-gray-500 text-sm underline"
                            >
                                Annuler
                            </button>
                        </>
                    ) : (
                        event?.max_participants === 0 ? (
                            ""
                        ) : (
                            <span className="text-etGray2">{" "} / {event?.max_participants}</span>
                        )
                    )}
                </h3>
                {participants?.length === 0 ? (
                    <div className="bg-[#fdf5ff] mb-6 p-[30px] border border-[#C320C0] border-dashed rounded-[12px] text-center animate-fade-in">
                        {eventTermine ? (
                            isCreator ? (
                                <>
                                    <h4 className="mb-[10px] font-bold text-[#C320C0] text-[24px]">
                                        Votre événement est maintenant terminé
                                    </h4>
                                    <p className="mb-[10px] text-[16px] text-etGray animate-slide-up">
                                        N'hésitez pas à en créer un autre ici.
                                    </p>
                                    <Link
                                        to="/event/create"
                                        className="inline-block bg-[#C320C0] hover:bg-[#a51899] shadow-lg mt-[20px] px-[24px] py-[12px] rounded-full font-medium text-[16px] text-white transition-all animate-pulse duration-300"
                                    >
                                        Créer un nouvel événement
                                    </Link>
                                </>
                            ) : isAdmin ? (
                                <>
                                    <h4 className="mb-[10px] font-bold text-[#C320C0] text-[24px]">
                                        Cet événement est maintenant terminé
                                    </h4>
                                    <p className="mb-[10px] text-[16px] text-etGray animate-slide-up">
                                        Vous pouvez consulter l'ensemble des participants ici.
                                    </p>
                                    <Link
                                        to={`/event/${event?.id}/participants`}
                                        className="inline-block bg-[#C320C0] hover:bg-[#a51899] shadow px-[24px] py-[12px] rounded-full font-medium text-[16px] text-white transition-all duration-300"
                                    >
                                        Voir tous les participants
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <h4 className="mb-[10px] font-bold text-[#C320C0] text-[24px]">
                                        Cet événement est maintenant terminé
                                    </h4>
                                    <p className="mb-[10px] text-[16px] text-etGray animate-slide-up">
                                        Vous ne pouvez plus postuler.
                                    </p>
                                </>
                            )
                        ) : isCreator ? (
                            <>
                                <h4 className="mb-[10px] font-bold text-[#C320C0] text-[24px]">
                                    Vous n'avez pas encore de participants
                                </h4>
                                <p className="mb-[10px] text-[16px] text-etGray animate-slide-up">
                                    N'hésitez pas à créer une news pour mettre en avant votre événement.
                                </p>
                                <Link
                                    to="/news/create"
                                    className="inline-block bg-[#C320C0] hover:bg-[#a51899] shadow-lg mt-[20px] px-[24px] py-[12px] rounded-full font-medium text-[16px] text-white transition-all animate-pulse duration-300"
                                >
                                    Créer une news
                                </Link>
                            </>
                        ) : isAdmin ? (
                            <>
                                <h4 className="mb-[10px] font-bold text-[#C320C0] text-[24px]">
                                    Cet événement n'a pour l'instant pas encore de participants
                                </h4>
                                <p className="mb-[10px] text-[16px] text-etGray animate-slide-up">
                                    Si vous souhaitez y participer, vous pouvez postuler ici.
                                </p>
                                <a
                                    onClick={handleApplyToEvent}
                                    href="#"
                                    className="inline-block bg-[#C320C0] hover:bg-[#a51899] shadow-lg mt-[20px] px-[24px] py-[12px] rounded-full font-medium text-[16px] text-white transition-all animate-pulse duration-300"
                                >
                                    Postuler maintenant
                                </a>
                            </>
                        ) : (
                            <>
                                <h4 className="mb-[10px] font-bold text-[#C320C0] text-[24px] animate-bounce">
                                    Aucun participant n'est encore inscrit
                                </h4>
                                <p className="mb-[10px] text-[16px] text-etGray animate-slide-up">
                                    Soyez le premier à rejoindre cette aventure !
                                </p>
                                <a
                                    onClick={handleApplyToEvent}
                                    href="#"
                                    className="inline-block bg-[#C320C0] hover:bg-[#a51899] shadow-lg mt-[20px] px-[24px] py-[12px] rounded-full font-medium text-[16px] text-white transition-all animate-pulse duration-300"
                                >
                                    Candidater maintenant
                                </a>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        {eventTermine && !isAdmin && !isCreator && (
                            <div className="bg-[#fdf5ff] mb-6 p-[30px] border border-[#C320C0] border-dashed rounded-[12px] text-center animate-fade-in">
                                <h4 className="mb-[10px] font-bold text-[#C320C0] text-[24px]">
                                    Cet événement est maintenant terminé
                                </h4>

                                {!isParticipantRegistered && (
                                    <p className="mb-[10px] text-[16px] text-etGray animate-slide-up">
                                        Vous ne pouvez plus postuler.
                                    </p>
                                )}

                                {isParticipantRegistered && (
                                    hasRated ? (
                                        <>
                                            <p className="mb-[10px] text-[16px] text-etGray animate-slide-up">
                                                Vous pouvez consulter votre note ici.
                                            </p>
                                            <Link
                                                to={`/users/${user?.id}/ratings`}
                                                className="inline-block bg-[#C320C0] hover:bg-[#a51899] shadow mt-[10px] px-[24px] py-[12px] rounded-full font-medium text-[16px] text-white transition-all duration-300"
                                            >
                                                Voir ma note
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <p className="mb-[10px] text-[16px] text-etGray animate-slide-up">
                                                N'hésitez pas à noter l'événement.
                                            </p>
                                            <button
                                                onClick={onRateClick}
                                                className="inline-block bg-[#C320C0] hover:bg-[#a51899] shadow mt-[10px] px-[24px] py-[12px] rounded-full font-medium text-[16px] text-white transition-all duration-300"
                                            >
                                                Noter l'événement
                                            </button>
                                        </>
                                    )
                                )}
                            </div>
                        )}

                        {eventTermine && isCreator && (
                            <div className="bg-[#fdf5ff] mb-6 p-[30px] border border-[#C320C0] border-dashed rounded-[12px] text-center animate-fade-in">
                                <h4 className="mb-[10px] font-bold text-[#C320C0] text-[24px]">
                                    Votre événement est maintenant terminé
                                </h4>
                                <p className="mb-[10px] text-[16px] text-etGray animate-slide-up">
                                    N'hésitez pas à en créer un autre ici.
                                </p>
                                <Link
                                    to="/events/create"
                                    className="inline-block bg-[#C320C0] hover:bg-[#a51899] shadow-lg mt-[20px] px-[24px] py-[12px] rounded-full font-medium text-[16px] text-white transition-all animate-pulse duration-300"
                                >
                                    Créer un nouvel événement
                                </Link>

                                {participants?.length > 0 && (
                                    <>
                                        <p className="mt-4 mb-[10px] text-[16px] text-etGray animate-slide-up">
                                            Vous pouvez consulter l'ensemble des participants ayant rejoint votre événement ici.
                                        </p>
                                        <Link
                                            to={`/event/${event?.id}/participants`}
                                            className="inline-block bg-[#C320C0] hover:bg-[#a51899] shadow px-[24px] py-[12px] rounded-full font-medium text-[16px] text-white transition-all duration-300"
                                        >
                                            Voir tous les participants
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}

                        {eventTermine && isAdmin && participants?.length > 0 && (
                            <div className="bg-[#fdf5ff] mb-6 p-[30px] border border-[#C320C0] border-dashed rounded-[12px] text-center animate-fade-in">
                                <h4 className="mb-[10px] font-bold text-[#C320C0] text-[24px]">
                                    Cet événement est maintenant terminé
                                </h4>
                                <p className="mb-[10px] text-[16px] text-etGray animate-slide-up">
                                    Vous pouvez consulter l'ensemble des participants ici.
                                </p>
                                <Link
                                    to={`/event/${event?.id}/participants`}
                                    className="inline-block bg-[#C320C0] hover:bg-[#a51899] shadow px-[24px] py-[12px] rounded-full font-medium text-[16px] text-white transition-all duration-300"
                                >
                                    Voir tous les participants
                                </Link>

                                {isParticipantRegistered && (
                                    <p className="mt-4 text-[16px] text-etGray animate-slide-up">
                                        N'hésitez pas à noter cet événement.
                                    </p>
                                )}
                            </div>
                        )}

                        {displayedParticipants.map((participant, index) => {
                            const user = participant?.user;
                            if (!user) return null;
                            return (
                                <div
                                    key={participant.participantId}
                                    className="flex xs:flex-col gap-x-[25px] gap-y-[10px] mb-[30px] p-[30px] lg:p-[20px] border border-[#d9d9d9] rounded-[12px]"
                                >
                                    <div className="rounded-[6px] overflow-hidden shrink-0">
                                        <Link to={`/profile/${user.id}`}>
                                            <img
                                                src={`${API_BASE_URL}${user.profileImage || '/default-profile.jpg'}`}
                                                alt="Participant"
                                                className="w-[168px] object-cover aspect-square"
                                            />
                                        </Link>
                                    </div>
                                    <div className="grow">
                                        <div className="flex flex-wrap justify-between items-center gap-[10px] pb-[15px] border-[#d9d9d9] border-b">
                                            <div>
                                                <Link to={`/profile/${user.id}`}>
                                                    <h5 className="font-semibold text-[20px] text-etBlack">
                                                        {user.name} {user.lastname}
                                                    </h5>
                                                </Link>
                                                <span className="inline-block text-[16px] text-etGray2">{user.email}</span>
                                            </div>
                                            <span className="inline-block bg-green-100 px-[12px] py-[4px] rounded-full font-medium text-green-700 text-sm">
                                                {participant.status}
                                            </span>
                                        </div>
                                        <p className="pt-[20px] font-light text-[16px] text-etGray2">
                                            {user.bio || "Aucune biographie fournie."}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {participants?.length > 4 && (
                            <div className="mt-[10px] text-center">
                                <Link
                                    to={`/event/${event?.id}/participants`}
                                    className="inline-block bg-[#C320C0] hover:bg-[#a51899] shadow px-[24px] py-[12px] rounded-full font-medium text-[16px] text-white transition-all duration-300"
                                >
                                    Voir tous les participants
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-[60px] animate-fade-in">
                <h3 className="mb-[30px] font-semibold text-[30px] text-etBlack">Commentaires</h3>
                <div className="space-y-[20px] bg-white shadow-lg p-[30px] border border-[#f0f0f0] rounded-[16px]">
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <img src={user?.profileImage ? `${API_BASE_URL}${user.profileImage}` : "https://assets.codepen.io/285131/hat-man.png"} className="rounded-full w-10 h-10 object-cover" alt="avatar" />
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (!user) {
                                        Swal.fire('Vous devez être connecté pour écrire un commentaire.');
                                        e.preventDefault();
                                        return;
                                    }
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddComment();
                                    }
                                }}
                                placeholder={user ? "Ajouter un commentaire..." : "Connectez-vous pour commenter"}
                                className={`flex-1 h-12 px-4 rounded-md border placeholder-gray-400 ${!user ? "cursor-not-allowed bg-gray-100 text-gray-400" : "border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
                                    }`}
                                disabled={!user}
                                title={!user ? "Vous devez être connecté pour commenter" : ""}
                            />
                        </div>

                        {comments?.map((comment) => (
                            <CommentBlock key={comment.id} comment={comment} eventId={eventId} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventMainLeftColumn;