
import React, { useState } from 'react';
import Start from './pages/Start';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import AdBanner from './components/AdBanner';
import FullScreenAd from './components/FullScreenAd';
import './App.css';

function App() {
  const [page, setPage] = useState('start'); // 'start', 'quiz', 'result'
  const [scores, setScores] = useState({ Teto: 0, Egen: 0 });
  const [adState, setAdState] = useState('pre-test'); // 'pre-test', 'post-test', null
  const [gender, setGender] = useState(null); // null, 'male', 'female'

  const handleStart = () => {
    if (!gender) {
      alert('성별을 선택해주세요!');
      return;
    }
    setPage('quiz');
  };

  const handleQuizFinish = (finalScores) => {
    setScores(finalScores);
    setAdState('post-test'); // Show ad before showing result
  };

  const handleRestart = () => {
    setScores({ Teto: 0, Egen: 0 });
    setGender(null);
    setPage('start');
    setAdState('pre-test'); // Show ad before next start
  }

  const handleAdClose = () => {
    if (adState === 'pre-test') {
      setAdState(null);
    } else if (adState === 'post-test') {
      setAdState(null);
      setPage('result');
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'quiz':
        return <Quiz onFinish={handleQuizFinish} />;
      case 'result':
        return <Result scores={scores} gender={gender} onRestart={handleRestart} />;
      case 'start':
      default:
        return <Start onStart={handleStart} setGender={setGender} selectedGender={gender} />;
    }
  }

  return (
    <div className="App">
      {adState && <FullScreenAd onClose={handleAdClose} />}
      <div style={{ display: adState ? 'none' : 'flex', flexDirection: 'column', height: '100%' }}>
        {renderPage()}
        <AdBanner />
      </div>
    </div>
  );
}

export default App;
