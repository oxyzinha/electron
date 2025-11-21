import React, { useEffect, useState } from 'react';
import OnboardingIA from './components/OnboardingIA';

// Funções localStorage para guardar/obter histórico de playlists para tarefas
function saveUserPlaylistForTask(task, playlistUri) {
  const data = JSON.parse(localStorage.getItem('taskPlaylistMap') || '{}');
  data[task] = playlistUri;
  localStorage.setItem('taskPlaylistMap', JSON.stringify(data));
}

function getUserPlaylistForTask(task) {
  const data = JSON.parse(localStorage.getItem('taskPlaylistMap') || '{}');
  return data[task] || null;
}

function Home() {
  const [preferences, setPreferences] = useState(null);
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [mood, setMood] = useState('');
  const [suggestedPlaylist, setSuggestedPlaylist] = useState(null);
  const [token, setToken] = useState(null);
  const [iaMsg, setIaMsg] = useState(""); // Mensagem IA dinâmica

  // Fetch dados do Spotify e preferências locais
  useEffect(() => {
    const savedPrefs = localStorage.getItem('user_preferences');
    if (savedPrefs) setPreferences(JSON.parse(savedPrefs));

    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) return;
    setToken(accessToken);

    // Buscar perfil
    fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: 'Bearer ' + accessToken }
    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(console.error);

    // Buscar playlists
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: 'Bearer ' + accessToken }
    })
      .then(res => res.json())
      .then(data => setPlaylists(data.items || []))
      .catch(console.error);
  }, []);

  // IPC Listener: muda mood automaticamente quando Electron deteta tarefa/contexto
  useEffect(() => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.on('task-changed', (event, task) => {
        handleMoodSelect(task);
        setIaMsg(`A IA detetou que mudaste de tarefa para "${task}" e atualizou tuas recomendações!`);
      });
    }
    // eslint-disable-next-line
  }, [playlists, preferences]);

  // Buscar faixas de playlist selecionada
  function fetchTracks(playlistId) {
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setTracks(data.items || []))
      .catch(console.error);
  }

  // Lógica IA: recomenda/guarda playlist por tarefa (manual ou automática)
  function handleMoodSelect(moodValue) {
    setMood(moodValue);
    setIaMsg(""); // Limpa mensagem anterior
    if (!moodValue) {
      setSuggestedPlaylist(null);
      setTracks([]);
      return;
    }

    // 1. Tenta sugerir do histórico local
    const savedPlaylistUri = getUserPlaylistForTask(moodValue);
    if (savedPlaylistUri) {
      const pl = playlists.find(p => p.uri === savedPlaylistUri);
      if (pl) {
        setSuggestedPlaylist(pl);
        fetchTracks(pl.id);
        setIaMsg(`A IA sugeriu a playlist "${pl.name}" porque já usaste para ${moodValue}.`);
        return;
      }
    }

    // 2. Se não existir histórico, escolhe playlist pelo gosto/mood inicial
    if (preferences) {
      const found = playlists.find(pl =>
        pl.name.toLowerCase().includes(moodValue.toLowerCase()) ||
        pl.name.toLowerCase().includes(preferences.styles.toLowerCase())
      );
      if (found) {
        setSuggestedPlaylist(found);
        fetchTracks(found.id);
        saveUserPlaylistForTask(moodValue, found.uri);
        setIaMsg(`A IA selecionou "${found.name}" com base no teu gosto principal para ${moodValue}.`);
      } else {
        setSuggestedPlaylist(null);
        setTracks([]);
        setIaMsg("A IA não encontrou uma playlist perfeita, mas vai aprender mais com o tempo!");
      }
    }
  }

  return (
    !preferences ? (
      <OnboardingIA onFinish={setPreferences} />
    ) : (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <h1>FocusBeat</h1>

        {profile && (
          <div>
            <h2>Olá, {profile.display_name}</h2>
            {profile.images && profile.images.length > 0 && (
              <img
                src={profile.images[0].url}
                alt="Profile"
                width="150"
                style={{ borderRadius: '50%' }}
              />
            )}
            <p>{profile.email}</p>
          </div>
        )}

        {/* Seleção mood (manual, além de automática via Electron) */}
        <div style={{ marginTop: 30 }}>
          <h3>Escolhe a tua tarefa/mood</h3>
          <select onChange={e => handleMoodSelect(e.target.value)} defaultValue="">
            <option value="" disabled>Escolha...</option>
            <option value="estudo">Estudo</option>
            <option value="foco">Foco</option>
            <option value="relax">Relax</option>
            <option value="trap">Trap</option>
            <option value="pop">Pop</option>
            <option value="happy">Happy</option>
          </select>
        </div>

        {/* BLOCO VISUAL de mensagem IA dinâmica */}
        {iaMsg && (
          <div style={{ margin: "20px auto 0 auto", color: "#633bce", background: "#efe7ff", borderRadius: 8, padding: 8, maxWidth: 430 }}>
            <b>🤖 IA:</b> {iaMsg}
          </div>
        )}

        {/* Recomendações IA com feedback */}
        {suggestedPlaylist && (
          <div style={{
            marginTop: 15,
            border: "2px solid #7744ff",
            borderRadius: 8,
            background: "#f7f3ff",
            padding: 12,
            boxShadow: "0 0 8px #c3bcfd",
            maxWidth: 400,
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            <strong>💡 Sugestão da IA para "{mood}":</strong>
            <br />
            <span style={{ fontWeight: "bold" }}>{suggestedPlaylist.name}</span>
            <br />
            <a href={suggestedPlaylist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              Abrir playlist no Spotify
            </a>
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => {
                  alert("Obrigado pelo feedback! A IA vai aprender com as tuas escolhas.");
                }}
                style={{ background: "#8bfc79", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}
              >
                Gostei 👍
              </button>
              <button
                onClick={() => {
                  alert("Vamos tentar outras sugestões! O sistema vai adaptar.");
                }}
                style={{ marginLeft: 10, background: "#ffbaba", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}
              >
                Não gostei 👎
              </button>
            </div>
          </div>
        )}

        {/* Playlists do usuário */}
        <div style={{ marginTop: 30 }}>
          <h3>Tuas Playlists</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {playlists.map(pl => (
              <li key={pl.id} style={{ marginBottom: 8 }}>
                <button onClick={() => fetchTracks(pl.id)} style={{ cursor: 'pointer', padding: 5 }}>
                  {pl.name}
                </button>{' '}
                <a href={pl.external_urls.spotify} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 6 }}>
                  Abrir no Spotify
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Faixas da playlist */}
        {tracks.length > 0 && (
          <div>
            <h3>Faixas</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {tracks.map(i => (
                <li key={i.track.id} style={{ marginBottom: 5 }}>
                  {i.track.name} - {i.track.artists[0].name}{' '}
                  <a href={i.track.external_urls.spotify} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 6 }}>
                    Ouvir no Spotify
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* INSIGHTS DA IA */}
        <div style={{
          marginTop: 50,
          background: "#e6f5ff",
          padding: 20,
          borderRadius: 8,
          maxWidth: 500,
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "0 0 8px #bbcafd"
        }}>
          <h3>🧠 O que a IA aprendeu sobre ti:</h3>
          <ul style={{ textAlign: 'left', margin: "0 auto", width: "fit-content", paddingLeft: 0 }}>
            <li>Para <b>estudo</b>: {getUserPlaylistForTask("estudo") ? "Preferes a playlist " + (playlists.find(p => p.uri === getUserPlaylistForTask("estudo"))?.name || "customizada") : preferences?.styles || "Gosta de descobrir novos estilos"}.</li>
            <li>Para <b>foco</b>: {getUserPlaylistForTask("foco") ? "Preferes " + (playlists.find(p => p.uri === getUserPlaylistForTask("foco"))?.name || "customizada") : preferences?.styles || "A IA ainda está a aprender"}.</li>
            <li>Para <b>relax</b>: {getUserPlaylistForTask("relax") ? "Usa geralmente " + (playlists.find(p => p.uri === getUserPlaylistForTask("relax"))?.name || "customizada") : preferences?.styles || "Gosta de experimentar"}.</li>
          </ul>
          <div style={{ marginTop: 10, fontStyle: "italic", color: "#4f4fba" }}>
            Este painel será atualizado à medida que vais usando o FocusBeat!
          </div>
        </div>
      </div>
    )
  );
}

export default Home;
