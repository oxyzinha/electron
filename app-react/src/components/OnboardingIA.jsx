import React, { useState } from 'react';

function OnboardingIA({ onFinish }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  // Perguntas base do onboarding
  const questions = [
    { key: "styles", question: "Quais os teus estilos favoritos de música?" },
    { key: "artists", question: "Queres partilhar algum artista favorito?" },
    { key: "moments", question: "Quando preferes ouvir música: a relaxar, a estudar, a caminhar?" }
  ];

  // Fluxo IA: adaptar perguntas consoante respostas (simples, podes evoluir lógica)
  function handleAnswer(value) {
    const newAnswers = { ...answers, [questions[step].key]: value };

    // Exemplo IA: se o utilizador disser "não sei" para estilos, pergunta de novo com exemplo
    if (
      step === 0 &&
      (!value || value.trim().length < 2 || value.toLowerCase().includes("não sei"))
    ) {
      alert("Podes responder com géneros como pop, rock, hip-hop, eletrónica...");
      return;
    }

    setAnswers(newAnswers);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      localStorage.setItem('user_preferences', JSON.stringify(newAnswers));
      onFinish(newAnswers);
    }
  }

  return (
    <div style={{ marginTop: 60 }}>
      <h2>Configura o teu FocusBeat!</h2>
      <label>{questions[step].question}</label>
      <br />
      <input
        type="text"
        autoFocus
        onKeyDown={e => {
          if (e.key === "Enter") handleAnswer(e.target.value);
        }}
        id="userInput"
      />
      <br /><br />
      <button
        onClick={() => handleAnswer(document.getElementById('userInput').value)}
      >
        Seguinte
      </button>
    </div>
  );
}

export default OnboardingIA;
