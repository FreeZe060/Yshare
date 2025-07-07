import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { AnimatePresence, motion } from "framer-motion";
import EventStatusTag from '../Events/EventStatusTag';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

function NewsDetailsLeft({
    newsDetails,
    isOwner,
    isAdmin,
    isEditing,
    setIsEditing,
    setEditedTitle,
    setEditedContent,
    editedTitle,
    editedContent,
    handleSave,
    day,
    month,
    newsId,
    editorRef,
    availableCategories,
    setShowAddCat,
    removeCategoryFromNews,
    addCategoryToNews,
    showAddCat,
    getCategoryStyle,
    handleImageUpload,
    link,
    linking,
    linkError
}) {

    const [showSelect, setShowSelect] = useState(false);
    const userEvents = newsDetails.User?.Events || [];

    const handleLink = async (eventId) => {
        if (!eventId) return;

        try {
            await link(newsId, eventId);
            Swal.fire("Succès", "Événement lié/modifié avec succès", "success");
            window.location.reload();
        } catch (err) {
            Swal.fire("Erreur", err.message || "Erreur lors de la liaison", "error");
        }
    };

    return (
        <div class="left space-y-[40px] md:space-y-[30px] grow">
            <div>
                <div className="relative mb-[30px] rounded-[8px] overflow-hidden img">
                    <img src={`${API_BASE_URL}${newsDetails.image_url}`} alt="news-cover" className="mx-auto w-full max-h-[400px] object-cover" />
                    {(isOwner || isAdmin) && (
                        <div className="top-[20px] right-[20px] absolute">
                            <label htmlFor="imageUpload" className="bg-white hover:bg-[#CE22BF] shadow px-3 py-1 rounded text-[#CE22BF] hover:text-white text-sm transition cursor-pointer">
                                <i className="mr-1 fas fa-image" /> Modifier l’image
                            </label>
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                    )}
                    <div className="top-[20px] left-[20px] absolute bg-[#CE22BF] px-[20px] py-[13px] rounded-[6px] text-white">
                        <span className="block mb-[6px] font-medium text-[24px] leading-[0.7]">{day}</span>
                        <span className="block font-medium text-[12px] leading-[0.7]">{month}</span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-[30px] mb-[7px]">
                        <div className="flex items-center gap-[10px] text-[14px] text-etGray">
                            <span>Par</span>
                            <a href={`/profile/${newsDetails.User?.id}`} className="flex items-center gap-[6px] hover:text-[#CE22BF] transition">
                                <img
                                    src={`${API_BASE_URL}${newsDetails.User?.profile_image}`}
                                    alt="user"
                                    className="border border-gray-300 rounded-full w-[28px] h-[28px] object-cover"
                                />
                                {newsDetails.User?.name} {newsDetails.User?.lastname}
                            </a>
                        </div>

                        {newsDetails?.categories?.map((cat, idx) => (
                            <span
                                key={idx}
                                className={`text-[14px] font-medium px-[10px] py-[4px] rounded-full capitalize ${getCategoryStyle(cat.name)}`}
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>

                    <AnimatePresence>
                        {(isOwner || isAdmin) && isEditing && (
                            <motion.form
                                key="edit-form"
                                ref={editorRef}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSave();
                                }}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-3"
                            >
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded w-full font-medium text-[20px] text-etBlack"
                                    placeholder="Titre"
                                />
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded w-full text-[16px] text-etGray"
                                    rows={5}
                                    placeholder="Contenu"
                                />

                                <div className="flex gap-2 mt-2">
                                    <motion.button
                                        type="submit"
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 shadow px-4 py-2 rounded text-white transition"
                                    >
                                        <i className="fas fa-check"></i> Enregistrer
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 shadow px-4 py-2 rounded text-white transition"
                                    >
                                        <i className="fas fa-times"></i> Annuler
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {!isEditing && (
                        <>
                            <h3 className="mb-[21px] font-medium text-[30px] text-etBlack">{newsDetails.title}</h3>
                            <p className="mb-[16px] font-light text-[16px] text-etGray">{newsDetails.content}</p>
                        </>
                    )}

                    {(isOwner || isAdmin) && !isEditing && (
                        <motion.button
                            onClick={() => {
                                setEditedTitle(newsDetails.title);
                                setEditedContent(newsDetails.content);
                                setIsEditing(true);
                            }}
                            whileHover={{ scale: 1.1 }}
                            className="mb-2 font-medium text-[#CE22BF] text-sm hover:underline"
                        >
                            <i className="mr-1 fas fa-pen"></i> Modifier la news
                        </motion.button>
                    )}
                </div>
            </div>

            <div className="flex xs:flex-col justify-between items-center xs:items-start gap-[20px] py-[24px] border-[#d9d9d9] border-y">
                <div className="flex items-start gap-[28px]">
                    <div className="flex flex-wrap gap-[13px]">
                        {newsDetails?.categories?.map((cat) => (
                            <div
                                key={cat.id}
                                className={`relative border border-[#e5e5e5] text-[14px] text-[#181818] px-[12px] py-[5px] rounded-[4px] hover:bg-[#CE22BF] hover:border-[#CE22BF] hover:text-white transition-all duration-300`}
                            >
                                {cat.name}
                                {(isOwner || isAdmin) && (
                                    <button
                                        className="top-[-6px] right-[-6px] absolute flex justify-center items-center bg-red-600 hover:bg-red-700 shadow-md rounded-full w-[18px] h-[18px] text-white text-xs transition"
                                        onClick={async () => {
                                            const result = await Swal.fire({
                                                title: 'Supprimer cette catégorie ?',
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonText: 'Oui, supprimer',
                                                cancelButtonText: 'Annuler',
                                            });

                                            if (result.isConfirmed) {
                                                await removeCategoryFromNews(newsId, cat.id);
                                                setShowAddCat(false);
                                                window.location.reload();
                                            }
                                        }}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {(isOwner || isAdmin) && (
                        <motion.button
                            onClick={() => setShowAddCat(prev => !prev)}
                            initial={false}
                            animate={{ rotate: showAddCat ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 180, damping: 16 }}
                            className="flex justify-center items-center hover:bg-[#CE22BF] border border-[#CE22BF] rounded-[4px] w-[36px] h-[36px] text-[#CE22BF] text-[18px] hover:text-white transition-all duration-300"
                        >
                            <AnimatePresence mode="wait">
                                <motion.i
                                    key={showAddCat ? 'close' : 'plus'}
                                    className={`fas ${showAddCat ? 'fa-times' : 'fa-plus'}`}
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.6 }}
                                    transition={{ duration: 0.35 }}
                                />
                            </AnimatePresence>
                        </motion.button>
                    )}

                    <AnimatePresence>
                        {showAddCat && (
                            <motion.div
                                key="add-cat"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-wrap gap-[13px]"
                            >
                                {availableCategories.map(cat => (
                                    <div
                                        key={cat.id}
                                        onClick={async () => {
                                            await addCategoryToNews(newsId, cat.id);
                                            setShowAddCat(false);
                                            window.location.reload();
                                        }}
                                        className={`cursor-pointer border border-[#e5e5e5] px-[12px] py-[5px] rounded-[4px] text-[14px] hover:bg-[#CE22BF] hover:text-white ${getCategoryStyle(cat.name)} transition-all duration-300`}
                                    >
                                        {cat.name}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-[28px]">
                    <h6 className="font-medium text-[16px] text-etBlack">Partager :</h6>
                    <div className="flex gap-[15px] text-[16px]">
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#757277] hover:text-[#CE22BF]"
                        >
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(newsDetails.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#757277] hover:text-[#CE22BF]"
                        >
                            <i className="fa-brands fa-twitter"></i>
                        </a>
                        <a
                            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(newsDetails.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#757277] hover:text-[#CE22BF]"
                        >
                            <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                        <a
                            href={`https://www.youtube.com/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#757277] hover:text-[#CE22BF]"
                        >
                            <i className="fa-brands fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>

            {!newsDetails.Event ? (
                <div>
                    <p className="mb-2 text-gray-600 text-sm">
                        Vous n’avez pas encore relié d’événement à cette actualité. Vous pouvez en lier un ci-dessous :
                    </p>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded"
                        onChange={(e) => handleLink(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Sélectionnez un événement</option>
                        {userEvents.map(event => (
                            <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <div id="et-event-tab1" className="et-tab active">
                    <h2 className="mb-[20px] pl-[12px] border-[#CE22BF] border-l-4 font-semibold text-[28px] text-etBlack sm:text-[24px]">
                        Événement lié à l'actualités
                    </h2>
                    <div className="space-y-[20px] all-scheduled-events">
                        <div
                            key={newsDetails.Event.id}
                            className="flex md:flex-wrap justify-between sm:justify-center gap-x-[20px] gap-y-[15px] rounded-[15px] et-schedule"
                        >
                            <div className="shadow-md rounded-[15px] w-[220px] h-[182px] overflow-hidden">
                                <img
                                    src={`${API_BASE_URL}${newsDetails.Event.EventImages?.[0]?.image_url || '/default-event.jpg'}`}
                                    alt="event cover"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex xs:flex-col items-center gap-y-[10px] bg-white shadow-md hover:shadow-lg px-[20px] sm:px-[15px] py-[20px] rounded-[15px] w-full transition duration-300">
                                <div className="mr-[25px] xs:mr-0 sm:mr-[15px] pr-[25px] xs:pr-0 sm:pr-[15px] border-[#d9d9d9] border-r xs:border-r-0 min-w-[450px] sm:min-w-0 et-schedule__heading">
                                    <div className="inline-flex items-center gap-x-[12px] gap-y-[6px] bg-gray-50 mb-[8px] px-[10px] py-[5px] border border-gray-300 rounded-full text-sm animate-fade-in et-schedule-date-time">
                                        <div className="flex items-center gap-[6px] date">
                                            <span className="icon">📅</span>
                                            <span className="text-etGray">
                                                {new Date(newsDetails.Event.start_time).toLocaleDateString('fr-FR')} à {new Date(newsDetails.Event.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="mt-1 mb-1 font-medium text-[18px] text-etBlack sm:text-[16px] hover:text-[#CE22BF] leading-tight transition duration-300 et-schedule-title anim-text">
                                        <a href={`/event/${newsDetails.Event.id}`}>{newsDetails.Event.title}</a>
                                    </h3>

                                    <div className="flex items-center gap-[10px] text-[14px] text-etGray">
                                        <span className="font-semibold text-gray-500 text-xs">Organisé par :</span>
                                        <a
                                            href={`/profile/${newsDetails.User?.id}`}
                                            className="flex items-center gap-[6px] hover:text-[#CE22BF] transition"
                                        >
                                            <img
                                                src={`${API_BASE_URL}${newsDetails.User?.profile_image}`}
                                                alt="user"
                                                className="border border-gray-300 rounded-full w-[28px] h-[28px] object-cover"
                                            />
                                            <span className="text-sm">{newsDetails.User?.name} {newsDetails.User?.lastname}</span>
                                        </a>
                                    </div>

                                    <EventStatusTag
                                        status={newsDetails.Event.status}
                                        date={newsDetails.Event.start_time}
                                        eventId={newsDetails.Event.id}
                                    />
                                </div>

                                <div className="flex flex-col items-center gap-y-[10px]">
                                    <div className="flex items-center shrink-0">
                                        <a
                                            href={`/event/${newsDetails.Event.id}`}
                                            className="inline-flex justify-center items-center gap-x-2 hover:bg-[#CE22BF] px-4 border border-[#CE22BF] rounded-full h-[36px] text-[#CE22BF] hover:text-white text-sm transition et-btn"
                                        >
                                            Voir l’événement
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!showSelect && isOwner && (
                            <motion.button
                                onClick={() => setShowSelect(true)}
                                whileTap={{ scale: 0.95 }}
                                className="font-medium text-[#CE22BF] text-sm hover:underline"
                            >
                                <i className="mr-1 fas fa-pen"></i> Modifier l'événement lié
                            </motion.button>
                        )}

                        {showSelect && (
                            <div className="mt-2">
                                <p className="mb-1 text-gray-700 text-sm">Changer l'événement lié :</p>
                                <select
                                    className="px-3 py-2 border rounded w-full"
                                    defaultValue={newsDetails.Event?.id || ''}
                                    onChange={(e) => handleLink(e.target.value)}
                                >
                                    <option value="" disabled>Choisir un événement</option>
                                    {userEvents.map(evt => (
                                        <option key={evt.id} value={evt.id}>{evt.title}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsDetailsLeft;