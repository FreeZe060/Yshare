import React from 'react';
import Swal from 'sweetalert2';
import { AnimatePresence, motion } from "framer-motion";

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
    handleImageUpload
}) {
    return (
        <div class="left grow space-y-[40px] md:space-y-[30px]">
            <div>
                <div className="img overflow-hidden rounded-[8px] mb-[30px] relative">
                    <img src={`http://localhost:8080${newsDetails.image_url}`} alt="news-cover" className="w-full max-h-[400px] mx-auto object-cover" />
                    {(isOwner || isAdmin) && (
                        <div className="absolute top-[20px] right-[20px]">
                            <label htmlFor="imageUpload" className="cursor-pointer bg-white text-etBlue px-3 py-1 text-sm rounded shadow hover:bg-etBlue hover:text-white transition">
                                <i className="fas fa-image mr-1" /> Modifier l’image
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
                    <div className="bg-etBlue rounded-[6px] absolute top-[20px] left-[20px] text-white px-[20px] py-[13px]">
                        <span className="block text-[24px] font-medium leading-[0.7] mb-[6px]">{day}</span>
                        <span className="block text-[12px] font-medium leading-[0.7]">{month}</span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-[30px] mb-[7px]">
                        <div className="flex gap-[10px] items-center text-etGray text-[14px]">
                            <span>créateur</span>
                            <a href={`/profile/${newsDetails.User?.id}`} className="flex items-center gap-[6px] hover:text-etBlue transition">
                                <img
                                    src={`http://localhost:8080${newsDetails.User?.profile_image}`}
                                    alt="user"
                                    className="w-[28px] h-[28px] rounded-full object-cover border border-gray-300"
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
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-[20px] font-medium text-etBlack"
                                    placeholder="Titre"
                                />
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-[16px] text-etGray"
                                    rows={5}
                                    placeholder="Contenu"
                                />

                                <div className="flex gap-2 mt-2">
                                    <motion.button
                                        type="submit"
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow transition"
                                    >
                                        <i className="fas fa-check"></i> Enregistrer
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded shadow transition"
                                    >
                                        <i className="fas fa-times"></i> Annuler
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {!isEditing && (
                        <>
                            <h3 className="text-[30px] font-medium text-etBlack mb-[21px]">{newsDetails.title}</h3>
                            <p className="font-light text-[16px] text-etGray mb-[16px]">{newsDetails.content}</p>
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
                            className="mb-2 text-etBlue hover:underline text-sm font-medium"
                        >
                            <i className="fas fa-pen mr-1"></i> Modifier la news
                        </motion.button>
                    )}
                </div>
            </div>

            <div className="border-y border-[#d9d9d9] py-[24px] flex items-center justify-between xs:flex-col xs:items-start gap-[20px]">
                <div className="flex gap-[28px] items-start">
                    <h6 className="font-medium text-[16px] text-etBlack">Catégories :</h6>
                    <div className="flex flex-wrap gap-[13px]">
                        {newsDetails?.categories?.map((cat) => (
                            <div
                                key={cat.id}
                                className={`relative border border-[#e5e5e5] text-[14px] text-[#181818] px-[12px] py-[5px] rounded-[4px] hover:bg-etBlue hover:border-etBlue hover:text-white transition-all duration-300`}
                            >
                                {cat.name}
                                {(isOwner || isAdmin) && (
                                    <button
                                        className="absolute top-[-6px] right-[-6px] w-[18px] h-[18px] rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow-md hover:bg-red-700 transition"
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
                            className="w-[36px] h-[36px] flex items-center justify-center border border-etBlue text-etBlue rounded-[4px] text-[18px] hover:bg-etBlue hover:text-white transition-all duration-300"
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
                                        className={`cursor-pointer border border-[#e5e5e5] px-[12px] py-[5px] rounded-[4px] text-[14px] hover:bg-etBlue hover:text-white ${getCategoryStyle(cat.name)} transition-all duration-300`}
                                    >
                                        {cat.name}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex gap-[28px] items-center">
                    <h6 className="font-medium text-[16px] text-etBlack">Partager :</h6>
                    <div className="flex gap-[15px] text-[16px]">
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#757277] hover:text-etBlue"
                        >
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(newsDetails.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#757277] hover:text-etBlue"
                        >
                            <i className="fa-brands fa-twitter"></i>
                        </a>
                        <a
                            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(newsDetails.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#757277] hover:text-etBlue"
                        >
                            <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                        <a
                            href={`https://www.youtube.com/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#757277] hover:text-etBlue"
                        >
                            <i className="fa-brands fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>

            {newsDetails.Event && (
                <div id="et-event-tab1" className="et-tab active">
                    <h2 className="text-[28px] sm:text-[24px] font-semibold text-etBlack mb-[20px] border-l-4 border-etBlue pl-[12px]">
                        Événement lié à l'actualités
                    </h2>
                    <div className="all-scheduled-events space-y-[20px]">
                        <div
                            key={newsDetails.Event.id}
                            className="et-schedule flex md:flex-wrap gap-x-[20px] gap-y-[15px] justify-between sm:justify-center rounded-[15px]"
                        >
                            <div className="w-[220px] h-[182px] rounded-[15px] overflow-hidden shadow-md">
                                <img
                                    src={`http://localhost:8080${newsDetails.Event.EventImages?.[0]?.image_url || '/default-event.jpg'}`}
                                    alt="event cover"
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            <div className="px-[20px] sm:px-[15px] py-[20px] shadow-md w-full rounded-[15px] flex gap-y-[10px] xs:flex-col items-center bg-white transition duration-300 hover:shadow-lg">
                                <div className="et-schedule__heading pr-[25px] sm:pr-[15px] min-w-[450px] sm:min-w-0 xs:pr-0 mr-[25px] sm:mr-[15px] xs:mr-0 border-r xs:border-r-0 border-[#d9d9d9]">
                                    <div className="et-schedule-date-time border border-gray-300 py-[5px] px-[10px] rounded-full inline-flex items-center gap-x-[12px] gap-y-[6px] mb-[8px] text-sm bg-gray-50 animate-fade-in">
                                        <div className="date flex items-center gap-[6px]">
                                            <span className="icon">📅</span>
                                            <span className="text-etGray">
                                                {new Date(newsDetails.Event.start_time).toLocaleDateString('fr-FR')} à {new Date(newsDetails.Event.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="et-schedule-title text-[18px] sm:text-[16px] font-medium text-etBlack leading-tight mb-1 mt-1 anim-text transition duration-300 hover:text-etBlue">
                                        <a href={`/event/${newsDetails.Event.id}`}>{newsDetails.Event.title}</a>
                                    </h3>

                                    <div className="flex items-center gap-[10px] text-etGray text-[14px]">
                                        <span className="text-xs text-gray-500 font-semibold">Organisé par :</span>
                                        <a
                                            href={`/profile/${newsDetails.User?.id}`}
                                            className="flex items-center gap-[6px] hover:text-etBlue transition"
                                        >
                                            <img
                                                src={`http://localhost:8080${newsDetails.User?.profile_image}`}
                                                alt="user"
                                                className="w-[28px] h-[28px] rounded-full object-cover border border-gray-300"
                                            />
                                            <span className="text-sm">{newsDetails.User?.name} {newsDetails.User?.lastname}</span>
                                        </a>
                                    </div>

                                    <div
                                        className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2
                                                            ${newsDetails.Event.status === 'Planifié' ? 'bg-blue-100 text-blue-700' : ''}
                                                            ${newsDetails.Event.status === 'En Cours' ? 'bg-green-100 text-green-700' : ''}
                                                            ${newsDetails.Event.status === 'Terminé' ? 'bg-gray-200 text-gray-700' : ''}
                                                            ${newsDetails.Event.status === 'Annulé' ? 'bg-red-100 text-red-700' : ''}
                                                            `}
                                    >
                                        {newsDetails.Event.status || 'Planifié'}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-y-[10px] items-center">
                                    <div className="flex shrink-0 items-center">
                                        <a
                                            href={`/event/${newsDetails.Event.id}`}
                                            className="et-btn border border-etBlue text-etBlue inline-flex items-center justify-center gap-x-2 h-[36px] px-4 text-sm rounded-full transition hover:bg-etBlue hover:text-white"
                                        >
                                            Voir l’événement
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default NewsDetailsLeft;