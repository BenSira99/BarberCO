import { Appointment, StylistProfile, WhatsAppReminderTemplate } from '../types';

/**
 * Clean phone number to international WhatsApp format (e.g. +212 6 12 34 56 78 -> 212612345678, 0612345678 -> 212612345678)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if ((cleaned.startsWith('06') || cleaned.startsWith('07') || cleaned.startsWith('05')) && cleaned.length === 10) {
    // Moroccan local number 06... / 07... -> 2126... / 2127...
    cleaned = '212' + cleaned.substring(1);
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '212' + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Formats date into readable French string (ex: "lundi 28 septembre 2026")
 */
export function formatFrenchDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Replace placeholders in template text with actual appointment & stylist values
 */
export function generateReminderMessage(
  templateContent: string,
  appointment: Appointment,
  stylist: StylistProfile
): string {
  const formattedDate = formatFrenchDate(appointment.date);
  const locationDesc = appointment.locationType === 'salon'
    ? `au Salon (${stylist.address}, ${stylist.postalCode} ${stylist.city})`
    : `à votre Domicile (${appointment.address || 'votre adresse'}${appointment.addressDetails ? ' - ' + appointment.addressDetails : ''})`;

  return templateContent
    .replace(/{client_name}/g, appointment.clientName)
    .replace(/{date}/g, formattedDate)
    .replace(/{heure}/g, appointment.time)
    .replace(/{prestation}/g, appointment.serviceName)
    .replace(/{prix}/g, `${appointment.price} MAD`)
    .replace(/{lieu}/g, locationDesc)
    .replace(/{adresse}/g, appointment.address || stylist.address)
    .replace(/{salon_adresse}/g, `${stylist.address}, ${stylist.city}`)
    .replace(/{coiffeur}/g, stylist.stylistName)
    .replace(/{salon}/g, stylist.salonName)
    .replace(/{telephone}/g, stylist.phone);
}

/**
 * Builds the direct WhatsApp Web / App link
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

/**
 * Checks if an appointment is due for a reminder (e.g. within next 24-48 hours and not yet sent)
 */
export function isReminderDue(appointment: Appointment, hoursThreshold: number = 48): boolean {
  if (appointment.reminderSent || appointment.status === 'cancelled' || appointment.status === 'completed') {
    return false;
  }
  const aptDate = new Date(`${appointment.date}T${appointment.time}:00`);
  const now = new Date();
  const diffHours = (aptDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours <= hoursThreshold;
}
