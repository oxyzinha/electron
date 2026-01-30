// home.jsx V8 - SPOTIFY LAYOUT REVISADO COM SIDEBAR FIXA E SUNO NO TOPO
import React, { useState, useEffect } from 'react';
import './App.css';


function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentApp, setCurrentApp] = useState('focusbeat');
  const [playlists, setPlaylists] = useState([]);
  const [recommendedPlaylists, setRecommendedPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [token, setToken] = useState(null);
  const [iaMsg, setIaMsg] = useState('');

  // Carrega dados
  useEffect(() => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (accessToken) setToken(accessToken);

    // Fake playlists para demo
    setPlaylists([
      { id: '1', name: 'Minhas Favoritas', uri: 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M' },
      { id: '2', name: 'Trap Brasil', uri: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd' },
      { id: '3', name: 'Foco Diário', uri: 'spotify:playlist:37i9dQZF1DX4sWSpwq3LiO' },
    ]);

    setRecommendedPlaylists([
      { id: '4', name: 'Descobertas da Semana', cover: 'https://i.scdn.co/image/ab67616d00001e02d3e4f5g6h7i8j9k0l1m2n3o4p' },
      { id: '5', name: 'Novidades Pop', cover: 'https://i.scdn.co/image/ab6761610000e5ebm1n2o3p4q5r6s7t8u9v0w1x2' },
      { id: '6', name: 'Chill Hits', cover: 'https://i.scdn.co/image/ab6761610000e5eby3z4a5b6c7d8e9f0g1h2i3j4' },
    ]);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const selectPlaylist = (playlist) => {
    setTracks([]);
    setIaMsg(`Carregando ${playlist.name}...`);
    setTimeout(() => {
      setTracks([
        { name: 'Música 1', artist: 'Artista 1', duration: '3:24' },
        { name: 'Música 2', artist: 'Artista 2', duration: '2:58' },
      ]);
      setIaMsg('');
    }, 800);
  };

  const toggleApp = (app) => {
    setCurrentApp(app);
  };

  return (
    <div className="app-layout">
      {/* HEADER */}
      <header className="app-header">
        <div className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="O que queres ouvir?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '24px', cursor: 'pointer' }}>👤</div>
      </header>

      {/* SIDEBAR FIXA À ESQUERDA */}
      <aside className={`sidebar-left ${sidebarOpen ? '' : 'closed'}`}>
        <div className="sidebar-logo">Minhas Playlists</div>
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="playlist-item"
            onClick={() => selectPlaylist(playlist)}
          >
            {playlist.name}
          </div>
        ))}
      </aside>

      {/* SUNO MAIN PANEL - SÓ QUANDO ATIVO */}
      {currentApp === 'suno' && (
        <div className="suno-main-panel">
          <h2 className="suno-title">✨ Gerar Música IA</h2>
          <textarea
            className="suno-prompt"
            placeholder="Descreve tua música perfeita...&#10;Ex: 'trap suave com piano, relaxante para estudo'"
            rows="4"
          />
          <button className="suno-generate">Gerar com IA</button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="main-grid">
          {/* RECOMENDADAS */}
          <section className="recommended-section">
            <h2 className="section-title">Para ti</h2>
            <div className="playlist-grid">
              {recommendedPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="playlist-card"
                  onClick={() => selectPlaylist(playlist)}
                >
                  <div
                    className="playlist-cover-small"
                    style={{
                      backgroundImage: `url(${playlist.cover})`,
                      backgroundColor: '#181818'
                    }}
                  />
                  <h3 className="playlist-name">{playlist.name}</h3>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* TRACKS LIST */}
        {tracks.length > 0 && (
          <section style={{ marginTop: '40px' }}>
            <h2 className="section-title">Agora Tocando</h2>
            <div className="tracks-list">
              {tracks.map((track, index) => (
                <div key={index} className="track-row">
                  <span className="track-number">{index + 1}</span>
                  <div>
                    <div className="track-title">{track.name}</div>
                    <div className="track-artist">{track.artist}</div>
                  </div>
                  <span className="track-duration">{track.duration}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* IA MSG */}
        {iaMsg && (
          <div style={{ marginTop: '20px', padding: '16px', background: '#181818', borderRadius: '8px', color: '#1db954' }}>
            {iaMsg}
          </div>
        )}
      </main>

      {/* PLAYER FULL WIDTH */}
      <footer className="player-bar">
        <div className="player-left">
          <div
            className="player-cover"
            style={{ backgroundImage: 'url(https://i.scdn.co/image/ab67616d00001e02d3e4f5g6h7i8j9k0l1m2n3o4p)' }}
          />
          <div className="track-info">
            <h3>{tracks[0]?.name || 'Seleciona uma playlist'}</h3>
            <div className="track-artist">{tracks[0]?.artist || 'Artista'}</div>
          </div>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button className="player-btn">⏮</button>
            <button className="player-btn play-pause">⏸</button>
            <button className="player-btn">⏭</button>
          </div>
          <div className="progress-container">
            <span className="time-display">1:23</span>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="time-display">3:45</span>
          </div>
        </div>

        <div className="player-right">
          <button className="player-btn">🔈</button>
          <button className="player-btn">📱</button>
          <button className="player-btn">♥</button>
          <button className="player-btn">⬜</button>
        </div>
      </footer>

      {/* OVERLAY MENU APPS - PARA TROCA ENTRE APPS */}
      <div
        className={`overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="apps-menu">
          <div
            className="app-option"
            onClick={(e) => {
              e.stopPropagation();
              toggleApp('focusbeat');
              setSidebarOpen(false);
            }}
          >
            <div className="app-icon">🎧</div>
            <div className="app-title">FocusBeat</div>
            <div className="app-desc">Música inteligente para foco e produtividade</div>
          </div>
          <div
            className="app-option"
            onClick={(e) => {
              e.stopPropagation();
              toggleApp('suno');
              setSidebarOpen(false);
            }}
          >
            <div className="app-icon">✨</div>
            <div className="app-title">Suno AI</div>
            <div className="app-desc">Gerador de músicas por IA</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
