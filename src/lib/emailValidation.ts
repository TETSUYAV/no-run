// Validation d'adresses email et détection des fournisseurs d'emails temporaires / jetables

const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.biz',
  'guerrillamail.org',
  'tempmail.com',
  'temp-mail.org',
  'tempail.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'cool.fr.nf',
  'courriel.fr.nf',
  'jetable.fr.nf',
  'nospam.ze.tc',
  'nomail.xl.cx',
  'mega.zik.dj',
  'speed.1s.fr',
  'mailinator.com',
  'throwawaymail.com',
  'sharklasers.com',
  'dispostable.com',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'getairmail.com',
  'crazymailing.com',
  'burnermail.io',
  'fakeinbox.com',
  'generator.email',
  'mohmal.com',
  'inboxbear.com',
  'maildrop.cc',
  'nada.ltd',
  'getnada.com',
  'mytemp.email',
  'fakemailgenerator.com',
  'emailondeck.com',
  'dropmail.me',
  'disposablemail.com',
  'zippymail.info',
  'armyspy.com',
  'cuvox.de',
  'dayrep.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'superrito.com',
  'teleworm.us',
  'crazymailing.com',
  'chacuo.net',
  '0815.ru',
  'discard.email',
  'discardmail.com',
  'spambog.com',
]);

const EMAIL_SYNTAX_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length < 5 || email.length > 254) return false;
  return EMAIL_SYNTAX_REGEX.test(email.trim());
}

export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const domain = email.trim().toLowerCase().split('@').pop();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}
