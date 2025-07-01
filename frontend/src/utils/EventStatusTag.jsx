import React, { useMemo, useEffect, useState } from 'react';
import 'animate.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

const STATUS_STYLES = {
    'Planifié': 'bg-gradient-to-r from-[#550ECA] to-[#7A2AE1] text-white animate__fadeIn shadow-md',
    'En Cours': 'bg-gradient-to-r from-[#F929BB] to-[#C421C0] text-white animate__pulse animate__infinite shadow-lg',
    'Terminé': 'bg-gray-300 text-gray-700 animate__fadeIn shadow-sm grayscale',
    'Annulé': 'bg-gradient-to-r from-[#F929BB] to-red-500 text-white animate__shakeX shadow-md',
};

dayjs.extend(duration);

const formatTimeLeft = (milliseconds) => {
    const time = dayjs.duration(milliseconds);
    const hours = time.hours();
    const minutes = time.minutes();
    const seconds = time.seconds();

    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0) result += `${minutes}m `;
    result += `${seconds}s`;

    return result.trim();
};


const EventStatusTag = ({ date, status, eventId, onStatusChange }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const computedStatus = useMemo(() => {
        if (status) return status;

        const now = dayjs();
        const eventStart = dayjs(date);
        const diff = eventStart.diff(now, 'minute');

        if (diff > 60) return 'Planifié';
        if (diff <= 60 && diff > -120) return 'En Cours';
        if (diff <= -120) return 'Terminé';
        return 'Planifié';
    }, [date, status]);

    useEffect(() => {
        if (computedStatus === 'Planifié') {
            const eventTime = dayjs(date);
            const now = dayjs();
            const diffMs = eventTime.diff(now);

            if (diffMs <= 24 * 60 * 60 * 1000 && diffMs > 0) {
                setTimeLeft(diffMs);

                const interval = setInterval(() => {
                    const now = dayjs();
                    const remaining = eventTime.diff(now);
                    if (remaining <= 0) {
                        clearInterval(interval);
                        setTimeLeft(null);

                        fetch(`${API_BASE_URL}/events/${eventId}/status/auto`, {
                            method: 'PATCH',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log("Status auto-updated:", data);
                                if (typeof onStatusChange === 'function') {
                                    onStatusChange();
                                }
                            })
                            .catch(err => console.error("Error auto-updating event status", err));
                    } else {
                        setTimeLeft(remaining);
                    }
                }, 1000);

                return () => clearInterval(interval);
            }
        }
    }, [computedStatus, date, eventId, onStatusChange]);

    return (
        <div className="relative inline-block">
            {computedStatus === 'Planifié' && timeLeft !== null && (
                <div className="absolute z-10 -top-4 -right-2 text-[13px] px-2 py-[1px] rounded-full bg-[#F929BB] text-white font-semibold shadow">
                    {formatTimeLeft(timeLeft)}
                </div>
            )}

            <span
                className={`inline-block text-[13px] font-medium px-3 py-1 rounded-full w-fit animate__animated ${timeLeft !== null ? 'border-2 border-[#F929BB]' : ''}
                    backdrop-blur-sm ring-1 ring-white/20 ${STATUS_STYLES[computedStatus] || 'bg-gray-100 text-gray-700'}
                `}
            >
                {computedStatus === 'Planifié' && timeLeft !== null && (
                    <div className="wave-overlay" />
                )}

                {computedStatus === 'Terminé' ? (
                    <span className="flex items-center gap-1">
                        <svg
                            className="w-4 h-4 text-green-600 animate__animated animate__bounceIn"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Terminé
                    </span>
                ) : (
                    computedStatus
                )}
            </span>

            {computedStatus === 'En Cours' && (
                <>
                    <span className="absolute -top-2 -left-2 w-[6px] h-[6px] bg-yellow-400 rounded-full animate-bounce rotate-[15deg]" />
                    <span className="absolute -top-3 left-2 w-[5px] h-[5px] bg-pink-400 rounded-full animate-ping" />
                    <span className="absolute -top-1 -left-3 w-[4px] h-[4px] bg-purple-400 rounded-full animate-spin" />

                    <span className="absolute -bottom-2 -right-2 w-[6px] h-[6px] bg-green-400 rounded-full animate-bounce delay-200 rotate-[15deg]" />
                    <span className="absolute -bottom-3 right-2 w-[5px] h-[5px] bg-blue-400 rounded-full animate-ping delay-300" />
                    <span className="absolute -bottom-1 -right-3 w-[4px] h-[4px] bg-fuchsia-400 rounded-full animate-spin" />
                </>
            )}
        </div>
    );
};

export default EventStatusTag;
