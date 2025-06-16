import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

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

const NotificationSidebar = ({
    notifications,
    setNotifications,
    isOpen,
    setIsOpen,
    onToggleRead,
    onMarkAllAsRead,
    onDelete,
    loading
}) => {

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
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

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
                                    <svg className="mcui-check cursor-pointer" viewBox="-2 -2 35 35" aria-hidden="true">
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
                            <div
                                key={notif.id}
                                className="relative group flex flex-col gap-1 mt-4 w-full transition-all duration-300 ease-in-out"
                            >
                                <div
                                    className={`flex items-center gap-2 p-3 rounded-md transition-all duration-300 ease-in-out ${notif.read_status ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-700 hover:bg-gray-600'
                                        } group-hover:translate-x-[-12px]`}
                                >
                                    <div className="flex-grow">
                                        <p className="text-white text-sm leading-snug">
                                            <span className="font-semibold text-orange-500">Notification</span> {notif.title} - {notif.message}
                                        </p>
                                        <p className="pt-1 text-gray-200 text-xs">{formatDateLabel(notif.date_sent)}</p>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onToggleRead(notif); }}
                                            className="group bg-orange-700 px-2 py-1 rounded transition-all duration-300 ease-in-out"
                                        >
                                            <i className={`fa-solid ${!notif.read_status
                                                ? 'fa-envelope text-orange-100 animate-[wiggle_1s_ease-in-out_infinite]'
                                                : 'fa-envelope-open text-orange-300 group-hover:text-orange-100'
                                                } transition-all duration-300 ease-in-out`}></i>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
                                    className="absolute right-[-27.5px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300 ease-in-out bg-red-600 text-white w-[36px] h-[36px] rounded-md flex items-center justify-center hover:bg-red-500 shadow-md"
                                    title="Supprimer"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        ))}

                        {filteredNotifications.length > 0 && (
                            <div className="mt-6 text-center">
                                <button
                                    className="bg-orange-600 px-4 py-2 rounded text-sm hover:bg-orange-500"
                                    onClick={onMarkAllAsRead}
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