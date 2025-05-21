import React from 'react';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-900 text-white">
			<div className="space-y-8 mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-screen-xl overflow-hidden">
				<nav className="flex flex-wrap justify-center -mx-5 -my-2">
					<div className="px-5 py-2">
						<a href="#" className="text-gray-400 hover:text-white text-base leading-6">
							À propos
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="#" className="text-gray-400 hover:text-white text-base leading-6">
							Blog
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="/team" className="text-gray-400 hover:text-white text-base leading-6">
							Équipe
						</a>
					</div>
					{/* <div className="px-5 py-2">
						<a href="#" className="text-gray-400 hover:text-white text-base leading-6">
							Tarifs
						</a>
					</div> */}
					{/* <div className="px-5 py-2">
						<a href="#" className="text-gray-400 hover:text-white text-base leading-6">
							Contact
						</a>
					</div> */}
					<div className="px-5 py-2">
						<a href="/mentions-legales" className="text-gray-400 hover:text-white text-base leading-6">
							Mentions légales
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="/politique-confidentialite" className="text-gray-400 hover:text-white text-base leading-6">
							Politique de confidentialité
						</a>
					</div>
					<div className="px-5 py-2">
						<a href="/conditions-utilisation" className="text-gray-400 hover:text-white text-base leading-6">
							CGU
						</a>
					</div>
				</nav>

				<div className="flex justify-center space-x-6 mt-8">
					<a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
						<i className="text-xl fab fa-facebook-f"></i>
					</a>
					<a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
						<i className="text-xl fab fa-instagram"></i>
					</a>
					<a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
						<i className="text-xl fab fa-twitter"></i>
					</a>
					<a href="#" className="text-gray-400 hover:text-white" aria-label="GitHub">
						<i className="text-xl fab fa-github"></i>
					</a>
					<a href="#" className="text-gray-400 hover:text-white" aria-label="Dribbble">
						<i className="text-xl fab fa-dribbble"></i>
					</a>
				</div>

				<p className="mt-8 text-gray-400 text-base text-center leading-6">
					© {currentYear} YShare, Inc. Tous droits réservés.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
