import axios from 'axios';

const BASE_URL = process.env.YOIZEN_BASE_URL;
const LINE_CODE = process.env.YOIZEN_LINE_CODE;
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
  const { data } = await axios.post(url, payload, { headers });
  return data;
}
