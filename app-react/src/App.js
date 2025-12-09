import React from 'react';
import Home from './Home';
import SunoGenerator from './components/SunoGenerator'; // ou './components/suno/SunoGenerator'

function App() {
  return (
    <div>
      <Home />

      {/* Secção separada para a IA Suno */}
      <SunoGenerator />
    </div>
  );
}

export default App;
