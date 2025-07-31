let handler = async (m, { conn }) => {
  const body = m.text?.trim().toLowerCase();

  // Acepta "promote" o "pornote"
  if (!['promote', 'pornote'].includes(body)) return;

  // Solo si estás respondiendo a alguien
  const user = m.quoted?.sender;
  if (!user) {
    return conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
};

handler.customPrefix = /^(promote|pornote)$/i;
handler.command = new RegExp(); // Esto se puede eliminar si solo usas customPrefix
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;