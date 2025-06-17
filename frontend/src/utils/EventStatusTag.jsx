import React, { useMemo, useEffect, useState } from 'react';
import 'animate.css';
import dayjs from 'dayjs';

const STATUS_STYLES = {
    'Planifié': 'bg-gradient-to-r from-[#550ECA] to-[#7A2AE1] text-white animate__fadeIn shadow-md',
    'En Cours': 'bg-gradient-to-r from-[#F929BB] to-[#C421C0] text-white animate__pulse animate__infinite shadow-lg',
    'Terminé': 'bg-gray-100 text-gray-700 animate__fadeIn shadow-sm',
    'Annulé': 'bg-gradient-to-r from-[#F929BB] to-red-500 text-white animate__shakeX shadow-md',
};

const formatTimeLeft = (milliseconds) => {
    const duration = dayjs.duration(milliseconds);
    const hours = String(duration.hours()).padStart(2, '0');
    const minutes = String(duration.minutes()).padStart(2, '0');
    const seconds = String(duration.seconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

const EventStatusTag = ({ date, status }) => {
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
                    } else {
                        setTimeLeft(remaining);
                    }
                }, 1000);

                return () => clearInterval(interval);
            }
        }
    }, [computedStatus, date]);

    return (
        <div className="relative inline-block">
            {computedStatus === 'Planifié' && timeLeft !== null && (
                <div className="absolute -top-2 -right-2 text-[11px] px-2 py-[1px] rounded-full bg-white text-[#550ECA] font-semibold shadow animate__animated animate__fadeInUp">
                    ⏳ {formatTimeLeft(timeLeft)}
                </div>
            )}
            <span
                className={`inline-block text-[13px] font-medium px-3 py-1 rounded-full w-fit animate__animated
                    backdrop-blur-sm ring-1 ring-white/20 ${STATUS_STYLES[computedStatus] || 'bg-gray-100 text-gray-700'}
                `}
            >
                {computedStatus}
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
