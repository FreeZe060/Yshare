import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-900 text-white">
			<div className="space-y-8 mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-screen-xl overflow-hidden">
				<nav className="flex flex-wrap justify-center -mx-5 -my-2">
					<div className="px-5 py-2">
						<Link to="/aboutUs" className="text-gray-400 hover:text-white text-base leading-6">
							À propos
						</Link>
					</div>
					<div className="px-5 py-2">
						<Link to="/aboutUs#team" className="text-gray-400 hover:text-white text-base leading-6">
							Équipe
						</Link>
					</div>
					<div className="px-5 py-2">
						<Link to="/news" className="text-gray-400 hover:text-white text-base leading-6">
							Actu's
						</Link>
					</div>
					<div className="px-5 py-2">
						<Link to="/mentions-legales" className="text-gray-400 hover:text-white text-base leading-6">
							Mentions légales
						</Link>
					</div>
					<div className="px-5 py-2">
						<Link to="/politique-confidentialite" className="text-gray-400 hover:text-white text-base leading-6">
							Politique de confidentialité
						</Link>
					</div>
					<div className="px-5 py-2">
						<Link to="/conditions-utilisation" className="text-gray-400 hover:text-white text-base leading-6">
							CGU
						</Link>
					</div>
				</nav>

				<div className="flex justify-center space-x-6 mt-8">
					{/* <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
						<i className="text-xl fab fa-facebook-f"></i>
					</a> */}
					<a target="_blank" href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
						<i className="text-xl fab fa-instagram"></i>
					</a>
					{/* <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
						<i className="text-xl fab fa-twitter"></i>
					</a> */}
					<a target="_blank" href="https://github.com/FreeZe060/Yshare" className="text-gray-400 hover:text-white" aria-label="GitHub">
						<i className="text-xl fab fa-github"></i>
					</a>
					{/* <a href="#" className="text-gray-400 hover:text-white" aria-label="Dribbble">
						<i className="text-xl fab fa-dribbble"></i>
					</a> */}
				</div>

				<p className="mt-8 text-gray-400 text-base text-center leading-6">
					© {currentYear} YShare. Tous droits réservés.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
