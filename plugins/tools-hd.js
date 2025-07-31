import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
  const quoted = m.quoted ? m.quoted : m
  const mime = quoted.mimetype || quoted.msg?.mimetype || ''

  if (!/image\/(jpe?g|png)/i.test(mime)) {
    await conn.sendMessage(m.chat, { react: { text: '❗', key: m.key } })
    return m.reply(`☁️` 𝙀𝙉𝙑𝙄𝘼 𝙊 𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙀 𝘼 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝙋𝘼𝙍𝘼 𝙈𝙀𝙅𝙊𝙍𝘼𝙍 𝙇𝘼 𝘾𝘼𝙇𝙄𝘿𝘼𝘿)
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const media = await quoted.download()
    const ext = mime.split('/')[1]
    const filename = `mejorada_${Date.now()}.${ext}`

    const form = new FormData()
    form.append('image', media, { filename, contentType: mime })
    form.append('scale', '2')

    const headers = {
      ...form.getHeaders(),
      'accept': 'application/json',
      'x-client-version': 'web',
      'x-locale': 'es'
    }

    const res = await fetch('https://api2.pixelcut.app/image/upscale/v1', {
      method: 'POST',
      headers,
      body: form
    })

    const json = await res.json()

    if (!json?.result_url || !json.result_url.startsWith('http')) {
      throw new Error('No se pudo obtener la imagen mejorada desde Pixelcut.')
    }

    const resultBuffer = await (await fetch(json.result_url)).buffer()

    await conn.sendMessage(m.chat, {
      image: resultBuffer
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply(`❌ 𝙃𝙐𝘽𝙊 𝙐𝙉 𝙀𝙍𝙍𝙊𝙍 𝙄𝙉𝙀𝙎𝙋𝙀𝙍𝘼𝘿𝙊`)
  }
}

handler.help = ['hd']
handler.tags = ['herramientas', 'imagen']
handler.command = ['hd'];

export default handler