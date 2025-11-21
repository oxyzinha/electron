import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Lê código da query string da url
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      const codeVerifier = localStorage.getItem('code_verifier');

      const body = new URLSearchParams({
        client_id: 'f1b2ff544e064c419c1b435cfab400ce',
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://127.0.0.1:3000/callback',
        code_verifier: codeVerifier,
      });

      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString(),
      })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('spotify_access_token', data.access_token);
        navigate('/');
      })
      .catch(console.error);
    }
  }, [navigate]);

  return (
    <div>
      <h2>Processando login Spotify via PKCE...</h2>
    </div>
  );
}

export default Callback;
