module.exports = ({ userName, eventTitle }) => {
    return `
        <!DOCTYPE html>
        <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Retrait de l'événement</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

                    body {
                        font-family: 'Poppins', sans-serif;
                        background: #f5f7fa;
                        margin: 0;
                        padding: 0;
                    }

                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background: #ffffff;
                        border-radius: 10px;
                        padding: 30px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        animation: fadeIn 0.8s ease-in-out;
                    }

                    h2 {
                        color: #e63946;
                        margin-bottom: 10px;
                        font-size: 24px;
                    }

                    p {
                        font-size: 16px;
                        color: #333;
                        line-height: 1.6;
                    }

                    .note {
                        margin-top: 30px;
                        font-size: 13px;
                        color: #888;
                        text-align: center;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    @media screen and (max-width: 600px) {
                        .container {
                        padding: 20px;
                        }

                        h2 {
                        font-size: 20px;
                        }

                        p {
                        font-size: 15px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🚫 Retrait de l'événement</h2>
                    <p>Bonjour <strong>${userName}</strong>,</p>
                    <p>Vous avez été retiré de l'événement <strong>${eventTitle}</strong>.</p>
                    <p>Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez en discuter, vous pouvez contacter l'organisateur.</p>

                    <div class="note">
                        Ceci est un message automatique. Merci de ne pas répondre à cet e-mail.
                    </div>
                </div>
            </body>
        </html>
    `;
};
