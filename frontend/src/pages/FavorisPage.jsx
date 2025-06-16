import React, { useState, useEffect } from 'react';
import Header from '../components/Partials/Header';
import Footer from '../components/Partials/Footer';
import Favoris from '../components/Favoris/Favoris';
import useFavoris from '../hooks/Favoris/useFavoris';
import useAddFavoris from '../hooks/Favoris/useAddFavoris';
import useRemoveFavoris from '../hooks/Favoris/useRemoveFavoris';
import { useAuth } from '../config/authHeader';
import { formatEuro, getFormattedDayAndMonthYear, capitalizeFirstLetter } from '../utils/format';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export default function FavorisPage() {
    const { user } = useAuth();
    const { favoris, loading, refreshFavoris } = useFavoris();
    const { add } = useAddFavoris();
    const { remove } = useRemoveFavoris();

    const [filtered, setFiltered] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [eventFilter, setEventFilter] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleToggleFavoris = async (eventId, showToast) => {
        try {
            const isAlreadyFavori = favoris.some(f => f.id_event === eventId);

            if (isAlreadyFavori) {
                await remove(eventId);
                showToast('Événement retiré des favoris');
            } else {
                await add(eventId);
                showToast('Événement ajouté aux favoris');
            }

            await refreshFavoris();
        } catch (err) {
            showToast(err.message || 'Erreur', 'error');
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'En Cours':
            case 'Inscrit':
                return 'bg-green-100 text-green-700';
            case 'Terminé':
                return 'bg-gray-200 text-gray-700';
            case 'Annulé':
                return 'bg-red-100 text-red-700';
            case 'Refusé':
                return 'bg-red-200 text-red-800';
            case 'Planifié':
                return 'bg-blue-100 text-blue-700';
            case 'En Attente':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    useEffect(() => {
        if (!Array.isArray(favoris)) return;

        let data = [...favoris];
        if (statusFilter) data = data.filter(p => p.status === statusFilter);
        if (eventFilter) data = data.filter(p => p.title === eventFilter);
        if (searchValue) data = data.filter(p => p.title.toLowerCase().includes(searchValue.toLowerCase()));
        setFiltered(data);
    }, [statusFilter, eventFilter, searchValue, favoris]);

    const statuses = Array.isArray(favoris)
        ? [...new Set(favoris.map(p => p.status))]
        : [];

    const events = Array.isArray(favoris)
        ? [...new Set(favoris.map(p => p.title))]
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
                <Favoris
                    formatEuro={formatEuro}
                    getFormattedDayAndMonthYear={getFormattedDayAndMonthYear}
                    capitalizeFirstLetter={capitalizeFirstLetter}
                    user={user}
                    favoris={filtered} 
                    API_BASE_URL={API_BASE_URL}
                    loading={loading}
                    toggleFavoris={handleToggleFavoris}
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
                    getStatusClass={getStatusClass}
                />
            </main>
            <Footer />
        </>
    );
}