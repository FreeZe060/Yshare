import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Section = ({ title, children }) => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-4xl mx-auto py-[120px] my-10 px-6">
            <h2 className="text-3xl font-bold text-center text-black mb-6 font-sans border-b-2 border-blue-500 pb-2">
                {title}
            </h2>
            <div className="text-left space-y-4 text-gray-800 font-light leading-relaxed">
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
            <p>
                L’utilisation du site Eventics implique l’acceptation des présentes CGU. Chaque utilisateur peut créer un compte personnel, publier et gérer des événements, s’inscrire à des événements d’autres utilisateurs, interagir via les profils publics.
            </p>
            <p>
                L’utilisateur s’engage à fournir des informations exactes, à ne pas publier de contenu illégal, discriminatoire ou contraire à l’éthique, sous peine de suppression immédiate du compte.
            </p>
            <p>
                Toute tentative de fraude ou d’utilisation abusive entraînera des sanctions, jusqu’à la suppression définitive du compte et éventuelles poursuites.
            </p>
            <p>
                Eventics se réserve le droit de modifier les présentes CGU à tout moment. En cas de modification, un email sera envoyé à tous les utilisateurs.
            </p>
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