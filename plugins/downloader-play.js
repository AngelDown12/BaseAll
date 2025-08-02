import fetch from "node-fetch";
import yts from "yt-search";

// Lista de APIs para descargar el audio
const APIS = [
  {
    name: "vreden",
    url: (videoUrl) => `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}&quality=64`,
    extract: (data) => data?.result?.download?.url
  },
  {
    name: "zenkey",
    url: (videoUrl) => `https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${encodeURIComponent(videoUrl)}&quality=64`,
    extract: (data) => data?.result?.download?.url
  }
];

const getAudioUrl = async (videoUrl) => {
  for (const api of APIS) {
    try {
      const res = await fetch(api.url(videoUrl), { timeout: 5000 });
      if (!res.ok) continue;
      const data = await res.json();
      const url = await api.extract(data);
      if (url) return url;
    } catch { continue; }
  }
  throw new Error("Todas las APIs fallaron");
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `⭐ Envía el nombre de la canción\n\nEjemplo: ${usedPrefix + command} Bad Bunny - Monaco`;

  await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  const { videos } = await yts(text);
  const video = videos[0];
  if (!video) throw "❌ No se encontró el video";
  if (video.seconds > 600) throw "❌ El audio es muy largo (máximo 10 minutos)";

  // ▶️ Mensaje estilo imagen (como en la captura)
  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption: `🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author.name}
⏱ *Duración:* ${video.timestamp}
👀 *Vistas:* ${video.views.toLocaleString()}
📅 *Publicado:* ${video.ago || "-"}
🌐 *Enlace:* ${video.url}`
  }, { quoted: m });

  // 🎧 Descargar y mandar audio
  const audioUrl = await getAudioUrl(video.url);
  await conn.sendMessage(m.chat, {
    audio: { url: audioUrl },
    mimetype: "audio/mpeg",
    fileName: `${video.title.slice(0, 30)}.mp3`.replace(/[^\w\s.-]/gi, ''),
    ptt: false
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
};

handler.command = ['play'];
handler.exp = 0;
export default handler;