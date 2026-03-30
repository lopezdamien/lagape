const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prenom, nom, email, telephone, date, service, couverts, message } = req.body;

  if (!prenom || !nom || !email || !date || !service || !couverts) {
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  }

  const serviceLabel = service === 'dejeuner' ? 'Déjeuner (12h – 14h)' : 'Dîner (19h – 21h)';
  const dateFormatted = new Date(date).toLocaleDateString('fr-CH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  try {
    await resend.emails.send({
      from: 'L\'AGAPE Réservation <reservations@lagape.ch>',
      to: ['contact@lagape.ch'],
      reply_to: email,
      subject: `Demande de réservation — ${prenom} ${nom} — ${dateFormatted}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: #002b3c; padding: 32px; text-align: center;">
            <h1 style="color: #c9a96e; font-size: 1.6rem; margin: 0; letter-spacing: 0.1em;">L'AGAPE</h1>
            <p style="color: #b8c4d0; font-size: 0.85rem; margin: 8px 0 0;">Nouvelle demande de réservation</p>
          </div>
          <div style="padding: 32px; background: #ffffff; border: 1px solid #e0e0e0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 0.85rem; width: 40%;">Nom</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold;">${prenom} ${nom}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 0.85rem;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}" style="color: #002b3c;">${email}</a></td></tr>
              ${telephone ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 0.85rem;">Téléphone</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${telephone}</td></tr>` : ''}
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 0.85rem;">Date</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${dateFormatted}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 0.85rem;">Service</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${serviceLabel}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 0.85rem;">Couverts</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${couverts}</td></tr>
              ${message ? `<tr><td style="padding: 10px 0; color: #666; font-size: 0.85rem; vertical-align: top;">Message</td><td style="padding: 10px 0;">${message.replace(/\n/g, '<br>')}</td></tr>` : ''}
            </table>
          </div>
          <div style="background: #f8f8f8; padding: 20px 32px; text-align: center; font-size: 0.78rem; color: #999;">
            L'AGAPE · 11 Rue Caroline, 1227 Genève · contact@lagape.ch
          </div>
        </div>
      `
    });

    // Confirmation email to the client
    await resend.emails.send({
      from: 'L\'AGAPE <contact@lagape.ch>',
      to: [email],
      subject: `Votre demande de réservation — L'AGAPE Genève`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: #002b3c; padding: 32px; text-align: center;">
            <h1 style="color: #c9a96e; font-size: 1.6rem; margin: 0; letter-spacing: 0.1em;">L'AGAPE</h1>
            <p style="color: #b8c4d0; font-size: 0.85rem; margin: 8px 0 0;">Restaurant bistronomique à Genève</p>
          </div>
          <div style="padding: 32px; background: #ffffff; border: 1px solid #e0e0e0;">
            <p style="font-size: 1rem; margin-bottom: 20px;">Bonjour ${prenom},</p>
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">Nous avons bien reçu votre demande de réservation pour <strong>${dateFormatted}</strong> — ${serviceLabel}, pour <strong>${couverts} ${parseInt(couverts) > 1 ? 'personnes' : 'personne'}</strong>.</p>
            <p style="color: #555; line-height: 1.6; margin-bottom: 28px;">Notre équipe reviendra vers vous dans les plus brefs délais pour confirmer votre table.</p>
            <div style="background: #f9f6f0; border-left: 3px solid #c9a96e; padding: 16px 20px; margin-bottom: 28px;">
              <p style="margin: 0; font-size: 0.85rem; color: #666;">Pour toute question, contactez-nous :<br>
              <a href="tel:+41223431298" style="color: #002b3c;">+41 22 343 12 98</a> · <a href="mailto:contact@lagape.ch" style="color: #002b3c;">contact@lagape.ch</a></p>
            </div>
            <p style="color: #555; font-size: 0.9rem;">À très bientôt,<br><strong>L'équipe de L'AGAPE</strong></p>
          </div>
          <div style="background: #f8f8f8; padding: 20px 32px; text-align: center; font-size: 0.78rem; color: #999;">
            L'AGAPE · 11 Rue Caroline, 1227 Genève · <a href="https://lagape.ch" style="color: #999;">lagape.ch</a>
          </div>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Erreur lors de l\'envoi. Veuillez réessayer.' });
  }
};
