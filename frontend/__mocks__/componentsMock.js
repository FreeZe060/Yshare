import React from 'react';

// Mock pour Login
export const Login = () => (
  <div data-testid="login-page">
    <h1>Page de connexion</h1>
    <form>
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" />
      <label htmlFor="password">Mot de passe</label>
      <input type="password" id="password" name="password" />
      <button type="submit">Se connecter</button>
    </form>
    <a href="/register">Pas encore de compte ?</a>
  </div>
);

// Mock pour Register
export const Register = () => (
  <div data-testid="register-page">
    <h1>Page d'inscription</h1>
    <form>
      <label htmlFor="name">Nom</label>
      <input type="text" id="name" name="name" />
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" />
      <label htmlFor="password">Mot de passe</label>
      <input type="password" id="password" name="password" />
      <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
      <input type="password" id="confirmPassword" name="confirmPassword" />
      <button type="submit">S'inscrire</button>
    </form>
    <a href="/login">Déjà un compte ?</a>
  </div>
);

// Mock pour HomePage
export const HomePage = () => (
  <div data-testid="home-page">
    <h1>Bienvenue sur Yshare</h1>
    <section>
      <h2>Événements à venir</h2>
      <div data-testid="upcoming-events"></div>
    </section>
    <section>
      <h2>Actualités</h2>
      <div data-testid="news-section"></div>
    </section>
    <a href="/events">Voir tous les événements</a>
    <a href="/news">Voir toutes les actualités</a>
  </div>
);

// Mock pour EventDetails
export const EventDetails = () => (
  <div data-testid="event-details">
    <h1>Détails de l'événement</h1>
    <div data-testid="event-info"></div>
    <div data-testid="event-comments"></div>
    <div data-testid="event-rating"></div>
  </div>
);

// Mock pour ProfilePage
export const ProfilePage = () => (
  <div data-testid="profile-page">
    <h1>Profil utilisateur</h1>
    <div data-testid="user-info"></div>
    <div data-testid="user-events"></div>
    <div data-testid="user-participations"></div>
  </div>
);

// Mock pour CreateEvent
export const CreateEvent = () => (
  <div data-testid="create-event">
    <h1>Créer un événement</h1>
    <div data-testid="event-form"></div>
  </div>
);

// Mock pour EventCard
export const EventCard = ({ event, onJoin, onLeave, onToggleFavorite }) => (
  <div data-testid="event-card">
    <h3>{event?.title || 'Titre de l\'événement'}</h3>
    <p>{event?.description || 'Description de l\'événement'}</p>
    <p>{event?.location || 'Lieu'}</p>
    <p>{event?.organizer?.name || 'Organisateur'}</p>
    <p>{event?.category?.name || 'Catégorie'}</p>
    {event?.isParticipant ? (
      <button onClick={() => onLeave?.(event.id)}>Quitter l'événement</button>
    ) : (
      <button onClick={() => onJoin?.(event.id)}>Rejoindre l'événement</button>
    )}
    <button onClick={() => onToggleFavorite?.(event.id)}>
      {event?.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    </button>
  </div>
);

// Mock pour AuthContext
export const AuthProvider = ({ children }) => (
  <div data-testid="auth-provider">{children}</div>
);

export const useAuth = () => ({
  user: null,
  isAuthenticated: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn()
}); 