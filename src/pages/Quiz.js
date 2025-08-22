
import React, { useState, useEffect } from 'react';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

function Quiz({ onFinish, questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ Teto: 0, Egen: 0 });
  const [mbtiScores, setMbtiScores] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  const [fade, setFade] = useState(true); // for animation

  useEffect(() => {
    if (questions.length > 0) {
      logEvent(analytics, 'screen_view', {
        screen_name: `quiz_question_${currentQuestionIndex + 1}`
      });
    }
  }, [currentQuestionIndex, questions.length]);

  const handleAnswer = (answer) => {
    setFade(false); // Start fade-out animation
    setTimeout(() => {
      // Update Teto/Egen score
      const newScores = { ...scores, [answer.type]: scores[answer.type] + 1 };
      setScores(newScores);

      // Update MBTI score
      const newMbtiScores = { ...mbtiScores, [answer.mbti]: mbtiScores[answer.mbti] + 1 };
      setMbtiScores(newMbtiScores);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setFade(true); // Start fade-in animation
      } else {
        // Determine final MBTI type
        const finalMbti = 
          (newMbtiScores.E > newMbtiScores.I ? 'E' : 'I') +
          (newMbtiScores.S > newMbtiScores.N ? 'S' : 'N') +
          (newMbtiScores.T > newMbtiScores.F ? 'T' : 'F') +
          (newMbtiScores.J > newMbtiScores.P ? 'J' : 'P');
        
        onFinish({ scores: newScores, mbti: finalMbti });
      }
    }, 300); // Corresponds to CSS transition time
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionCount = questions.length;

  return (
    <div className={`quiz-container ${fade ? 'fade-in' : 'fade-out'}`}>
        <div className="progress-bar">
            <div style={{ width: `${((currentQuestionIndex + 1) / questionCount) * 100}%` }} className="progress"></div>
        </div>
      <div className="question-counter">Q{currentQuestionIndex + 1} / {questionCount}</div>
      <h2 className="question">{currentQuestion.question}</h2>
      <div className="answers">
        {currentQuestion.answers.map((answer, index) => (
          <button key={index} onClick={() => handleAnswer(answer)} className="answer-button">
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;
