
import React from 'react';

function Start({ onStart, setGender, selectedGender }) {
  return (
    <div className="start-container">
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
