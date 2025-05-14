import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Section = ({ title, children }) => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow mx-auto my-10 px-6 py-[120px] w-full max-w-4xl">
            <h2 className="mb-6 pb-2 border-b-2 border-blue-500 font-sans font-bold text-black text-3xl text-center">
                {title}
            </h2>
            <div className="space-y-4 font-light text-gray-800 text-left leading-relaxed">
                {children}
            </div>
        </main>
        <Footer />
    </div>
);

export function LegalMentions() {
    return (
        <Section title="Mentions Légales">
            <p><strong>Éditeur du site :</strong> Eventics SAS</p>
            <p><strong>SIRET :</strong> 123 456 789 00012</p>
            <p><strong>Adresse :</strong> 42 Rue des Événements, 75000 Paris, France</p>
            <p><strong>Email :</strong> contact@eventics.fr</p>
            <p><strong>Directeur de la publication :</strong> Jean Dupont</p>
            <p><strong>Hébergement :</strong> OVH – 2 Rue Kellermann, 59100 Roubaix – 1007</p>
        </Section>
    );
}

export function PrivacyPolicy() {
    return (
        <Section title="Politique de Confidentialité">
            <p>
                Ce site collecte des données personnelles lors de la création de compte, de l'inscription à des événements, ou encore des paiements. Les données collectées peuvent inclure votre nom, prénom, email, mot de passe, adresse IP, photo de profil et historique d’événements.
            </p>
            <p>
                Ces données sont utilisées exclusivement pour assurer le bon fonctionnement du site, faciliter les paiements et interactions sociales, et améliorer l’expérience utilisateur.
            </p>
            <p>
                Aucune donnée ne sera vendue à des tiers. Nous utilisons des services tiers comme Stripe ou PayPal pour les paiements, soumis à leur propre politique.
            </p>
            <p>
                Conformément au RGPD, vous disposez d’un droit d’accès, de modification et de suppression de vos données. Pour cela, contactez : rgpd@eventics.fr
            </p>
            <p>
                Les données sont conservées tant que votre compte est actif et jusqu’à 3 ans après inactivité. En cas de violation de données, vous serez notifié et la CNIL sera informée sous 72h.
            </p>
        </Section>
    );
}

export function TermsOfUse() {
    return (
        <Section title="Conditions Générales d'Utilisation (CGU)">
            <h1 className="mb-6 font-bold text-3xl">Conditions générales d'utilisation</h1>
            <p><strong>En vigueur au 14/05/2025</strong></p>
            <p>Les présentes conditions générales d'utilisation (dites « CGU ») ont pour objet l'encadrement juridique des modalités de mise à disposition du site et des services par _______________ et de définir les conditions d’accès et d’utilisation des services par « l'Utilisateur ».</p>
            <p>Les présentes CGU sont accessibles sur le site à la rubrique «CGU».</p>
            <p>Toute inscription ou utilisation du site implique l'acceptation sans aucune réserve ni restriction des présentes CGU par l’utilisateur...</p>
            <p><strong>Article 1 : Les mentions légales</strong><br />
            L’édition et la direction de la publication du site https://y-share.fr est assurée par Tim Vannson, domicilié Pl. Sophie Laffitte Immeuble AGORA, 06560 Valbonne.<br />
            Numéro de téléphone : 0606060606<br />
            Adresse e-mail : tim.vannson@ynov.com<br />
            L'hébergeur du site est la société _______________, dont le siège social est situé au _______________, avec le numéro de téléphone : _______________.</p>
            <p><strong>ARTICLE 2 : Accès au site</strong><br />
            Le site https://y-share.fr permet à l'Utilisateur un accès gratuit aux services suivants :<br />
            Réservation d'événements entre étudiants, Création de compte...</p>
            <p><strong>ARTICLE 3 : Collecte des données</strong><br />
            Le site assure à l'Utilisateur une collecte et un traitement d'informations personnelles dans le respect de la vie privée conformément à la loi n°78-17...</p>
            <p><strong>ARTICLE 4 : Propriété intellectuelle</strong><br />
            Les marques, logos, signes ainsi que tous les contenus du site (textes, images, son…) font l'objet d'une protection...</p>
            <p><strong>ARTICLE 5 : Responsabilité</strong><br />
            Les sources des informations diffusées sur le site https://y-share.fr sont réputées fiables mais le site ne garantit pas qu’il soit exempt de défauts...</p>
            <p><strong>ARTICLE 6 : Liens hypertextes</strong><br />
            Des liens hypertextes peuvent être présents sur le site...</p>
            <p><strong>ARTICLE 7 : Cookies</strong><br />
            L’Utilisateur est informé que lors de ses visites sur le site, un cookie peut s’installer automatiquement sur son logiciel de navigation...</p>
            <p><strong>ARTICLE 8 : Publication par l’Utilisateur</strong><br />
            Le site permet aux membres de publier les contenus suivants : Événements et news...</p>
            <p><strong>ARTICLE 9 : Droit applicable et juridiction compétente</strong><br />
            La législation française s'applique au présent contrat...</p>
            <p className="mt-6 text-sm text-center italic">CGU réalisées sur http://legalplace.fr/</p>
        </Section>
    );
}

export function TermsOfSale() {
    return (
        <Section title="Conditions Générales de Vente (CGV)">
            <p>
                Toute transaction sur le site implique l’acceptation des présentes CGV. Les événements payants sont proposés par des organisateurs utilisateurs ou par Eventics directement.
            </p>
            <p>
                Le paiement se fait par carte bancaire via Stripe. Les tarifs sont indiqués en euros TTC. Aucun remboursement n’est possible sauf en cas d’annulation par l’organisateur.
            </p>
            <p>
                En cas de litige, le client peut contacter notre service client à : support@eventics.fr. À défaut de résolution amiable, le litige sera soumis aux tribunaux compétents de Paris.
            </p>
            <p>
                Aucune revente non autorisée n’est tolérée. Les billets sont nominatifs sauf indication contraire de l’organisateur.
            </p>
        </Section>
    );
}