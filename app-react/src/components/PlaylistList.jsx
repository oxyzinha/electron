import React from 'react';

function PlaylistList({ playlists, fetchTracks }) {
  return (
    <div>
      <h3>Tuas Playlists</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {playlists.map((playlist) => (
          <li key={playlist.id} style={{ marginBottom: '10px' }}>
            <button
              onClick={() => fetchTracks(playlist.id)}
              style={{ cursor: 'pointer', padding: '5px 10px' }}
            >
              {playlist.name}
            </button>
            <a
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: '8px', fontSize: 14 }}
            >
              Abrir no Spotify
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlaylistList;
