import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import useNotifications from '../hooks/Notification/useNotifications';
import useMarkNotificationAsRead from '../hooks/Notification/useMarkNotificationAsRead';
import useMarkAllNotificationsAsRead from '../hooks/Notification/useMarkAllNotificationsAsRead';
import useMarkNotificationAsUnread from '../hooks/Notification/useMarkNotificationAsUnread';


dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale('fr');
dayjs.extend(utc);

const formatDateLabel = (date) => {
    const createdAt = dayjs.utc(date);
    const now = dayjs.utc();

    const diffInMinutes = now.diff(createdAt, 'minute');
    const diffInHours = now.diff(createdAt, 'hour');
    const diffInDays = now.diff(createdAt, 'day');
    const diffInWeeks = now.diff(createdAt, 'week');
    const diffInMonths = now.diff(createdAt, 'month');
    const diffInYears = now.diff(createdAt, 'year');

    if (diffInMinutes < 1) {
        return "À l’instant";
    } else if (diffInMinutes < 60) {
        return `Il y a ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
        return `Il y a ${diffInHours} h`;
    } else if (diffInDays < 7) {
        return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInWeeks < 5) {
        return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
    } else if (diffInMonths < 12) {
        return `Il y a ${diffInMonths} mois`;
    } else {
        return createdAt.local().format('D MMM YYYY');
    }
};

const NotificationSidebar = ({ notifications, setNotifications, isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const { loading } = useNotifications();
    const { markAsRead } = useMarkNotificationAsRead();
    const { markAsUnread } = useMarkNotificationAsUnread();
    const { markAllAsRead, updateLocalNotifications } = useMarkAllNotificationsAsRead();

    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [localNotifications, setLocalNotifications] = useState([]);

    const panelRef = useRef(null);

    useEffect(() => {
        if (notifications) setLocalNotifications(notifications);
    }, [notifications]);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen, setIsOpen]);

    const toggleReadStatus = async (notif) => {
        try {
            if (notif.read_status) {
                await markAsUnread(notif.id);
            } else {
                await markAsRead(notif.id);
            }

            const updated = notifications.map(n =>
                n.id === notif.id ? { ...n, read_status: !n.read_status } : n
            );
            setNotifications(updated);
            setLocalNotifications(updated);
        } catch (err) {
            console.error("Erreur en changeant le statut lu/non lu", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            const updated = notifications.map(n => ({ ...n, read_status: true }));
            setNotifications(updated);
            setLocalNotifications(updated);
        } catch (err) {
            console.error("Erreur lors de marquer tout comme lu", err);
        }
    };

    if (!shouldRender || loading) return null;

    const filteredNotifications = showAll ? localNotifications : localNotifications.filter(n => !n.read_status);

    return (
        <>
            <div className="top-0 right-0 z-50 fixed w-full h-screen mt-[128px] overflow-x-hidden overflow-y-auto">
                <div
                    className={`
                        w-full absolute z-5 right-0 h-full transform transition-transform duration-500 ease-in-out
                        ${isVisible ? 'translate-x-0' : 'translate-x-full'}
                    `}
                >
                    <div ref={panelRef} className="right-0 absolute rounded-xl bg-gray-900 p-8 md:w-full w-[600px] h-screen overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <p
                                tabIndex="0"
                                className="focus:outline-none font-semibold text-gray-200 text-2xl leading-6"
                            >
                                Notifications
                            </p>
                            <label className="flex gap-2 min-w-36 mcui-checkbox">
                                <input type="checkbox" checked={showAll} onChange={() => setShowAll(!showAll)} />
                                <div>
                                    <svg className="mcui-check" viewBox="-2 -2 35 35" aria-hidden="true">
                                        <polyline points="7.57 15.87 12.62 21.07 23.43 9.93" />
                                    </svg>
                                </div>
                                <span className="text-gray-300 text-lg">Afficher les Notifications non lues</span>
                            </label>
                            <button
                                aria-label="close modal"
                                onClick={() => setIsOpen(false)}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M18 6L6 18"
                                        stroke="#ffffff"
                                        strokeWidth="1.25"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M6 6L18 18"
                                        stroke="#ffffff"
                                        strokeWidth="1.25"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>

                        {filteredNotifications.map((notif, idx) => (
                            <div key={notif.id} className={`flex flex-col gap-1 mt-4 w-full transition-all duration-300 ease-in-out cursor-pointer`}>
                                <div className={`flex justify-between gap-2 p-3 rounded-md ${notif.read_status ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-700 hover:bg-gray-600'} transition-all duration-300`}>
                                    <div className="flex-grow">
                                        <p className="focus:outline-none text-white text-sm leading-snug">
                                            <span className="font-semibold text-orange-500">Notification</span> {notif.title} - {notif.message}
                                        </p>
                                        <p className="pt-1 text-gray-200 text-xs leading-3">
                                            {formatDateLabel(notif.date_sent)}
                                        </p>
                                    </div>
                                    <div className="flex flex-shrink-0 justify-center items-center">
                                        <button className="group bg-orange-700 px-2 py-1 rounded transition-all duration-300 ease-in-out"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleReadStatus(notif);
                                            }}
                                        >
                                            <i className={`fa-solid ${!notif.read_status ? 'fa-envelope text-orange-100 animate-[wiggle_1s_ease-in-out_infinite]' : 'fa-envelope-open text-orange-300 group-hover:text-orange-100'} transition-all duration-300 ease-in-out`}></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredNotifications.length > 0 && (
                            <div className="mt-6 text-center">
                                <button
                                    className="bg-orange-600 px-4 py-2 rounded text-sm hover:bg-orange-500"
                                    onClick={handleMarkAllAsRead}
                                >
                                    Tout marquer comme lu
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-10">
                            <hr className="w-full" />
                            <p tabIndex="0" className="flex flex-shrink-0 px-3 py-16 focus:outline-none text-gray-200 text-sm leading-normal">C'est tout pour l'instant :)</p>
                            <hr className="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationSidebar;

// const NotificationSidebar = ({ notifications, isOpen, setIsOpen, refreshUserNotifications }) => {

//     return (
//         <>
//             <div className="top-0 right-0 z-50 fixed w-full h-screen mt-[128px] overflow-x-hidden overflow-y-auto">
//                 <div
//                     className={`
//                         w-full absolute z-5 right-0 h-full transform transition-transform duration-500 ease-in-out
//                         ${isVisible ? 'translate-x-0' : 'translate-x-full'}
//                     `}
//                 >
//                     <div ref={panelRef} className="right-0 absolute rounded-xl bg-gray-900 p-8 md:w-full w-[600px] h-screen overflow-y-auto">
//                         <div className="flex justify-between items-center">
//                             <p
//                                 tabIndex="0"
//                                 className="focus:outline-none font-semibold text-gray-200 text-2xl leading-6"
//                             >
//                                 Notifications
//                             </p>
//                             <label class="flex gap-2 min-w-36 mcui-checkbox">
//                                 <input
//                                     type="checkbox"
//                                     checked={showAllNotifications}
//                                     onChange={() => setShowAllNotifications(!showAllNotifications)}
//                                 />
//                                 <div>
//                                     <svg class="mcui-check" viewBox="-2 -2 35 35" aria-hidden="true">
//                                         <polyline points="7.57 15.87 12.62 21.07 23.43 9.93" />
//                                     </svg>
//                                 </div>
//                                 <span className="text-gray-300 text-lg">Afficher les Notifications non lues</span>
//                             </label>
//                             <button
//                                 aria-label="close modal"
//                                 onClick={toggleNotifications}
//                             >
//                                 <svg
//                                     width="24"
//                                     height="24"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                     <path
//                                         d="M18 6L6 18"
//                                         stroke="#ffffff"
//                                         strokeWidth="1.25"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     />
//                                     <path
//                                         d="M6 6L18 18"
//                                         stroke="#ffffff"
//                                         strokeWidth="1.25"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     />
//                                 </svg>
//                             </button>
//                         </div>
//                         {grouped.map(([label, notifs]) => (
//                             <div key={label}>
//                                 <h2
//                                     tabIndex="0"
//                                     className="pt-8 pb-2 border-gray-300 border-b focus:outline-none text-white text-base leading-normal"
//                                 >
//                                     {label}
//                                     {notifs.filter(notif => !notif.Consulte_Date).length > 0 &&
//                                         (<>
//                                             <span className="bg-orange-600 ml-3 px-1.5 rounded-xl h-full font-base text-gray-500 text-white text-xs">{notifs.length > 0 ? `${notifs.filter(notif => notif.Consulte_Date == null).length} non lues` : ''}</span>
//                                             <button className="group ml-3 px-2 rounded text-orange-700 hover:text-orange-600 text-xs transition-all duration-300 ease-in-out"

//                                                 onClick={(e) => {
//                                                     e.stopPropagation();

//                                                     notifs.forEach((notif) => {
//                                                         if (notif.Consulte_Date) return;

//                                                         handleToggleRead(notif, true);
//                                                     });
//                                                 }}

//                                             >
//                                                 Tout marquer comme lu
//                                             </button>
//                                         </>)}
//                                 </h2>
//                                 <label ></label>
//                                 {notifs
//                                     .map((notif, idx) => {
//                                         const uniqueId = `${notif.Crea_Date}-${notif.Crea_Heure}-${idx}`;
//                                         const timeText = getPreciseTimeAgo(notif.Crea_Date, notif.Crea_Heure);
//                                         const isUnread = notif.Consulte_Date == null;

//                                         return (
//                                             <div
//                                                 key={idx}
//                                                 className={`flex flex-col gap-1 mt-4  w-full transition-all duration-300 ease-in-out cursor-pointer`}
//                                                 onClick={() => toggleExpand(uniqueId)}
//                                             >
//                                                 <div className={`flex justify-between gap-2 p-3 rounded-md ${isUnread ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'} transition-all duration-300`}>
//                                                     <div className="flex flex-shrink-0 justify-center items-center">
//                                                         <div
//                                                             tabIndex="0"
//                                                             aria-label="notif icon"
//                                                             role="img"
//                                                             className="flex justify-center items-center mr-2 border border-white rounded-full w-8 h-8"
//                                                         >
//                                                             {getNotificationIcon(notif.Commentaire)}
//                                                         </div>
//                                                     </div>

//                                                     <div className={`flex-grow`}>
//                                                         <p className="focus:outline-none text-white text-sm leading-snug">
//                                                             <span className="font-semibold text-orange-500">{notif.Nom_Utilisateur.charAt(0).toUpperCase() + notif.Nom_Utilisateur.slice(1)}</span>{" "}
//                                                             {notif.Commentaire}
//                                                             {notif.Info_Origine && (
//                                                                 <p className="flex gap-2 font-semibold text-orange-400 text-xs">
//                                                                     {(() => {
//                                                                         const full = notif.Info_Origine.Nom || notif.Info_Origine.Libelle || notif.Info_Origine.Nom_Du_Document || JSON.stringify(notif.Info_Origine);
//                                                                         const extMatch = full.match(/\.[a-z0-9]{2,5}$/i);
//                                                                         const ext = extMatch ? extMatch[0] : '';
//                                                                         const withoutExt = ext ? full.slice(0, -ext.length) : full;
//                                                                         if (full.length > 30) {
//                                                                             const base = withoutExt.slice(0, 30 - ext.length);
//                                                                             return base + '…' + ext;
//                                                                         }
//                                                                         return full;
//                                                                     })()} {notif.Info_Origine?.Suppression &&
//                                                                         (<span class="text-red-500">( <i class="mr-1 fa-solid fa-xmark"></i>Document Supprimé par {notif.Info_Origine?.Complements?.User.charAt(0).toUpperCase() + notif.Info_Origine?.Complements?.User.slice(1)} )</span>)
//                                                                     }
//                                                                 </p>
//                                                             )}


//                                                         </p>
//                                                         <p className="pt-1 text-gray-200 text-xs leading-3">
//                                                             {timeText ? `${timeText}` : formatDate(notif.Crea_Date)}
//                                                         </p>
//                                                     </div>

//                                                     <div className="flex flex-shrink-0 justify-center items-center">
//                                                         <button className="group bg-orange-700 px-2 py-1 rounded transition-all duration-300 ease-in-out"

//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();

//                                                                 handleToggleRead(notif, isUnread);
//                                                             }}

//                                                         >
//                                                             <i
//                                                                 className={`fa-solid ${isUnread
//                                                                     ? 'fa-envelope text-orange-100 group-hover:animate-none animate-[wiggle_1s_ease-in-out_infinite]'
//                                                                     : 'fa-envelope-open text-orange-300 group-hover:text-orange-100'
//                                                                     } transition-all duration-300 ease-in-out`}
//                                                             ></i>
//                                                         </button>
//                                                     </div>
//                                                 </div>


//                                                 <div
//                                                     className={`
//                                                         transition-all duration-300 ease-in-out overflow-hidden
//                                                         ${expandedNotificationId === uniqueId ? 'max-h-48 mt-1' : 'max-h-0'}
//                                                     `}
//                                                 >
//                                                     <div className="flex justify-around gap-2 *:py-0.5 *:border-orange-600 *:rounded *:w-1/4 *:text-orange-600 *:text-center">
//                                                         <a className="group relative border-2 rounded-md overflow-hidden font-semibold transition-all duration-300"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                             }}
//                                                         >
//                                                             <span className="top-0 left-0 z-10 absolute bg-orange-600 w-full h-full transition-transform -translate-x-full group-hover:translate-x-0 duration-300 ease-in-out transform"></span>
//                                                             <span className="z-20 relative group-hover:text-white transition-all duration-300"></span>
//                                                         </a>
//                                                         <a className="group relative border-2 rounded-md overflow-hidden font-semibold transition-all duration-300"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                             }}
//                                                         >
//                                                             <span className="top-0 left-0 z-10 absolute bg-orange-600 w-full h-full transition-transform -translate-x-full group-hover:translate-x-0 duration-300 ease-in-out transform"></span>
//                                                             <span className="z-20 relative group-hover:text-white transition-all duration-300"></span>
//                                                         </a>
//                                                         <a className="group relative border-2 rounded-md overflow-hidden font-semibold transition-all duration-300"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 toggleNotifications();
//                                                                 handleToggleRead(notif, true);
//                                                                 navigate(`/${notif.NomTableExterne}/${notif.Info_Origine.UUID_Externe_}`)
//                                                             }}
//                                                         >
//                                                             <span className="top-0 left-0 z-10 absolute bg-orange-600 w-full h-full transition-transform -translate-x-full group-hover:translate-x-0 duration-300 ease-in-out transform"></span>
//                                                             <span className="z-20 relative group-hover:text-white transition-all duration-300">Y Aller</span>
//                                                         </a>
//                                                         <a className="group relative border-2 rounded-md overflow-hidden font-semibold transition-all duration-300"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                             }}
//                                                         >
//                                                             <span className="top-0 left-0 z-10 absolute bg-orange-600 w-full h-full transition-transform -translate-x-full group-hover:translate-x-0 duration-300 ease-in-out transform"></span>
//                                                             <span className="z-20 relative group-hover:text-white transition-all duration-300"></span>
//                                                         </a>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                             </div>
//                         ))}
//                         <h2 tabindex="0" class="pt-8 pb-2 border-gray-300 border-b focus:outline-none text-gray-200 text-base leading-normal">Aujourd'hui</h2>
//                         <div class="flex bg-gray-700 mt-8 p-3 rounded w-full">
//                             <div tabindex="0" aria-label="heart icon" role="img" class="flex justify-center items-center border border-gray-200 rounded-full focus:outline-none w-8 h-8">
//                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M8.00059 3.01934C9.56659 1.61334 11.9866 1.66 13.4953 3.17134C15.0033 4.68334 15.0553 7.09133 13.6526 8.662L7.99926 14.3233L2.34726 8.662C0.944589 7.09133 0.997256 4.67934 2.50459 3.17134C4.01459 1.662 6.42992 1.61134 8.00059 3.01934Z" fill="#EF4444" />
//                                 </svg>
//                             </div>
//                             <div class="pl-3">
//                                 <p tabindex="0" class="focus:outline-none text-white text-sm leading-none"><span class="text-orange-500">James Doe</span> favourited an <span class="text-orange-500">item</span></p>
//                                 <p tabindex="0" class="pt-1 focus:outline-none text-gray-200 text-xs leading-3">2 hours ago</p>
//                             </div>
//                         </div>
//                         <div class="flex flex-shrink-0 bg-gray-700 shadow mt-4 p-3 rounded w-full">
//                             <div tabindex="0" aria-label="group icon" role="img" class="flex flex-shrink-0 justify-center items-center border border-gray-200 rounded-full focus:outline-none w-8 h-8">
//                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path
//                                         d="M1.33325 14.6667C1.33325 13.2522 1.89516 11.8956 2.89535 10.8954C3.89554 9.89523 5.2521 9.33333 6.66659 9.33333C8.08107 9.33333 9.43763 9.89523 10.4378 10.8954C11.438 11.8956 11.9999 13.2522 11.9999 14.6667H1.33325ZM6.66659 8.66666C4.45659 8.66666 2.66659 6.87666 2.66659 4.66666C2.66659 2.45666 4.45659 0.666664 6.66659 0.666664C8.87659 0.666664 10.6666 2.45666 10.6666 4.66666C10.6666 6.87666 8.87659 8.66666 6.66659 8.66666ZM11.5753 10.1553C12.595 10.4174 13.5061 10.9946 14.1788 11.8046C14.8515 12.6145 15.2515 13.6161 15.3219 14.6667H13.3333C13.3333 12.9267 12.6666 11.3427 11.5753 10.1553ZM10.2266 8.638C10.7852 8.13831 11.232 7.52622 11.5376 6.84183C11.8432 6.15743 12.0008 5.41619 11.9999 4.66666C12.0013 3.75564 11.7683 2.85958 11.3233 2.06466C12.0783 2.21639 12.7576 2.62491 13.2456 3.2208C13.7335 3.81668 14.0001 4.56315 13.9999 5.33333C14.0001 5.80831 13.8987 6.27784 13.7027 6.71045C13.5066 7.14306 13.2203 7.52876 12.863 7.84169C12.5056 8.15463 12.0856 8.38757 11.6309 8.52491C11.1762 8.66224 10.6974 8.7008 10.2266 8.638Z"
//                                         fill="#047857"
//                                     />
//                                 </svg>
//                             </div>
//                             <div class="pl-3 w-full">
//                                 <div class="flex justify-between items-center w-full">
//                                     <p tabindex="0" class="focus:outline-none text-white text-sm leading-none"><span class="text-orange-500">Sash</span> added you to the group: <span class="text-orange-500">UX Designers</span></p>
//                                     <div tabindex="0" aria-label="close icon" role="button" class="focus:outline-none cursor-pointer">
//                                         <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                             <path d="M10.5 3.5L3.5 10.5" stroke="#4B5563" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
//                                             <path d="M3.5 3.5L10.5 10.5" stroke="#4B5563" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <p tabindex="0" class="pt-1 focus:outline-none text-gray-200 text-xs leading-3">2 hours ago</p>
//                             </div>
//                         </div>
//                         <div class="flex bg-gray-700 mt-4 p-3 rounded w-full">
//                             <div tabindex="0" aria-label="post icon" role="img" class="flex justify-center items-center border border-gray-200 rounded-full focus:outline-none w-8 h-8">
//                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M4.30325 12.6667L1.33325 15V2.66667C1.33325 2.48986 1.40349 2.32029 1.52851 2.19526C1.65354 2.07024 1.82311 2 1.99992 2H13.9999C14.1767 2 14.3463 2.07024 14.4713 2.19526C14.5963 2.32029 14.6666 2.48986 14.6666 2.66667V12C14.6666 12.1768 14.5963 12.3464 14.4713 12.4714C14.3463 12.5964 14.1767 12.6667 13.9999 12.6667H4.30325ZM5.33325 6.66667V8H10.6666V6.66667H5.33325Z" fill="#4338CA" />
//                                 </svg>
//                             </div>
//                             <div class="pl-3">
//                                 <p tabindex="0" class="focus:outline-none text-white text-sm leading-none"><span class="text-orange-500">Sarah</span> posted in the thread: <span class="text-orange-500">Update gone wrong</span></p>
//                                 <p tabindex="0" class="pt-1 focus:outline-none text-gray-200 text-xs leading-3">2 hours ago</p>
//                             </div>
//                         </div>
//                         <div class="flex items-center bg-red-200 mt-4 p-3 rounded w-full">
//                             <div tabindex="0" aria-label="storage icon" role="img" class="flex flex-shrink-0 justify-center items-center border border-red-200 rounded-full focus:outline-none w-8 h-8">
//                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M14 2V14C14 14.1768 13.9298 14.3464 13.8047 14.4714C13.6797 14.5964 13.5101 14.6667 13.3333 14.6667H2.66667C2.48986 14.6667 2.32029 14.5964 2.19526 14.4714C2.07024 14.3464 2 14.1768 2 14V2C2 1.82319 2.07024 1.65362 2.19526 1.5286C2.32029 1.40357 2.48986 1.33334 2.66667 1.33334H13.3333C13.5101 1.33334 13.6797 1.40357 13.8047 1.5286C13.9298 1.65362 14 1.82319 14 2ZM3.33333 10.6667V13.3333H12.6667V10.6667H3.33333ZM10 11.3333H11.3333V12.6667H10V11.3333Z" fill="#B91C1C" />
//                                 </svg>
//                             </div>
//                             <div class="flex justify-between items-center pl-3 w-full">
//                                 <p tabindex="0" class="focus:outline-none text-red-700 text-sm leading-none">Low on storage: 2.5/32gb remaining</p>
//                                 <p tabindex="0" class="focus:outline-none text-red-700 text-xs text-right underline leading-3 cursor-pointer">Manage</p>
//                             </div>
//                         </div>
//                         <div class="flex bg-gray-700 mt-4 p-3 rounded w-full">
//                             <div tabindex="0" aria-label="loading icon" role="img" class="flex justify-center items-center border border-gray-200 rounded-full focus:outline-none w-8 h-8">
//                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path
//                                         d="M7.99992 1.33333C8.17673 1.33333 8.3463 1.40357 8.47132 1.52859C8.59635 1.65361 8.66659 1.82318 8.66659 1.99999V3.99999C8.66659 4.17681 8.59635 4.34638 8.47132 4.4714C8.3463 4.59642 8.17673 4.66666 7.99992 4.66666C7.82311 4.66666 7.65354 4.59642 7.52851 4.4714C7.40349 4.34638 7.33325 4.17681 7.33325 3.99999V1.99999C7.33325 1.82318 7.40349 1.65361 7.52851 1.52859C7.65354 1.40357 7.82311 1.33333 7.99992 1.33333ZM7.99992 11.3333C8.17673 11.3333 8.3463 11.4036 8.47132 11.5286C8.59635 11.6536 8.66659 11.8232 8.66659 12V14C8.66659 14.1768 8.59635 14.3464 8.47132 14.4714C8.3463 14.5964 8.17673 14.6667 7.99992 14.6667C7.82311 14.6667 7.65354 14.5964 7.52851 14.4714C7.40349 14.3464 7.33325 14.1768 7.33325 14V12C7.33325 11.8232 7.40349 11.6536 7.52851 11.5286C7.65354 11.4036 7.82311 11.3333 7.99992 11.3333ZM14.6666 8C14.6666 8.17681 14.5963 8.34638 14.4713 8.4714C14.3463 8.59642 14.1767 8.66666 13.9999 8.66666H11.9999C11.8231 8.66666 11.6535 8.59642 11.5285 8.4714C11.4035 8.34638 11.3333 8.17681 11.3333 8C11.3333 7.82318 11.4035 7.65361 11.5285 7.52859C11.6535 7.40357 11.8231 7.33333 11.9999 7.33333H13.9999C14.1767 7.33333 14.3463 7.40357 14.4713 7.52859C14.5963 7.65361 14.6666 7.82318 14.6666 8ZM4.66659 8C4.66659 8.17681 4.59635 8.34638 4.47132 8.4714C4.3463 8.59642 4.17673 8.66666 3.99992 8.66666H1.99992C1.82311 8.66666 1.65354 8.59642 1.52851 8.4714C1.40349 8.34638 1.33325 8.17681 1.33325 8C1.33325 7.82318 1.40349 7.65361 1.52851 7.52859C1.65354 7.40357 1.82311 7.33333 1.99992 7.33333H3.99992C4.17673 7.33333 4.3463 7.40357 4.47132 7.52859C4.59635 7.65361 4.66659 7.82318 4.66659 8ZM12.7139 12.714C12.5889 12.839 12.4194 12.9092 12.2426 12.9092C12.0658 12.9092 11.8963 12.839 11.7713 12.714L10.3573 11.3C10.2358 11.1743 10.1686 11.0059 10.1701 10.8311C10.1717 10.6563 10.2418 10.4891 10.3654 10.3654C10.489 10.2418 10.6562 10.1717 10.831 10.1702C11.0058 10.1687 11.1742 10.2359 11.2999 10.3573L12.7139 11.7707C12.7759 11.8326 12.8251 11.9061 12.8586 11.987C12.8922 12.068 12.9094 12.1547 12.9094 12.2423C12.9094 12.3299 12.8922 12.4167 12.8586 12.4976C12.8251 12.5786 12.7759 12.6521 12.7139 12.714ZM5.64259 5.64266C5.51757 5.76764 5.34803 5.83785 5.17125 5.83785C4.99448 5.83785 4.82494 5.76764 4.69992 5.64266L3.28659 4.22933C3.16149 4.10432 3.09118 3.93474 3.09112 3.7579C3.09105 3.58105 3.16125 3.41142 3.28625 3.28633C3.41126 3.16123 3.58084 3.09092 3.75768 3.09086C3.93453 3.0908 4.10416 3.16099 4.22925 3.28599L5.64259 4.7C5.76757 4.82501 5.83778 4.99455 5.83778 5.17133C5.83778 5.3481 5.76757 5.51764 5.64259 5.64266ZM3.28659 12.714C3.1616 12.589 3.09139 12.4194 3.09139 12.2427C3.09139 12.0659 3.1616 11.8963 3.28659 11.7713L4.70059 10.3573C4.76208 10.2937 4.83565 10.2429 4.91698 10.2079C4.99832 10.173 5.0858 10.1546 5.17432 10.1538C5.26284 10.1531 5.35062 10.1699 5.43256 10.2034C5.51449 10.237 5.58892 10.2865 5.65152 10.3491C5.71411 10.4117 5.76361 10.4861 5.79713 10.568C5.83065 10.65 5.84752 10.7377 5.84675 10.8263C5.84598 10.9148 5.82759 11.0023 5.79265 11.0836C5.75771 11.1649 5.70693 11.2385 5.64325 11.3L4.22992 12.714C4.168 12.776 4.09448 12.8252 4.01355 12.8587C3.93261 12.8923 3.84586 12.9095 3.75825 12.9095C3.67064 12.9095 3.58389 12.8923 3.50296 12.8587C3.42203 12.8252 3.3485 12.776 3.28659 12.714ZM10.3573 5.64266C10.2323 5.51764 10.1621 5.3481 10.1621 5.17133C10.1621 4.99455 10.2323 4.82501 10.3573 4.7L11.7706 3.28599C11.8956 3.1609 12.0652 3.09059 12.242 3.09053C12.4189 3.09046 12.5885 3.16066 12.7136 3.28566C12.8387 3.41067 12.909 3.58025 12.9091 3.75709C12.9091 3.93394 12.8389 4.10357 12.7139 4.22866L11.2999 5.64266C11.1749 5.76764 11.0054 5.83785 10.8286 5.83785C10.6518 5.83785 10.4823 5.76764 10.3573 5.64266Z"
//                                         fill="#F59E0B"
//                                     />
//                                 </svg>
//                             </div>
//                             <div class="pl-3">
//                                 <p tabindex="0" class="focus:outline-none text-white text-sm leading-none">Shipmet delayed for order<span class="text-orange-500"> #25551</span></p>
//                                 <p tabindex="0" class="pt-1 focus:outline-none text-gray-200 text-xs leading-3">2 hours ago</p>
//                             </div>
//                         </div>
//                         <h2 tabindex="0" class="pt-8 pb-2 border-gray-300 border-b focus:outline-none text-gray-200 text-base leading-normal">Hier</h2>
//                         <div class="flex bg-gray-700 mt-6 p-3 rounded w-full">
//                             <div tabindex="0" aria-label="post icon" role="img" class="flex justify-center items-center border border-gray-200 rounded-full focus:outline-none w-8 h-8">
//                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M4.30325 12.6667L1.33325 15V2.66667C1.33325 2.48986 1.40349 2.32029 1.52851 2.19526C1.65354 2.07024 1.82311 2 1.99992 2H13.9999C14.1767 2 14.3463 2.07024 14.4713 2.19526C14.5963 2.32029 14.6666 2.48986 14.6666 2.66667V12C14.6666 12.1768 14.5963 12.3464 14.4713 12.4714C14.3463 12.5964 14.1767 12.6667 13.9999 12.6667H4.30325ZM5.33325 6.66667V8H10.6666V6.66667H5.33325Z" fill="#4338CA" />
//                                 </svg>
//                             </div>
//                             <div class="pl-3">
//                                 <p tabindex="0" class="focus:outline-none text-white text-sm leading-none"><span class="text-orange-500">Sarah</span> posted in the thread: <span class="text-orange-500">Update gone wrong</span></p>
//                                 <p tabindex="0" class="pt-1 focus:outline-none text-gray-200 text-xs leading-3">2 hours ago</p>
//                             </div>
//                         </div>
//                         <div class="flex bg-gray-700 mt-4 p-3 rounded w-full">
//                             <div tabindex="0" aria-label="loading icon" role="img" class="flex justify-center items-center border border-gray-200 rounded-full focus:outline-none w-8 h-8">
//                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path
//                                         d="M7.99992 1.33333C8.17673 1.33333 8.3463 1.40357 8.47132 1.52859C8.59635 1.65361 8.66659 1.82318 8.66659 1.99999V3.99999C8.66659 4.17681 8.59635 4.34638 8.47132 4.4714C8.3463 4.59642 8.17673 4.66666 7.99992 4.66666C7.82311 4.66666 7.65354 4.59642 7.52851 4.4714C7.40349 4.34638 7.33325 4.17681 7.33325 3.99999V1.99999C7.33325 1.82318 7.40349 1.65361 7.52851 1.52859C7.65354 1.40357 7.82311 1.33333 7.99992 1.33333ZM7.99992 11.3333C8.17673 11.3333 8.3463 11.4036 8.47132 11.5286C8.59635 11.6536 8.66659 11.8232 8.66659 12V14C8.66659 14.1768 8.59635 14.3464 8.47132 14.4714C8.3463 14.5964 8.17673 14.6667 7.99992 14.6667C7.82311 14.6667 7.65354 14.5964 7.52851 14.4714C7.40349 14.3464 7.33325 14.1768 7.33325 14V12C7.33325 11.8232 7.40349 11.6536 7.52851 11.5286C7.65354 11.4036 7.82311 11.3333 7.99992 11.3333ZM14.6666 8C14.6666 8.17681 14.5963 8.34638 14.4713 8.4714C14.3463 8.59642 14.1767 8.66666 13.9999 8.66666H11.9999C11.8231 8.66666 11.6535 8.59642 11.5285 8.4714C11.4035 8.34638 11.3333 8.17681 11.3333 8C11.3333 7.82318 11.4035 7.65361 11.5285 7.52859C11.6535 7.40357 11.8231 7.33333 11.9999 7.33333H13.9999C14.1767 7.33333 14.3463 7.40357 14.4713 7.52859C14.5963 7.65361 14.6666 7.82318 14.6666 8ZM4.66659 8C4.66659 8.17681 4.59635 8.34638 4.47132 8.4714C4.3463 8.59642 4.17673 8.66666 3.99992 8.66666H1.99992C1.82311 8.66666 1.65354 8.59642 1.52851 8.4714C1.40349 8.34638 1.33325 8.17681 1.33325 8C1.33325 7.82318 1.40349 7.65361 1.52851 7.52859C1.65354 7.40357 1.82311 7.33333 1.99992 7.33333H3.99992C4.17673 7.33333 4.3463 7.40357 4.47132 7.52859C4.59635 7.65361 4.66659 7.82318 4.66659 8ZM12.7139 12.714C12.5889 12.839 12.4194 12.9092 12.2426 12.9092C12.0658 12.9092 11.8963 12.839 11.7713 12.714L10.3573 11.3C10.2358 11.1743 10.1686 11.0059 10.1701 10.8311C10.1717 10.6563 10.2418 10.4891 10.3654 10.3654C10.489 10.2418 10.6562 10.1717 10.831 10.1702C11.0058 10.1687 11.1742 10.2359 11.2999 10.3573L12.7139 11.7707C12.7759 11.8326 12.8251 11.9061 12.8586 11.987C12.8922 12.068 12.9094 12.1547 12.9094 12.2423C12.9094 12.3299 12.8922 12.4167 12.8586 12.4976C12.8251 12.5786 12.7759 12.6521 12.7139 12.714ZM5.64259 5.64266C5.51757 5.76764 5.34803 5.83785 5.17125 5.83785C4.99448 5.83785 4.82494 5.76764 4.69992 5.64266L3.28659 4.22933C3.16149 4.10432 3.09118 3.93474 3.09112 3.7579C3.09105 3.58105 3.16125 3.41142 3.28625 3.28633C3.41126 3.16123 3.58084 3.09092 3.75768 3.09086C3.93453 3.0908 4.10416 3.16099 4.22925 3.28599L5.64259 4.7C5.76757 4.82501 5.83778 4.99455 5.83778 5.17133C5.83778 5.3481 5.76757 5.51764 5.64259 5.64266ZM3.28659 12.714C3.1616 12.589 3.09139 12.4194 3.09139 12.2427C3.09139 12.0659 3.1616 11.8963 3.28659 11.7713L4.70059 10.3573C4.76208 10.2937 4.83565 10.2429 4.91698 10.2079C4.99832 10.173 5.0858 10.1546 5.17432 10.1538C5.26284 10.1531 5.35062 10.1699 5.43256 10.2034C5.51449 10.237 5.58892 10.2865 5.65152 10.3491C5.71411 10.4117 5.76361 10.4861 5.79713 10.568C5.83065 10.65 5.84752 10.7377 5.84675 10.8263C5.84598 10.9148 5.82759 11.0023 5.79265 11.0836C5.75771 11.1649 5.70693 11.2385 5.64325 11.3L4.22992 12.714C4.168 12.776 4.09448 12.8252 4.01355 12.8587C3.93261 12.8923 3.84586 12.9095 3.75825 12.9095C3.67064 12.9095 3.58389 12.8923 3.50296 12.8587C3.42203 12.8252 3.3485 12.776 3.28659 12.714ZM10.3573 5.64266C10.2323 5.51764 10.1621 5.3481 10.1621 5.17133C10.1621 4.99455 10.2323 4.82501 10.3573 4.7L11.7706 3.28599C11.8956 3.1609 12.0652 3.09059 12.242 3.09053C12.4189 3.09046 12.5885 3.16066 12.7136 3.28566C12.8387 3.41067 12.909 3.58025 12.9091 3.75709C12.9091 3.93394 12.8389 4.10357 12.7139 4.22866L11.2999 5.64266C11.1749 5.76764 11.0054 5.83785 10.8286 5.83785C10.6518 5.83785 10.4823 5.76764 10.3573 5.64266Z"
//                                         fill="#F59E0B"
//                                     />
//                                 </svg>
//                             </div>
//                             <div class="pl-3">
//                                 <p tabindex="0" class="focus:outline-none text-white text-sm leading-none">Shipmet delayed for order<span class="text-orange-500"> #25551</span></p>
//                                 <p tabindex="0" class="pt-1 focus:outline-none text-gray-200 text-xs leading-3">2 hours ago</p>
//                             </div>
//                         </div>
//                         <div class="flex bg-gray-700 mt-4 p-3 rounded w-full">
//                             <div tabindex="0" aria-label="heart icon" role="img" class="flex justify-center items-center border border-gray-200 rounded-full focus:outline-none w-8 h-8">
//                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M8.00059 3.01934C9.56659 1.61334 11.9866 1.66 13.4953 3.17134C15.0033 4.68334 15.0553 7.09133 13.6526 8.662L7.99926 14.3233L2.34726 8.662C0.944589 7.09133 0.997256 4.67934 2.50459 3.17134C4.01459 1.662 6.42992 1.61134 8.00059 3.01934Z" fill="#EF4444" />
//                                 </svg>
//                             </div>
//                             <div class="pl-3">
//                                 <p tabindex="0" class="focus:outline-none text-white text-sm leading-none"><span class="text-orange-500">James Doe</span> favourited an <span class="text-orange-500">item</span></p>
//                                 <p tabindex="0" class="pt-1 focus:outline-none text-gray-200 text-xs leading-3">2 hours ago</p>
//                             </div>
//                         </div>
//                         <div class="flex items-center bg-green-200 mt-8 p-3 rounded w-full">
//                             <div tabindex="0" aria-label="success icon" role="img" class="flex flex-shrink-0 justify-center items-center border border-green-200 rounded-full focus:outline-none w-8 h-8">
//                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M6.66674 10.1147L12.7947 3.98599L13.7381 4.92866L6.66674 12L2.42407 7.75733L3.36674 6.81466L6.66674 10.1147Z" fill="#047857" />
//                                 </svg>
//                             </div>
//                             <div class="pl-3 w-full">
//                                 <div class="flex justify-between items-center">
//                                     <p tabindex="0" class="focus:outline-none text-green-700 text-sm leading-none">Design sprint completed</p>
//                                     <p tabindex="0" class="focus:outline-none text-green-700 focus:text-orange-500 text-xs underline leading-3 cursor-pointer">View</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="flex items-center justiyf-between">
//                             <hr class="w-full"></hr>
//                             <p tabindex="0" class="flex flex-shrink-0 px-3 py-16 focus:outline-none text-gray-200 text-sm leading-normal">C'est tout pour l'instant :)</p>
//                             <hr class="w-full"></hr>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default NotificationSidebar;
