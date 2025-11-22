import React, { useEffect, useState } from 'react';
import { loadInterstitial, showInterstitial } from '../services/AdMob';
import './AdScreen.css'; // Assuming you'll create this CSS file

function AdScreen({ onAdComplete }) {
  const [message, setMessage] = useState('광고를 불러오는 중입니다...');

  useEffect(() => {
    const handleAdFlow = async () => {
      try {
        setMessage('광고를 로드 중...');
        await loadInterstitial();
        setMessage('광고를 표시 중...');
        await showInterstitial();
        // Ad shown and closed by user, or failed to show
        setMessage('광고 시청 완료. 결과 페이지로 이동합니다.');
        setTimeout(() => {
          onAdComplete();
        }, 1000); // Give a small delay before navigating
      } catch (error) {
        console.error('Ad flow failed:', error);
        setMessage('광고 로드/표시 실패. 결과 페이지로 이동합니다.');
        setTimeout(() => {
          onAdComplete();
        }, 1000); // Navigate even if ad fails
      }
    };

    handleAdFlow();
  }, [onAdComplete]);

  return (
    <div className="ad-screen-container">
      <div className="ad-screen-content">
        <p>{message}</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
}

export default AdScreen;
