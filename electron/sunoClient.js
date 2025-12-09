// electron/sunoClient.js
// Usa o fetch nativo do Node/Electron, sem node-fetch

const BASE_URL = 'https://api.sunoapi.org/api/v1';

async function generateSunoTrack(prompt, options = {}) {
  const apiKey = process.env.SUNO_API_KEY;
  console.log('SUNO_API_KEY dentro do generateSunoTrack:', apiKey ? 'OK' : 'NÃO LIDA');

  if (!apiKey) {
    throw new Error('SUNO_API_KEY não definida nas variáveis de ambiente');
  }

  const body = {
    prompt,
    callBackUrl: 'https://example.com/suno-callback', // apenas para satisfazer a API
    customMode: false,
    instrumental: false,
    model: 'V4_5ALL',
    ...options
  };

  const response = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const status = response.status;
    const text = await response.text();
    console.error('Erro Suno /generate status:', status);
    console.error('Erro Suno /generate body:', text);
    throw new Error('Erro ao criar tarefa de música na Suno');
  }

  const data = await response.json();
  console.log('Resposta Suno /generate:', JSON.stringify(data, null, 2));
  return data; // aqui deve vir um taskId ou similar
}

async function getMusicDetails(taskId) {
  const apiKey = process.env.SUNO_API_KEY;
  if (!apiKey) {
    throw new Error('SUNO_API_KEY não definida nas variáveis de ambiente');
  }

  const url = `${BASE_URL}/generate/record-info?taskId=${encodeURIComponent(taskId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    const status = response.status;
    const text = await response.text();
    console.error('Erro Suno /record-info status:', status);
    console.error('Erro Suno /record-info body:', text);
    throw new Error('Erro ao obter detalhes da música na Suno');
  }

  const data = await response.json();
  console.log('Resposta Suno /record-info:', JSON.stringify(data, null, 2));
  return data;
}

module.exports = {
  generateSunoTrack,
  getMusicDetails
};
