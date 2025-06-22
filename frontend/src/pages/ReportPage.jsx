import React, { useState, useEffect } from 'react';
import Header from '../components/Partials/Header';
import Footer from '../components/Partials/Footer';
import Report from '../components/Report/Report'; // ← Ton composant adapté pour afficher les reports
import useMyReports from '../hooks/Report/useMyReports';
import vector1 from "../assets/img/et-3-event-vector.svg";
import { useAuth } from '../config/authHeader';
import { formatEuro, getFormattedDayAndMonthYear, capitalizeFirstLetter } from '../utils/format';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export default function ReportsPage() {
    const { user } = useAuth();
    const { reports, loading } = useMyReports();

    const [filtered, setFiltered] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [eventFilter, setEventFilter] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (!Array.isArray(reports)) return;

        let data = [...reports];
        if (statusFilter) data = data.filter(r => r.status === statusFilter);
        if (eventFilter) data = data.filter(r => r.event?.title === eventFilter);
        if (searchValue) data = data.filter(r => r.event?.title?.toLowerCase().includes(searchValue.toLowerCase()));
        setFiltered(data);
    }, [statusFilter, eventFilter, searchValue, reports]);

    const statuses = Array.isArray(reports)
        ? [...new Set(reports.map(r => r.status).filter(Boolean))]
        : [];

    const events = Array.isArray(reports)
        ? [...new Set(reports.map(r => r.event?.title).filter(Boolean))]
        : [];

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        return events.filter(event => event.toLowerCase().includes(inputValue));
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const inputProps = {
        placeholder: 'Rechercher un événement...',
        value: searchValue,
        onChange: (_e, { newValue }) => setSearchValue(newValue),
        className: 'w-full md:w-72 p-2 border rounded shadow-sm',
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
                        <h1 className="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title anim-text">Vos Signalements</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><a href="/" className="hover:text-[#C320C0] anim-text">Home</a></li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="opacity-80 hover:text-blue-400 cursor-pointer">
                                <a href={`/profile/${user?.id}`}>Profil</a>
                            </li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="current-page">Vos Signalements</li>
                        </ul>
                    </div>
                </section>

                <Report
                    formatEuro={formatEuro}
                    getFormattedDayAndMonthYear={getFormattedDayAndMonthYear}
                    capitalizeFirstLetter={capitalizeFirstLetter}
                    user={user}
                    reports={filtered}
                    API_BASE_URL={API_BASE_URL}
                    loading={loading}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    eventFilter={eventFilter}
                    setEventFilter={setEventFilter}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    statuses={statuses}
                    events={events}
                    inputProps={inputProps}
                />
            </main>
            <Footer />
        </>
    );
}