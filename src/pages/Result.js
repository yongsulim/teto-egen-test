import React, { useRef, useState, useMemo } from 'react';
import html2canvas from 'html2canvas';

function Result({ scores, gender, onRestart }) {
  const resultCardRef = useRef();
  const [theme, setTheme] = useState('default');
  const [frame, setFrame] = useState('none');
  const [stickers, setStickers] = useState([]);
  const [draggingSticker, setDraggingSticker] = useState({ id: null, offset: { x: 0, y: 0 } });

  const tetoScore = scores.Teto;
  const egenScore = scores.Egen;
  const total = tetoScore + egenScore;
  const resultType = tetoScore > egenScore ? '테토형' : '에겐형';
  const genderText = gender === 'male' ? '남성' : gender === 'female' ? '여성' : '';
  const dominantScore = Math.max(tetoScore, egenScore);
  const percentage = ((dominantScore / total) * 100).toFixed(1);

  const percentile = useMemo(() => {
    const scoreMap = { 12: 1, 11: 5, 10: 15, 9: 30, 8: 50, 7: 70 };
    let basePercentile = scoreMap[dominantScore] || 85;
    if ((gender === 'male' && resultType === '테토형') || (gender === 'female' && resultType === '에겐형')) {
      basePercentile = Math.max(1, basePercentile - 5);
    }
    const randomJitter = Math.floor(Math.random() * 5) - 2;
    return Math.max(1, basePercentile + randomJitter);
  }, [dominantScore, gender, resultType]);

  const themes = [{ id: 'default', name: '기본' }, { id: 'dark', name: '다크' }, { id: 'pastel', name: '파스텔' }, { id: 'forest', name: '포레스트' }, { id: 'ocean', name: '오션' }, { id: 'sunshine', name: '선샤인' }];
  const frames = [{ id: 'none', name: '없음' }, { id: 'solid', name: '실선' }, { id: 'double', name: '이중선' }, { id: 'groove', name: '입체' }];
  const availableStickers = ['💖', '✨', '😂', '👍', '💯', '🔥'];

  const addSticker = (sticker) => {
    const newSticker = { id: Date.now(), text: sticker, top: '50%', left: '50%' };
    setStickers([...stickers, newSticker]);
  };

  const handleDragStart = (id, e) => {
    e.preventDefault();
    const stickerRect = e.target.getBoundingClientRect();
    const offset = { x: e.clientX - stickerRect.left, y: e.clientY - stickerRect.top };
    setDraggingSticker({ id, offset });
  };

  const handleDragMove = (e) => {
    if (!draggingSticker.id) return;
    const cardRect = resultCardRef.current.getBoundingClientRect();
    const newLeft = e.clientX - cardRect.left - draggingSticker.offset.x;
    const newTop = e.clientY - cardRect.top - draggingSticker.offset.y;

    setStickers(stickers.map(s => s.id === draggingSticker.id ? { ...s, left: `${newLeft}px`, top: `${newTop}px` } : s));
  };

  const handleDragEnd = () => {
    setDraggingSticker({ id: null, offset: { x: 0, y: 0 } });
  };

  const resultDescriptions = { '테토형': '당신은 논리와 사실을 중시하는 테토형이시군요! 객관적인 분석과 효율적인 문제 해결에 강점을 가지고 있습니다.', '에겐형': '당신은 감성과 공감을 중시하는 에겐형이시군요! 따뜻한 마음으로 사람들과의 관계를 소중히 여깁니다.' };
  const handleDownloadImage = () => { html2canvas(resultCardRef.current, { useCORS: true }).then(canvas => { const image = canvas.toDataURL('image/png'); const link = document.createElement('a'); link.href = image; link.download = 'teto-egen-result.png'; document.body.appendChild(link); link.click(); document.body.removeChild(link); }); };
  const handleShareToInstagram = () => { alert("1. '결과 이미지 저장' 버튼을 눌러 이미지를 저장하세요.\n2. 인스타그램 앱을 열고, 스토리에서 저장된 이미지를 선택하여 공유하세요."); };
  const hashtags = ['#테토에겐', '#성향테스트', '#심리테스트', '#남녀테스트', '#TetoEgen'];
  const handleCopyHashtags = () => { navigator.clipboard.writeText(hashtags.join(' ')).then(() => alert('해시태그가 클립보드에 복사되었습니다!')); };

  return (
    <div className="result-container fade-in">
      <div className={`result-card ${theme} frame-${frame}`} ref={resultCardRef} onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}>
        <p className="result-intro">당신의 성향은...</p>
        <h1 className="result-title">{genderText} {resultType}</h1>
        <p className="result-description">{resultDescriptions[resultType]}</p>
        <div className="score-details"><p>{resultType} 비율: {percentage}%</p><p>당신은 상위 {percentile}%에 속합니다!</p></div>
        {stickers.map(sticker => (
          <span 
            key={sticker.id} 
            className={`sticker ${draggingSticker.id === sticker.id ? 'dragging' : ''}`}
            style={{ top: sticker.top, left: sticker.left }} 
            onMouseDown={(e) => handleDragStart(sticker.id, e)}>
            {sticker.text}
          </span>
        ))}
      </div>

      <div className="decorator-section">
        <div className="decorator-group">
          <p className="decorator-title">테마 변경</p>
          <div className="theme-buttons">{themes.map(t => (<button key={t.id} onClick={() => setTheme(t.id)} className={`theme-button ${t.id} ${theme === t.id ? 'active' : ''}`}>{t.name}</button>))}
          </div>
        </div>
        <div className="decorator-group">
          <p className="decorator-title">프레임 변경</p>
          <div className="frame-buttons">{frames.map(f => (<button key={f.id} onClick={() => setFrame(f.id)} className={`frame-button ${f.id} ${frame === f.id ? 'active' : ''}`}>{f.name}</button>))}
          </div>
        </div>
        <div className="decorator-group">
          <p className="decorator-title">스티커 추가</p>
          <div className="sticker-buttons">
            {availableStickers.map(s => (<button key={s} onClick={() => addSticker(s)} className="sticker-button">{s}</button>))}
            <button onClick={() => setStickers([])} className="sticker-clear-button">초기화</button>
          </div>
        </div>
      </div>

      <div className="share-section"><button onClick={handleDownloadImage} className="action-button">결과 이미지 저장</button><button onClick={handleShareToInstagram} className="action-button">인스타그램 스토리에 공유</button></div>
      <div className="hashtag-section"><p className="hashtag-title">추천 해시태그</p><div className="hashtags">{hashtags.map(tag => <span key={tag} className="hashtag">{tag}</span>)}</div><button onClick={handleCopyHashtags} className="copy-button">해시태그 복사</button></div>
      <button onClick={onRestart} className="restart-button">테스트 다시하기</button>
    </div>
  );
}

export default Result;