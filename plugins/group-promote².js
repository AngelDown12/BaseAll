let handler = async (m, { conn }) => {
  const body = m.text?.trim();
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;

  // Acepta "promote" o "pornote" seguido de una mención
  if (!body || !/^(promote|pornote)\s+@/i.test(body)) {
    return;
  }

  if (!mentioned || !mentioned.length) {
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  const user = mentioned[0];

  if (!user || typeof user !== 'string' || !user.endsWith('@s.whatsapp.net')) {
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
};

handler.customPrefix = /^(promote|pornote)\s+@/i;
handler.command = new RegExp(); // Puede omitirse si usas solo customPrefix
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;