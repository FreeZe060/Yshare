// Mock des composants et hooks - DOIT être avant tous les imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CardEvent from '../../components/Events/CardEvent';

jest.mock('../../components/Home/ParticipantAvatars', () => {
  return function MockParticipantAvatars() {
    return <div data-testid="participant-avatars">Participants</div>;
  };
});

jest.mock('../../components/Events/EventStatusTag', () => {
  return function MockEventStatusTag({ status }) {
    return <div data-testid="event-status-tag">{status}</div>;
  };
});

// Mock des utilitaires
jest.mock('../../utils/format', () => ({
  getFormattedDayAndMonthYear: (date) => ({
    day: '15',
    monthYear: 'Jan 2024'
  }),
  capitalizeFirstLetter: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  formatEuro: (price) => `${price}€`
}));

describe('CardEvent Component', () => {
  const mockEvent = {
    id: 1,
    title: 'Soirée Électro',
    start_time: '2024-01-15T20:00:00Z',
    city: 'Paris',
    street_number: '123',
    street: 'Rue de la Paix',
    price: 25,
    status: 'upcoming',
    EventImages: [
      {
        id: 1,
        image_url: '/images/event1.jpg',
        is_main: true
      }
    ]
  };

  const mockToggleFavoris = jest.fn();
  const mockIsFavoris = jest.fn();

  const renderCardEvent = (props = {}) => {
    const defaultProps = {
      event: mockEvent,
      isAuthenticated: true,
      isFavoris: mockIsFavoris,
      toggleFavoris: mockToggleFavoris,
      ...props
    };

    return render(
      <BrowserRouter>
        <CardEvent {...defaultProps} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rend le titre de l\'événement', () => {
    renderCardEvent();
    
    expect(screen.getByText('Soirée Électro')).toBeInTheDocument();
  });

  test('rend les informations de localisation', () => {
    renderCardEvent();
    
    expect(screen.getByText(/Paris, 123 Rue de la Paix/)).toBeInTheDocument();
  });

  test('rend le prix formaté', () => {
    renderCardEvent();
    
    expect(screen.getByText('25€')).toBeInTheDocument();
  });

  test('rend la date formatée', () => {
    renderCardEvent();
    
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Jan 2024')).toBeInTheDocument();
  });

  test('rend l\'image de l\'événement', () => {
    renderCardEvent();
    
    const image = screen.getByAltText('Image de l\'événement');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'http://localhost:8080/images/event1.jpg');
  });

  test('rend le bouton favoris quand l\'utilisateur est authentifié', () => {
    renderCardEvent();
    
    const heartIcon = screen.getByRole('button', { hidden: true });
    expect(heartIcon).toBeInTheDocument();
  });

  test('n\'affiche pas le bouton favoris quand l\'utilisateur n\'est pas authentifié', () => {
    renderCardEvent({ isAuthenticated: false });
    
    const heartIcon = screen.queryByRole('button', { hidden: true });
    expect(heartIcon).not.toBeInTheDocument();
  });

  test('affiche le cœur plein quand l\'événement est en favoris', () => {
    mockIsFavoris.mockReturnValue(true);
    renderCardEvent();
    
    const heartIcon = screen.getByRole('button', { hidden: true });
    expect(heartIcon).toBeInTheDocument();
  });

  test('affiche le cœur vide quand l\'événement n\'est pas en favoris', () => {
    mockIsFavoris.mockReturnValue(false);
    renderCardEvent();
    
    const heartIcon = screen.getByRole('button', { hidden: true });
    expect(heartIcon).toBeInTheDocument();
  });

  test('appelle toggleFavoris quand on clique sur le cœur', () => {
    renderCardEvent();
    
    const heartIcon = screen.getByRole('button', { hidden: true });
    fireEvent.click(heartIcon);
    
    expect(mockToggleFavoris).toHaveBeenCalledWith(1);
  });

  test('rend le lien vers les détails de l\'événement', () => {
    renderCardEvent();
    
    const eventLink = screen.getByText('Soirée Électro').closest('a');
    expect(eventLink).toHaveAttribute('href', '/event/1');
  });

  test('rend le bouton "Voir l\'événement"', () => {
    renderCardEvent();
    
    const viewButton = screen.getByText('Voir l\'événement');
    expect(viewButton).toBeInTheDocument();
    expect(viewButton.closest('a')).toHaveAttribute('href', '/event/1');
  });

  test('rend le composant ParticipantAvatars', () => {
    renderCardEvent();
    
    expect(screen.getByTestId('participant-avatars')).toBeInTheDocument();
  });

  test('rend le composant EventStatusTag', () => {
    renderCardEvent();
    
    expect(screen.getByTestId('event-status-tag')).toBeInTheDocument();
    expect(screen.getByText('upcoming')).toBeInTheDocument();
  });

  test('gère les événements sans image', () => {
    const eventWithoutImage = {
      ...mockEvent,
      EventImages: []
    };
    
    renderCardEvent({ event: eventWithoutImage });
    
    const image = screen.getByAltText('Image de l\'événement');
    expect(image).toHaveAttribute('src', 'http://localhost:8080');
  });

  test('gère les images avec URL complète', () => {
    const eventWithFullUrl = {
      ...mockEvent,
      EventImages: [
        {
          id: 1,
          image_url: 'https://example.com/image.jpg',
          is_main: true
        }
      ]
    };
    
    renderCardEvent({ event: eventWithFullUrl });
    
    const image = screen.getByAltText('Image de l\'événement');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });
}); 