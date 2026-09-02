export type MailtoDraft = {
  recipient: string;
  subject?: string;
  body?: string;
};

export function buildMailtoHref({ recipient, subject = "", body = "" }: MailtoDraft) {
  const fields: string[] = [];

  if (subject) fields.push(`subject=${encodeURIComponent(subject)}`);
  if (body) fields.push(`body=${encodeURIComponent(body)}`);

  const query = fields.length > 0 ? `?${fields.join("&")}` : "";
  return `mailto:${recipient}${query}`;
}
