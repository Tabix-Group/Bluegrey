import axios from 'axios';

const BASE_URL = process.env.YOIZEN_BASE_URL;
const LINE_CODE = process.env.YOIZEN_LINE_CODE || process.env.YOIZEN_LINE_ID;
const TOKEN = process.env.YOIZEN_TOKEN;

// Enviar mensaje de texto por WhatsApp
export async function enviarMensajeWhatsApp(numero, mensaje) {
  const url = `${BASE_URL}/v2/lines/${LINE_CODE}/messages`;
  const payload = {
    to: numero,
    type: 'text',
    text: { body: mensaje }
  };
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  };
  try {
    const { data } = await axios.post(url, payload, { headers });
    console.log('[Yoizen] Mensaje enviado OK:', JSON.stringify(data));
    return data;
  } catch (err) {
    if (err.response) {
      console.error('[Yoizen] Error respuesta:', err.response.status, err.response.data);
    } else {
      console.error('[Yoizen] Error request:', err.message);
    }
    throw err;
  }
}
