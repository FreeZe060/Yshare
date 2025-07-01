import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import usePostRate from '../../../hooks/Rating/usePostRate';

function RatingBanner({ eventId, userId, eventStatus, hasRated, isParticipant, openPopup }) {
    const [show, setShow] = useState(false);
    const { rate } = usePostRate();

    useEffect(() => {
        if (eventStatus === 'Terminé' && isParticipant && !hasRated) {
            handleRateClick(); 
        }
    }, [eventStatus, isParticipant, hasRated]);

    const handleRateClick = () => {
        Swal.fire({
            title: 'Noter l\'événement',
            html: `
                <style>
                    .star-wrapper {
                        position: relative;
                        width: 40px;
                        height: 40px;
                        display: inline-block;
                        margin: 0;
                        padding: 0;
                        cursor: pointer;
                    }
                    .star-wrapper .full-star,
                    .star-wrapper .fill-star {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        font-size: 2rem;
                        line-height: 40px;
                        text-align: center;
                        color: #d1d5db;
                        pointer-events: none;
                    }
                    .star-wrapper .fill-star {
                        color: #facc15;
                        overflow: hidden;
                        z-index: 1;
                    }
                </style>
                <div id="rating-stars" class="flex justify-center gap-0">
                    ${[0, 1, 2, 3, 4].map(i => `
                        <div class="star-wrapper" data-index="${i}">
                            <div class="full-star"><i class="fa fa-star"></i></div>
                            <div class="fill-star"><i class="fa fa-star"></i></div>
                        </div>
                    `).join('')}
                </div>
                <textarea id="message" placeholder="Laissez un commentaire (optionnel)" class="mt-4 px-3 py-2 border rounded-md w-full"></textarea>
            `,
            showCancelButton: true,
            confirmButtonText: 'Valider',
            cancelButtonText: 'Annuler',
            didOpen: () => {
                let currentRating = 0;
                const stars = Swal.getPopup().querySelectorAll('.star-wrapper');

                stars.forEach((wrapper, i) => {
                    wrapper.addEventListener('mousemove', (e) => {
                        const rect = wrapper.getBoundingClientRect();
                        const offsetX = e.clientX - rect.left;

                        const rawFraction = Math.min(1, offsetX / rect.width);
                        const step = 0.25;
                        const fraction = Math.round(rawFraction / step) * step;

                        currentRating = i + fraction;

                        stars.forEach((el, j) => {
                            const fill = el.querySelector('.fill-star');
                            if (j < i) {
                                fill.style.width = '100%';
                            } else if (j === i) {
                                fill.style.width = `${fraction * 100}%`;
                            } else {
                                fill.style.width = '0%';
                            }
                        });
                    });

                    wrapper.addEventListener('click', () => {
                        stars.forEach(el => el.setAttribute('data-locked', currentRating.toFixed(2)));
                    });

                    wrapper.addEventListener('mouseleave', () => {
                        const lockedRating = parseFloat(wrapper.getAttribute('data-locked')) || 0;
                        stars.forEach((el, j) => {
                            const fill = el.querySelector('.fill-star');
                            if (j + 1 <= lockedRating) {
                                fill.style.width = '100%';
                            } else if (j < lockedRating) {
                                fill.style.width = `${(lockedRating - j) * 100}%`;
                            } else {
                                fill.style.width = '0%';
                            }
                        });
                    });
                });
            },
            preConfirm: () => {
                const starContainer = Swal.getPopup().querySelector('.star-wrapper');
                const rating = parseFloat(starContainer?.getAttribute('data-locked'));
                const message = Swal.getPopup().querySelector('#message').value;

                if (!rating || rating < 0.25) {
                    Swal.showValidationMessage('Veuillez sélectionner une note.');
                }

                return { rating, message };
            }
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await rate({
                        id_event: eventId,
                        rating: result.value.rating,
                        message: result.value.message
                    });
                    setShow(false);
                    Swal.fire('Merci !', 'Votre avis a été enregistré.', 'success');
                } catch (err) {
                    Swal.fire('Erreur', err.message || 'Erreur serveur.', 'error');
                }
            }
        });
    };

    if (!show) return null;

    return (
        <div className="z-99 bg-gradient-to-r from-[#580FCA] to-[#F929BB] shadow-md mb-6 px-6 py-4 rounded-b-md text-white animate-fadeIn">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <p className="font-semibold text-lg">🎉 Cet événement est terminé !</p>
                    <p className="text-sm">Cliquez ici pour partager votre avis sur votre expérience.</p>
                </div>
                <button
                    onClick={handleRateClick}
                    className="bg-white hover:bg-gray-100 px-4 py-2 rounded-md font-semibold text-[#C320C0]"
                >
                    Noter maintenant
                </button>
            </div>
        </div>
    );
}

export default RatingBanner;