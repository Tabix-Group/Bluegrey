import axios from 'axios';

const BASE_URL = process.env.YOIZEN_BASE_URL;
const LINE_CODE = process.env.YOIZEN_LINE_CODE || process.env.YOIZEN_LINE_ID;
const TOKEN = process.env.YOIZEN_TOKEN;

// Enviar mensaje de texto por WhatsApp
export async function enviarMensajeWhatsApp(numero, mensaje) {
  const url = `${BASE_URL}/api/v1/${LINE_CODE}/message`;
  const payload = {
    to: numero,
    type: 'text',
    text: { body: mensaje }
  };
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  };
  console.log('[Yoizen] Intentando enviar:', JSON.stringify(payload), 'a', url);
  try {
    const { data } = await axios.post(url, payload, { headers });
    console.log('[Yoizen] Mensaje enviado OK:', JSON.stringify(data));
    return data;
  } catch (err) {
    console.error('[Yoizen] ERROR ENVIANDO MENSAJE:', err);
    if (err.response) {
      console.error('[Yoizen] Error respuesta:', err.response.status, JSON.stringify(err.response.data));
      console.error('[Yoizen] Error headers:', JSON.stringify(err.response.headers));
    } else if (err.request) {
      console.error('[Yoizen] Error request:', err.message, err.request);
    } else {
      console.error('[Yoizen] Error general:', err.message);
    }
    throw err;
  }
}
