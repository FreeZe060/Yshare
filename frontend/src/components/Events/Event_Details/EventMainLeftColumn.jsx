import React from 'react';
import { Link } from 'react-router-dom';
import CommentBlock from './CommentBlock';
import soiree from '../../../assets/img/soiree.jpg';

function EventMainLeftColumn({
    event,
    mainImageUrl,
    user,
    newComment,
    setNewComment,
    handleAddComment,
    handleApplyToEvent,
    participants,
    comments,
    eventId,
    API_BASE_URL,
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
                <span className="inline-block top-[20px] left-[20px] absolute bg-[#C320C0] px-[12px] py-[5px] rounded-[6px] font-normal text-[16px] text-white">Hall No: 59</span>
            </div>

            <div className="rev-slide-up">
                <h4 className="mt-[27px] mb-[11px] font-medium text-[30px] text-etBlack xs:text-[25px] xxs:text-[22px]">{event?.title}</h4>
                <p className="mb-[15px] font-light text-[16px] text-etGray">{event?.description}</p>

                {event?.EventImages?.filter(img => !img.is_main).length > 0 && (
                    <div className="gap-[30px] lg:gap-[20px] grid grid-cols-2 xxs:grid-cols-1 mt-[38px] mb-[33px]">
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
                    Nombre de participants : {participants?.length} / {event?.max_participants}
                </h3>
                {participants?.length === 0 ? (
                    <div className="bg-[#fdf5ff] p-[30px] border border-[#C320C0] border-dashed rounded-[12px] text-center animate-fade-in">
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
                            <img src={user?.profileImage ? `http://localhost:8080${user.profileImage}` : "https://assets.codepen.io/285131/hat-man.png"} className="rounded-full w-10 h-10 object-cover" alt="avatar" />
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