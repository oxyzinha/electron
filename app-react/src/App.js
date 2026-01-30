import React from 'react';
import Home from './Home';
import SunoGenerator from './components/SunoGenerator';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">FocusBeat</div>

        <nav className="sidebar-nav">
          <button className="sidebar-btn">Dashboard</button>
          <button className="sidebar-btn">Gerador Suno</button>
          {/* depois podemos ligar estes botões a navegação real */}
        </nav>
      </aside>

      <main className="main-content">
        <Home />

        <section className="suno-panel">
          <SunoGenerator />
        </section>
      </main>
    </div>
  );
}

export default App;