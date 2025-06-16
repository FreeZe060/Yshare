exports.confirmationUser = ({ userName, eventTitle, requestMessage }) => 
    `<!DOCTYPE html>
    <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Confirmation de participation</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap');
                body {
                margin: 0;
                padding: 0;
                background: linear-gradient(to right, #f0f4f7, #eaf6f6);
                font-family: 'Rubik', sans-serif;
                }
                .container {
                max-width: 600px;
                background: #fff;
                margin: 50px auto;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 15px 25px rgba(0,0,0,0.1);
                animation: fadeSlide 0.9s ease-in-out;
                }
                h2 {
                color: #2ecc71;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
                }
                .highlight {
                background: #f6ffed;
                border-left: 5px solid #2ecc71;
                padding: 15px;
                margin: 20px 0;
                }
                .footer {
                font-size: 12px;
                color: #999;
                text-align: center;
                margin-top: 40px;
                }
                @keyframes fadeSlide {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
                }
            </style>
        </head>
            <body>
            <div class="container">
                <h2>🎟️ Confirmation de votre participation</h2>
                <p>Bonjour <strong>${userName}</strong>,</p>
                <p>Votre demande de participation à l’événement <strong>${eventTitle}</strong> a bien été enregistrée.</p>
                <div class="highlight">
                    <p><strong>Votre message :</strong></p>
                    <p>${requestMessage || 'Aucun message fourni.'}</p>
                </div>
                <p>Nous vous tiendrons informé(e) dès qu’une décision aura été prise.</p>
                <div class="footer">Ce message est généré automatiquement - YShare</div>
            </div>
        </body>
    </html>`
;

exports.notifyOrganizer = ({ organizerName, userName, eventTitle, requestMessage }) => 
    `<!DOCTYPE html>
    <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Nouvelle demande</title>
            <style>
                body { background: #f0f0f5; font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }
                .box {
                max-width: 600px;
                margin: 40px auto;
                background: #fff;
                padding: 25px;
                border-radius: 10px;
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                animation: slideIn 0.7s ease;
                }
                h2 { color: #3498db; }
                blockquote {
                background: #f9f9f9;
                border-left: 4px solid #3498db;
                padding: 10px;
                margin: 20px 0;
                font-style: italic;
                }
                .footer {
                text-align: center;
                color: #888;
                font-size: 12px;
                margin-top: 30px;
                }
                @keyframes slideIn {
                from { opacity: 0; transform: translateX(-20px); }
                to { opacity: 1; transform: translateX(0); }
                }
            </style>
        </head>
        <body>
            <div class="box">
                <h2>🔔 Nouvelle demande de participation</h2>
                <p>Bonjour <strong>${organizerName}</strong>,</p>
                <p><strong>${userName}</strong> souhaite participer à votre événement : <strong>${eventTitle}</strong>.</p>
                <blockquote>${requestMessage || 'Aucun message.'}</blockquote>
                <p>Merci de valider ou refuser cette demande depuis votre interface.</p>
                <div class="footer">Email automatique - YShare</div>
            </div>
        </body>
    </html>`
;

exports.inviteGuest = ({ guestFirstName, userName, eventTitle, city, startDate }) => 
    `<!DOCTYPE html>
    <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Invitation à un événement</title>
            <style>
                body { font-family: 'Verdana', sans-serif; background: #eaf0f1; margin: 0; padding: 0; }
                .invitation {
                max-width: 600px;
                background: #fff;
                margin: 50px auto;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.08);
                animation: zoomIn 0.6s ease-in-out;
                }
                h1 { color: #34495e; font-size: 22px; }
                .details {
                background: #f3faff;
                padding: 15px;
                border-left: 5px solid #2980b9;
                margin: 20px 0;
                }
                .footer {
                font-size: 12px;
                text-align: center;
                color: #aaa;
                margin-top: 20px;
                }
                @keyframes zoomIn {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
                }
            </style>
        </head>
        <body>
            <div class="invitation">
                <h1>🎉 Vous êtes invité(e) !</h1>
                <p>Bonjour <strong>${guestFirstName}</strong>,</p>
                <p><strong>${userName}</strong> vous a ajouté comme invité(e) à l’événement :</p>
                <div class="details">
                    <p><strong>🎫 Titre :</strong> ${eventTitle}</p>
                    <p><strong>📍 Lieu :</strong> ${city}</p>
                    <p><strong>🕒 Date :</strong> ${startDate}</p>
                </div>
                <p>Vous n'avez rien à faire. À très bientôt !</p>
                <div class="footer">YShare - Email automatique</div>
            </div>
        </body>
    </html>`
;