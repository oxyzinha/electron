import React from 'react';

function MoodSelector({ onSelectMood }) {
  return (
    <div style={{ marginTop: '35px' }}>
      <h3>Escolhe o teu estado/tarefa</h3>
      <select onChange={e => onSelectMood(e.target.value)} defaultValue="">
        <option value="" disabled>Selecione...</option>
        <option value="foco">Foco</option>
        <option value="relax">Relax</option>
        <option value="estudo">Estudo</option>
        <option value="happy">Happy</option>
        <option value="pop">Pop</option>
      </select>
    </div>
  );
}

export default MoodSelector;
