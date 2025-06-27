import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentBlock from '../Event_Details/CommentBlock';
import soiree from '../../assets/img/soiree.jpg';

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
    refetchEvent,
    editing,
    setEditing,
    newTitle,
    setNewTitle,
    newDescription,
    setNewDescription,
    handleCancelTitleDescription,
    newMaxParticipants,
    setNewMaxParticipants,
    originalMaxParticipants,
}) {

    const [isEditingBasics, setIsEditingBasics] = useState(false);
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
                        <label className="absolute bottom-2 left-2 px-3 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
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
                            className="w-full px-3 py-2 border rounded-md font-medium text-[22px] text-etBlack"
                            placeholder="Titre"
                        />
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-[16px] text-etGray"
                            rows={3}
                            placeholder="Description"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelTitleDescription}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
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
                            <div key={index} className="relative group">
                                {editing && event.EventImages.length > 1 && (
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-red-700"
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
                                        className="absolute bottom-2 right-2 px-3 py-1 text-sm bg-[#C320C0] text-white rounded hover:bg-[#a51899]"
                                    >
                                        Définir comme principale
                                    </button>
                                )}

                                {editing && (
                                    <label className="absolute bottom-2 left-2 px-3 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
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
                            <label className="rounded-[8px] w-full h-[306px] flex items-center justify-center border-2 border-dashed border-[#C320C0] cursor-pointer hover:bg-[#f9e6f9] transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleUpload(e)}
                                    className="hidden"
                                />
                                <span className="text-[#C320C0] font-semibold text-[24px]">+</span>
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
                    Nombre de participants : {participants?.length} / {' '}
                    {editing ? (
                        <>
                            <input
                                type="number"
                                min="1"
                                value={newMaxParticipants}
                                onChange={(e) => setNewMaxParticipants(parseInt(e.target.value))}
                                className="border rounded px-2 py-1 w-20"
                            />
                            <button
                                onClick={() => setNewMaxParticipants(originalMaxParticipants)}
                                className="ml-2 text-sm text-gray-500 underline"
                            >
                                Annuler
                            </button>
                        </>
                    ) : (
                        event?.max_participants
                    )}
                </h3>
                {participants?.length === 0 ? (
                    <div className="text-center p-[30px] border border-dashed border-[#C320C0] rounded-[12px] bg-[#fdf5ff] animate-fade-in">
                        <h4 className="text-[24px] font-bold text-[#C320C0] mb-[10px] animate-bounce">
                            Aucun participant n'est encore inscrit
                        </h4>
                        <p className="text-[16px] text-etGray mb-[10px] animate-slide-up">
                            Soyez le premier à rejoindre cette aventure !
                        </p>
                        <a
                            onClick={handleApplyToEvent}
                            href="#"
                            className="inline-block mt-[20px] px-[24px] py-[12px] text-white bg-[#C320C0] hover:bg-[#a51899] transition-all duration-300 rounded-full text-[16px] font-medium shadow-lg animate-pulse"
                        >
                            Candidater maintenant
                        </a>
                    </div>
                ) : (
                    <>
                        {displayedParticipants.map((participant, index) => {
                            const user = participant?.user;
                            console.log("Participants reçus :", participants);
                            if (!user) return null;
                            return (
                                <div
                                    key={participant.participantId}
                                    className="flex xs:flex-col gap-x-[25px] gap-y-[10px] mb-[30px] p-[30px] lg:p-[20px] border border-[#d9d9d9] rounded-[12px]"
                                >
                                    <div className="rounded-[6px] overflow-hidden shrink-0">
                                        <Link to={`/profile/${user.id}`}>
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
                                                <Link to={`/profile/${user.id}`}>
                                                    <h5 className="font-semibold text-[20px] text-etBlack">
                                                        {user.name} {user.lastname}
                                                    </h5>
                                                </Link>
                                                <span className="inline-block text-[16px] text-etGray2">{user.email}</span>
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
                        })}
                        {participants?.length > 4 && (
                            <div className="text-center mt-[10px]">
                                <Link
                                    to={`/event/${event?.id}/participants`}
                                    className="inline-block px-[24px] py-[12px] text-white bg-[#C320C0] hover:bg-[#a51899] transition-all duration-300 rounded-full text-[16px] font-medium shadow"
                                >
                                    Voir tous les participants
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-[60px] animate-fade-in">
                <h3 className="mb-[30px] text-[30px] font-semibold text-etBlack">Commentaires</h3>
                <div className="rounded-[16px] border border-[#f0f0f0] shadow-lg p-[30px] bg-white space-y-[20px]">
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <img src={user?.profileImage ? `http://localhost:8080${user.profileImage}` : "https://assets.codepen.io/285131/hat-man.png"} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
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
                                className={`flex-1 h-12 px-4 rounded-md border border-gray-200 placeholder-gray-400 ${user ? "focus:outline-none focus:ring-2 focus:ring-gray-100" : "cursor-not-allowed bg-gray-100"}`}
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
    );
}

export default EventMainLeftColumn;