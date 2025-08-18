
import React, { useState, useEffect } from 'react';
import './FullScreenAd.css';

function FullScreenAd({ onClose }) {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanClose(true);
    }, 3000); // User can close the ad after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fullscreen-ad-overlay">
      <div className="ad-content">
        <h1>광고</h1>
        <p>이것은 전면 광고 시뮬레이션입니다.</p>
        {canClose ? (
          <button onClick={onClose} className="close-ad-button">계속하기</button>
        ) : (
          <p className="ad-timer">3초 후에 계속할 수 있습니다...</p>
        )}
      </div>
    </div>
  );
}

export default FullScreenAd;
