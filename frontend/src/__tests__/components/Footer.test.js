// Mock pour react-router-dom - DOIT être avant tous les imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../components/Partials/Footer';



describe('Footer Component', () => {
  const renderFooter = () => {
    return render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
  };

  test('rend le footer avec le texte de copyright', () => {
    renderFooter();
    
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(`© ${currentYear} YShare. Tous droits réservés.`);
    
    expect(copyrightText).toBeInTheDocument();
  });

  test('contient tous les liens de navigation', () => {
    renderFooter();
    
    // Vérifier que tous les liens de navigation sont présents
    expect(screen.getByText('À propos')).toBeInTheDocument();
    expect(screen.getByText('Équipe')).toBeInTheDocument();
    expect(screen.getByText("Actu's")).toBeInTheDocument();
    expect(screen.getByText('Mentions légales')).toBeInTheDocument();
    expect(screen.getByText('Politique de confidentialité')).toBeInTheDocument();
    expect(screen.getByText('CGU')).toBeInTheDocument();
  });

  test('contient les liens vers les réseaux sociaux', () => {
    renderFooter();
    
    // Vérifier que les icônes des réseaux sociaux sont présentes
    const socialLinks = screen.getAllByRole('link');
    const socialIcons = socialLinks.filter(link => 
      link.getAttribute('aria-label') && 
      ['Facebook', 'Instagram', 'Twitter', 'GitHub', 'Dribbble'].includes(link.getAttribute('aria-label'))
    );
    
    expect(socialIcons).toHaveLength(5);
  });

  test('a la structure HTML correcte', () => {
    renderFooter();
    
    // Vérifier que le footer a la classe CSS correcte
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-gray-900', 'text-white');
  });

  test('les liens ont les bonnes destinations', () => {
    renderFooter();
    
    // Vérifier que les liens pointent vers les bonnes URLs
    const aboutLink = screen.getByText('À propos').closest('a');
    expect(aboutLink).toHaveAttribute('href', '/aboutUs');
    
    const teamLink = screen.getByText('Équipe').closest('a');
    expect(teamLink).toHaveAttribute('href', '/aboutUs#team');
    
    const newsLink = screen.getByText("Actu's").closest('a');
    expect(newsLink).toHaveAttribute('href', '/news');
  });

  test('affiche l\'année courante dans le copyright', () => {
    renderFooter();
    
    const currentYear = new Date().getFullYear();
    const copyrightElement = screen.getByText(/© \d{4} YShare/);
    
    expect(copyrightElement.textContent).toContain(currentYear.toString());
  });
}); 