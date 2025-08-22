
import React, { useState, useEffect } from 'react';
import Start from './pages/Start';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Profile from './pages/Profile';
import AdBanner from './components/AdBanner';
import FullScreenAd from './components/FullScreenAd';
import './App.css';
import { remoteConfig, getNumber, auth, db } from './firebase';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

import { questions } from './data/questions';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('start'); // 'start', 'quiz', 'result', 'profile'
  const [scores, setScores] = useState({ Teto: 0, Egen: 0 });
  const [mbti, setMbti] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [adState, setAdState] = useState('pre-test'); // 'pre-test', 'post-test', null
  const [gender, setGender] = useState(null); // null, 'male', 'female'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed", error);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleStart = () => {
    if (!gender) {
      alert('성별을 선택해주세요!');
      return;
    }
    // Shuffle questions and pick 15
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 15));
    setPage('quiz');
  };

  const handleQuizFinish = async (result) => {
    setScores(result.scores);
    setMbti(result.mbti);
    if (user) {
      try {
        await addDoc(collection(db, "users", user.uid, "results"), {
          scores: result.scores,
          mbti: result.mbti,
          gender: gender,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    setAdState('post-test'); // Show ad before showing result
  };

  const handleRestart = () => {
    setScores({ Teto: 0, Egen: 0 });
    setMbti(null);
    setQuizQuestions([]);
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

  const handleLogout = () => {
    signOut(auth);
  };

  const handleGoToProfile = () => {
    setPage('profile');
  };

  const handleBackFromProfile = () => {
    setPage('start');
  };

  const renderPage = () => {
    if (!user) {
      // While waiting for user state, show a loading indicator or null
      return null;
    }
    switch (page) {
      case 'quiz':
        return <Quiz onFinish={handleQuizFinish} questions={quizQuestions} />;
      case 'result':
        return <Result scores={scores} mbti={mbti} gender={gender} onRestart={handleRestart} />;
      case 'profile':
        return <Profile onBack={handleBackFromProfile} />;
      case 'start':
      default:
        return <Start onStart={handleStart} setGender={setGender} selectedGender={gender} onLogout={handleLogout} user={user} onGoToProfile={handleGoToProfile} />;
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
