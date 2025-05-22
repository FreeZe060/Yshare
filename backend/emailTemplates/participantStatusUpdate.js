module.exports = ({ userName, eventTitle, status, organizerResponse }) => {
  return `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
    <h2 style="color: #28a745; border-bottom: 1px solid #eee; padding-bottom: 10px;">🎉 Mise à jour de votre statut</h2>
    <p style="font-size: 16px;">Bonjour <strong>${userName}</strong>,</p>
    <p style="font-size: 15px;">Votre statut pour l'événement <strong>${eventTitle}</strong> a été mis à jour :</p>

    <div style="background: #f0f0f0; padding: 15px; margin: 20px 0; border-left: 4px solid #28a745;">
      <p style="margin: 0;"><strong>🛈 Nouveau statut :</strong> ${status}</p>
      <p style="margin: 10px 0 0;"><strong>💬 Message de l'organisateur :</strong></p>
      <p style="margin: 0; font-style: italic; color: #555;">"${organizerResponse}"</p>
    </div>

    <p>Merci de consulter votre espace personnel pour plus de détails.</p>

    <hr style="margin: 30px 0;">
    <p style="font-size: 12px; color: #777;">Ceci est un message automatique. Ne pas répondre directement à cet e-mail.</p>
  </div>
  `;
};