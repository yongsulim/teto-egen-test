import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

function Result({ scores, onRestart }) {
  const resultCardRef = useRef();
  const tetoScore = scores.Teto;
  const egenScore = scores.Egen;
  const total = tetoScore + egenScore;
  const resultType = tetoScore > egenScore ? '테토형' : '에겐형';
  const dominantScore = Math.max(tetoScore, egenScore);
  const percentage = ((dominantScore / total) * 100).toFixed(1);
  const percentile = Math.floor(Math.random() * 30) + 1; // For MVP, random top 1-30%

  const resultDescriptions = {
    '테토형': '당신은 논리와 사실을 중시하는 테토형이시군요! 객관적인 분석과 효율적인 문제 해결에 강점을 가지고 있습니다.',
    '에겐형': '당신은 감성과 공감을 중시하는 에겐형이시군요! 따뜻한 마음으로 사람들과의 관계를 소중히 여깁니다.',
  };

  const handleDownloadImage = () => {
    if (!resultCardRef.current) return;

    html2canvas(resultCardRef.current).then(canvas => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'teto-egen-result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleShareToInstagram = () => {
    alert(
      "1. '결과 이미지 저장' 버튼을 눌러 이미지를 저장하세요.\n" +
      "2. 인스타그램 앱을 열고, 스토리에서 저장된 이미지를 선택하여 공유하세요."
    );
  };

  return (
    <div className="result-container fade-in">
      <div className="result-card" ref={resultCardRef}>
        <p className="result-intro">당신의 성향은...</p>
        <h1 className="result-title">{resultType}</h1>
        <p className="result-description">{resultDescriptions[resultType]}</p>
        
        <div className="score-details">
          <p>{resultType} 비율: {percentage}%</p>
          <p>당신은 상위 {percentile}%에 속합니다!</p>
        </div>
      </div>

      <div className="share-section">
          <button onClick={handleDownloadImage} className="action-button">결과 이미지 저장</button>
          <button onClick={handleShareToInstagram} className="action-button">인스타그램 스토리에 공유</button>
      </div>

      <button onClick={onRestart} className="restart-button">테스트 다시하기</button>

      {/* The AdBanner is now in App.js, so we can remove the placeholder here if we want, but leaving it is fine too */}
      {/* <div className="ad-banner">하단 배너 광고</div> */}
    </div>
  );
}

export default Result;