import React, { useState } from 'react';

function SunoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const pollIntervalMs = 5000; // 5 segundos

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setAudioUrl(null);
      setStatusMsg('A criar tarefa na Suno...');

      // 1) Criar tarefa de geração
      const generateResult = await window.suno.generate(prompt, {});
      console.log('Resultado Suno generate:', generateResult);

      const taskId =
        generateResult.taskId ||
        generateResult.id ||
        generateResult.data?.taskId;

      if (!taskId) {
        alert('Não foi possível obter o taskId da Suno. Vê o console.');
        setLoading(false);
        return;
      }

      setStatusMsg('Música a ser gerada... isto pode demorar alguns segundos.');

      // 2) Polling para buscar detalhes até ter URL
      const checkStatus = async () => {
        try {
          const details = await window.suno.getDetails(taskId);
          console.log('Detalhes Suno:', details);

          const sunoDataArray = details.data?.response?.sunoData || [];
          const firstItem = sunoDataArray[0];
          const url = firstItem?.audioUrl; // URL do áudio

          const state =
            details.data?.status ||
            details.state ||
            details.status;

          if (url) {
            setAudioUrl(url);
            setStatusMsg('Música pronta!');
            setLoading(false);
            return;
          }

          if (state === 'FAILED' || state === 'ERROR') {
            alert('A geração da música falhou. Vê o console.');
            setLoading(false);
            return;
          }

          // Se ainda não estiver pronta, volta a tentar
          setTimeout(checkStatus, pollIntervalMs);
        } catch (err) {
          console.error('Erro ao obter detalhes da Suno:', err);
          alert('Erro ao obter detalhes da música na Suno.');
          setLoading(false);
        }
      };

      // começa o polling
      setTimeout(checkStatus, pollIntervalMs);
    } catch (err) {
      console.error(err);
      alert('Erro ao criar a tarefa de música na Suno.');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #444', marginTop: '1rem' }}>
      <h2>Gerar música com IA (Suno)</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ex.: trap calmo com voz feminina para estudar"
        rows={3}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <button onClick={handleGenerate} disabled={loading || !prompt}>
        {loading ? 'A gerar…' : 'Gerar música'}
      </button>

      {statusMsg && (
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{statusMsg}</p>
      )}

      {audioUrl && (
        <audio
          controls
          src={audioUrl}
          style={{ display: 'block', marginTop: '1rem', width: '100%' }}
        />
      )}
    </div>
  );
}

export default SunoGenerator;
