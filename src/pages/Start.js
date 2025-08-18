
import React from 'react';

function Start({ onStart }) {
  return (
    <div className="start-container">
      <h1 className="main-title">나는 테토형일까, 에겐형일까?</h1>
      <p className="description">간단한 테스트를 통해 당신의 성향을 알아보세요!</p>
      <button onClick={onStart} className="start-button">시작하기</button>
    </div>
  );
}

export default Start;
