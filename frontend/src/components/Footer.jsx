import React from 'react';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-900 text-white">
			<div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
				<nav className="flex flex-wrap justify-center -mx-5 -my-2">
					<div className="px-5 py-2">
						<a href="#" className="text-base leading-6 text-gray-400 hover:text-white">
							À propos
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="#" className="text-base leading-6 text-gray-400 hover:text-white">
							Blog
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="/team" className="text-base leading-6 text-gray-400 hover:text-white">
							Équipe
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="#" className="text-base leading-6 text-gray-400 hover:text-white">
							Tarifs
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="#" className="text-base leading-6 text-gray-400 hover:text-white">
							Contact
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="/mentions-legales" className="text-base leading-6 text-gray-400 hover:text-white">
							Mentions légales
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="/politique-confidentialite" className="text-base leading-6 text-gray-400 hover:text-white">
						Politique de confidentialité
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="/conditions-utilisation" className="text-base leading-6 text-gray-400 hover:text-white">
						CGU
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="/conditions-vente" className="text-base leading-6 text-gray-400 hover:text-white">
						CGV
						</a>
					</div>
				</nav>

				<div className="flex justify-center mt-8 space-x-6">
					<a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
						<i className="fab fa-facebook-f text-xl"></i>
					</a>
					<a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
						<i className="fab fa-instagram text-xl"></i>
					</a>
					<a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
						<i className="fab fa-twitter text-xl"></i>
					</a>
					<a href="#" className="text-gray-400 hover:text-white" aria-label="GitHub">
						<i className="fab fa-github text-xl"></i>
					</a>
					<a href="#" className="text-gray-400 hover:text-white" aria-label="Dribbble">
						<i className="fab fa-dribbble text-xl"></i>
					</a>
				</div>

				<p className="mt-8 text-base leading-6 text-center text-gray-400">
					© {currentYear} YShare, Inc. Tous droits réservés.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
