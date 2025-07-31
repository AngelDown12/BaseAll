let handler = async (m, { conn, text }) => {
  let number, user;

  // Si no se proporciona texto ni se responde a alguien
  if (!text && !m.quoted) {
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  // Si hay texto, verificar si es número, mención o no válido
  if (text) {
    if (isNaN(text)) {
      if (text.includes('@')) {
        number = text.split('@')[1];
      }
    } else {
      number = text;
    }
  }

  // Validación de longitud de número
  if (number && (number.length > 13 || number.length < 11)) {
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  // Obtener el usuario en formato JID
  try {
    if (number) {
      user = number + "@s.whatsapp.net";
    } else if (m.quoted && m.quoted.sender) {
      user = m.quoted.sender;
    }
  } catch {
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  // Si no se pudo obtener el usuario
  if (!user) {
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  // Ejecutar acción de promover
  await conn.groupParticipantsUpdate(m.chat, [user], "promote");
};

handler.help = ["@usuario*"].map(v => "promote " + v);
handler.tags = ["group"];
handler.command = /^(promote|pornote|darpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;