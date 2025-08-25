
import React from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, linkWithPopup } from "firebase/auth";

function Start({ onStart, setGender, selectedGender, onLogout, user, onGoToProfile }) {

  const handleLinkAccount = async () => {
    if (!auth.currentUser) return;
    const provider = new GoogleAuthProvider();
    try {
      await linkWithPopup(auth.currentUser, provider);
      alert('Google 계정이 성공적으로 연동되었습니다!');
    } catch (error) {
      console.error("Error linking account", error);
      alert(`계정 연동에 실패했습니다: ${error.message}`);
    }
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
  );

  return (
    <div className="start-container">
      {user && (
        <div className="user-info-container">
          <p className="user-info-text">
            {user.isAnonymous ? "게스트로 이용 중입니다." : `${user.email}`}
          </p>
          <div className="user-info-actions">
            {user.isAnonymous ? (
              <button onClick={handleLinkAccount} className="user-action-button">
                  <GoogleIcon />
                  구글 로그인
                </button>
            ) : (
              <button onClick={onLogout} className="user-action-button">로그아웃</button>
            )}
            <button onClick={onGoToProfile} className="user-action-button">📊 내 결과 보기</button>
          </div>
        </div>
      )}
      <h1 className="main-title">나는 테토형일까, 에겐형일까?</h1>
      <p className="description">간단한 테스트를 통해 당신의 성향을 알아보세요!</p>

      <div className="gender-selector">
        <p className="selector-title">당신의 성별을 선택해주세요.</p>
        <div className="gender-buttons">
          <button 
            onClick={() => setGender('male')} 
            className={`gender-button ${selectedGender === 'male' ? 'active' : ''}`}>
            남성
          </button>
          <button 
            onClick={() => setGender('female')} 
            className={`gender-button ${selectedGender === 'female' ? 'active' : ''}`}>
            여성
          </button>
        </div>
      </div>

      <button onClick={onStart} className="start-button">시작하기</button>
    </div>
  );
}

export default Start;
