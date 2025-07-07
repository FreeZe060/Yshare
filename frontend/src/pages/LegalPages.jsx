import React from "react";
import Header from "../components/Partials/Header";
import Footer from "../components/Partials/Footer";

const Section = ({ title, children }) => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow mx-auto my-10 px-6 py-[120px] w-full max-w-4xl">
            <h2 className="mb-6 pb-2 border-b-2 border-[#D232BE] font-sans font-bold text-black text-3xl text-center">
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
            <p>
                L’édition et la direction de la publication du site https://y-share.fr est assurée par Tim Vannson,
                domicilié Pl. Sophie Laffitte Immeuble AGORA, 06560 Valbonne.<br />
                Numéro de téléphone : 0606060606<br />
                Adresse e-mail : tim.vannson@ynov.com.<br />
                L'hébergeur du site est la société Yshare, dont le siège social est situé
                à Sophia Antipolis, avec le numéro de téléphone : 06060606.
            </p>
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

            <p>
                Les présentes conditions générales d'utilisation (dites « CGU ») ont pour objet l'encadrement juridique
                des modalités de mise à disposition du site et des services par Yshare et de définir les
                conditions d’accès et d’utilisation des services par « l'Utilisateur ».
            </p>
            <p>
                Les présentes CGU sont accessibles sur le site à la rubrique « CGU ».
            </p>
            <p>
                Toute inscription ou utilisation du site implique l'acceptation sans aucune réserve ni restriction des
                présentes CGU par l’utilisateur. Lors de l'inscription sur le site via le Formulaire d’inscription, chaque
                utilisateur accepte expressément les présentes CGU en cochant la case précédant le texte suivant : «
                Je reconnais avoir lu et compris les CGU et je les accepte ».
            </p>
            <p>
                En cas de non-acceptation des CGU stipulées dans le présent contrat, l'Utilisateur se doit de
                renoncer à l'accès des services proposés par le site.
            </p>
            <p>
                https://y-share.fr se réserve le droit de modifier unilatéralement et à tout moment le contenu des
                présentes CGU.
            </p>

            <h2 className="mt-6 font-semibold text-xl">Article 1 : Les mentions légales</h2>
            <p>
                L’édition et la direction de la publication du site https://y-share.fr est assurée par Tim Vannson,
                domicilié Pl. Sophie Laffitte Immeuble AGORA, 06560 Valbonne.<br />
                Numéro de téléphone : 0606060606<br />
                Adresse e-mail : tim.vannson@ynov.com.<br />
                L'hébergeur du site est la société Yshare, dont le siège social est situé
                à Sophia Antipolis, avec le numéro de téléphone : 06060606.
            </p>

            <h2 className="mt-6 font-semibold text-xl">Article 2 : Accès au site</h2>
            <p>
                Le site https://y-share.fr permet à l'Utilisateur un accès gratuit aux services suivants :
                Réservation d'événements entre étudiants, Création de compte.
            </p>
            <p>
                Le site est accessible gratuitement en tout lieu à tout Utilisateur ayant un accès à Internet. Tous les
                frais supportés par l'Utilisateur pour accéder au service (matériel informatique, logiciels, connexion
                Internet, etc.) sont à sa charge.
            </p>
            <p>
                L’Utilisateur non membre n'a pas accès aux services réservés. Pour cela, il doit s’inscrire en
                remplissant le formulaire. En acceptant de s’inscrire aux services réservés, l’Utilisateur membre
                s’engage à fournir des informations sincères et exactes concernant son état civil et ses coordonnées,
                notamment son adresse email.
            </p>
            <p>
                Pour accéder aux services, l’Utilisateur doit ensuite s'identifier à l'aide de son identifiant et de son mot
                de passe qui lui seront communiqués après son inscription.
            </p>
            <p>
                Tout Utilisateur membre régulièrement inscrit pourra également solliciter sa désinscription en se
                rendant à la page dédiée sur son espace personnel. Celle-ci sera effective dans un délai raisonnable.
            </p>
            <p>
                Tout événement dû à un cas de force majeure ayant pour conséquence un dysfonctionnement du site
                ou serveur et sous réserve de toute interruption ou modification en cas de maintenance, n'engage
                pas la responsabilité de https://y-share.fr. Dans ces cas, l’Utilisateur accepte ainsi ne pas tenir rigueur
                à l’éditeur de toute interruption ou suspension de service, même sans préavis.
            </p>
            <p>
                L'Utilisateur a la possibilité de contacter le site par messagerie électronique à l’adresse email de
                l’éditeur communiqué à l’ARTICLE 1.
            </p>

            <h2 className="mt-6 font-semibold text-xl">Article 3 : Collecte des données</h2>
            <p>
                Le site assure à l'Utilisateur une collecte et un traitement d'informations personnelles dans le respect
                de la vie privée conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers
                et aux libertés.
            </p>
            <p>
                En vertu de cette loi, l'Utilisateur dispose d'un droit d'accès, de rectification, de suppression et
                d'opposition de ses données personnelles. L'Utilisateur exerce ce droit :
                <br />· par mail à l'adresse email tim.vannson@ynov.com
                <br />· via son espace personnel.
            </p>

            <h2 className="mt-6 font-semibold text-xl">Article 4 : Propriété intellectuelle</h2>
            <p>
                Les marques, logos, signes ainsi que tous les contenus du site (textes, images, son…) font l'objet
                d'une protection par le Code de la propriété intellectuelle.
            </p>
            <p>
                L'Utilisateur s'engage à une utilisation des contenus du site dans un cadre strictement privé. Toute
                utilisation à des fins commerciales et publicitaires est strictement interdite.
            </p>
            <p>
                Toute reproduction ou représentation, même partielle, sans autorisation, constitue une contrefaçon
                sanctionnée par l’article L 335-2 du Code de la propriété intellectuelle.
            </p>

            <h2 className="mt-6 font-semibold text-xl">Article 5 : Responsabilité</h2>
            <p>
                Le site ne garantit pas l’exactitude des informations diffusées. L’Utilisateur assume seul la responsabilité
                de l’utilisation des informations fournies.
            </p>
            <p>
                L'Utilisateur s'assure de garder son mot de passe secret. Toute divulgation est interdite. Il est
                responsable de l’usage de ses identifiants.
            </p>
            <p>
                En cas de force majeure, le site ne pourra être tenu responsable d’une interruption du service.
            </p>

            <h2 className="mt-6 font-semibold text-xl">Article 6 : Liens hypertextes</h2>
            <p>
                Des liens vers d’autres sites peuvent être présents. Le site décline toute responsabilité sur les
                contenus extérieurs.
            </p>

            <h2 className="mt-6 font-semibold text-xl">Article 7 : Cookies</h2>
            <p>
                Lors de la navigation, des cookies peuvent s’installer automatiquement sur le navigateur. L’Utilisateur
                peut refuser l’enregistrement en configurant son navigateur.
            </p>

            <h2 className="mt-6 font-semibold text-xl">Article 8 : Publication par l’Utilisateur</h2>
            <p>
                L’Utilisateur peut publier du contenu sur le site. Il garde la propriété intellectuelle de ses contenus mais
                accorde à la société éditrice un droit de diffusion, d’adaptation, et de modification. Le site se réserve
                le droit de modérer ou supprimer toute publication.
            </p>

            <h2 className="mt-6 font-semibold text-xl">Article 9 : Droit applicable et juridiction compétente</h2>
            <p>
                La législation française est applicable. En cas de litige, les tribunaux français sont seuls compétents.
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