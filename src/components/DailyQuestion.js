import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";

function DailyQuestion() {
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  useEffect(() => {
    const lastAnsweredTimestamp = localStorage.getItem('daily_question_timestamp');
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (lastAnsweredTimestamp && (Date.now() - lastAnsweredTimestamp < twentyFourHours)) {
      setAnswered(true);
      return;
    }

    const fetchDailyQuestion = async () => {
      const answeredQuestions = JSON.parse(localStorage.getItem('answered_daily_questions')) || [];
      const querySnapshot = await getDocs(collection(db, "daily_questions"));
      const allQuestions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const unansweredQuestions = allQuestions.filter(q => !answeredQuestions.includes(q.id));

      if (unansweredQuestions.length > 0) {
        const randomQuestion = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
        setDailyQuestion(randomQuestion);
      } else {
        setAllQuestionsAnswered(true);
        console.log("All daily questions have been answered.");
      }
    };

    fetchDailyQuestion();
  }, []);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    localStorage.setItem('daily_question_timestamp', Date.now());
    
    const answeredQuestions = JSON.parse(localStorage.getItem('answered_daily_questions')) || [];
    answeredQuestions.push(dailyQuestion.id);
    localStorage.setItem('answered_daily_questions', JSON.stringify(answeredQuestions));

    setAnswered(true);
  };

  if (allQuestionsAnswered) {
    return <p>모든 일일 질문에 답변하셨습니다! 내일 새로운 질문을 기대해주세요.</p>;
  }

  if (answered && !showResult) {
    return <p>오늘의 질문에 이미 답변했습니다. 내일 다시 만나요!</p>;
  }

  if (!dailyQuestion) {
    return null; // Or a loading indicator
  }

  return (
    <div className="daily-question-container">
      <h3>오늘의 질문</h3>
      <p>{dailyQuestion.question}</p>
      {showResult ? (
        <div>
          <p>A: {dailyQuestion.optionA_result}</p>
          <p>B: {dailyQuestion.optionB_result}</p>
        </div>
      ) : (
        <div className="answers">
          <button onClick={() => handleAnswer(dailyQuestion.optionA)}>{dailyQuestion.optionA}</button>
          <button onClick={() => handleAnswer(dailyQuestion.optionB)}>{dailyQuestion.optionB}</button>
        </div>
      )}
    </div>
  );
}

export default DailyQuestion;
