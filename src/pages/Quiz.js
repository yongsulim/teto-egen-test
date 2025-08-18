
import React, { useState } from 'react';
import { questions } from '../data/questions';

function Quiz({ onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ Teto: 0, Egen: 0 });
  const [fade, setFade] = useState(true); // for animation

  const handleAnswer = (type) => {
    setFade(false); // Start fade-out animation
    setTimeout(() => {
      const newScores = { ...scores, [type]: scores[type] + 1 };
      setScores(newScores);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setFade(true); // Start fade-in animation
      } else {
        onFinish(newScores);
      }
    }, 300); // Corresponds to CSS transition time
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={`quiz-container ${fade ? 'fade-in' : 'fade-out'}`}>
        <div className="progress-bar">
            <div style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} className="progress"></div>
        </div>
      <div className="question-counter">Q{currentQuestionIndex + 1} / {questions.length}</div>
      <h2 className="question">{currentQuestion.question}</h2>
      <div className="answers">
        {currentQuestion.answers.map((answer, index) => (
          <button key={index} onClick={() => handleAnswer(answer.type)} className="answer-button">
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;
