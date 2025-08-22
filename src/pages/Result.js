import React, { useRef, useState, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

function Result({ scores, mbti, gender, onRestart }) {
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

  const resultDescriptions = {
    '테토형': {
      'ISTJ': '논리적인 원칙과 현실적인 계획으로 삶을 설계하는 당신! 강한 책임감과 꼼꼼함으로 맡은 바를 완벽하게 해내는, 모두가 신뢰하는 튼튼한 기둥과 같은 사람입니다.',
      'ISFJ': '따뜻한 논리로 주변을 챙기는 당신! 성실함과 책임감을 바탕으로 현실적인 도움을 주며, 조용히 주변 사람들에게 안정감을 주는 든든한 사람입니다.',
      'INFJ': '논리적인 통찰력으로 사람과 세상을 이해하는 당신! 합리적인 신념을 바탕으로 더 나은 세상을 만들고자 하며, 다른 사람의 가능성을 꿰뚫어 보는 혜안을 가졌습니다.',
      'INTJ': '철저한 논리와 전략으로 미래를 예측하는 당신! 뛰어난 통찰력과 상상력을 합리적인 계획으로 실현시키는, 세상을 움직이는 조용한 전략가입니다.',
      'ISTP': '논리적인 사고와 뛰어난 적응력으로 문제를 해결하는 당신! 상황을 빠르게 파악하고 가장 효율적인 방법을 찾아내는, 만능 해결사와 같은 사람입니다.',
      'ISFP': '현실적인 감각과 논리적인 사고를 겸비한 당신! 실용적인 판단을 내리면서도 자신만의 가치를 추구하며, 조용히 자신만의 방식으로 세상을 탐험하는 예술가입니다.',
      'INFP': '논리적인 사고를 바탕으로 이상적인 세상을 꿈꾸는 당신! 합리적인 신념과 따뜻한 마음으로 자신만의 가치를 실현하며, 세상을 더 나은 곳으로 만들고자 하는 사색가입니다.',
      'INTP': '끝없는 논리적 호기심으로 세상의 원리를 탐구하는 당신! 복잡한 문제의 핵심을 꿰뚫고 독창적인 해결책을 찾아내는, 명석한 두뇌를 가진 발명가입니다.',
      'ESTP': '논리적인 판단력과 뛰어난 순발력으로 도전을 즐기는 당신! 현실적인 문제 해결에 강하며, 유쾌한 에너지로 주변 사람들을 이끄는 타고난 리더입니다.',
      'ESFP': '현실적인 감각과 논리적인 사고로 현재를 즐기는 당신! 실용적인 판단과 긍정적인 에너지로 주변에 활기를 불어넣으며, 모든 순간을 즐길 줄 아는 유쾌한 사람입니다.',
      'ENFP': '논리적인 사고를 기반으로 새로운 가능성을 탐색하는 당신! 합리적인 분석과 특유의 열정으로 주변에 긍정적인 영향을 주는, 통통 튀는 아이디어 뱅크입니다.',
      'ENTP': '논리적인 분석과 번뜩이는 아이디어로 세상을 뒤흔드는 당신! 지적인 도전을 즐기며, 기존의 틀을 깨는 새로운 가능성을 제시하는 뜨거운 토론가입니다.',
      'ESTJ': '철저한 논리와 현실적인 계획으로 조직을 이끄는 당신! 타고난 관리 능력과 강한 책임감으로 목표를 반드시 달성하는, 모두가 의지하는 리더의 표본입니다.',
      'ESFJ': '논리적인 판단력과 따뜻한 마음으로 사람들을 챙기는 당신! 현실적인 도움과 체계적인 계획으로 주변 사람들에게 실질적인 힘이 되어주는, 다정한 현실주의자입니다.',
      'ENFJ': '논리적인 비전으로 사람들을 이끄는 당신! 합리적인 신념과 따뜻한 카리스마로 주변 사람들의 성장을 돕고, 세상을 더 나은 방향으로 이끄는 타고난 멘토입니다.',
      'ENTJ': '철저한 논리와 대담한 비전으로 세상을 지휘하는 당신! 타고난 통솔력과 전략적인 사고로 불가능해 보이는 목표도 현실로 만들어내는, 위풍당당한 지도자입니다.'
    },
    '에겐형': {
      'ISTJ': '따뜻한 마음과 성실함으로 묵묵히 자신의 역할을 다하는 당신! 현실적인 감각으로 주변 사람들을 살뜰히 챙기는, 변치 않는 소나무 같은 사람입니다.',
      'ISFJ': '따뜻한 공감 능력과 성실함으로 주변을 보살피는 당신! 다른 사람의 감정을 세심하게 살피고 현실적인 도움을 주는, 모두의 든든한 안식처와 같은 사람입니다.',
      'INFJ': '깊은 공감 능력과 통찰력으로 사람의 마음을 헤아리는 당신! 따뜻한 이상을 품고, 다른 사람의 아픔에 진심으로 공감하며 더 나은 세상을 꿈꾸는 깊은 샘물 같은 사람입니다.',
      'INTJ': '따뜻한 마음과 뛰어난 통찰력으로 미래를 그리는 당신! 내면의 깊은 이상을 실현하기 위해 조용히 계획을 세우며, 사람들에게 새로운 영감을 주는 등대와 같은 사람입니다.',
      'ISTP': '따뜻한 마음과 뛰어난 손재주로 주변에 도움을 주는 당신! 무심한 듯 보여도 위기 상황에 척척 문제를 해결해주고, 실질적인 도움으로 마음을 표현하는 조용한 영웅입니다.',
      'ISFP': '따뜻한 감성과 겸손한 마음으로 세상을 느끼는 당신! 다른 사람의 감정에 깊이 공감하며, 자신만의 방식으로 세상의 아름다움을 표현하는 다정한 예술가입니다.',
      'INFP': '따뜻한 이상과 깊은 공감 능력으로 세상을 이해하는 당신! 진정한 가치를 추구하며, 다른 사람의 마음에 깊은 울림을 주는 섬세한 영혼의 소유자입니다.',
      'INTP': '따뜻한 마음과 무한한 상상력으로 새로운 세상을 탐구하는 당신! 엉뚱해 보일 수 있는 질문 속에서 새로운 진리를 발견하며, 자신만의 방식으로 세상에 온기를 더하는 괴짜 친구입니다.',
      'ESTP': '따뜻한 마음과 넘치는 에너지로 사람들을 사로잡는 당신! 즐거운 분위기를 주도하며, 위기 상황에서도 유머를 잃지 않고 주변에 활력을 주는 매력적인 해결사입니다.',
      'ESFP': '따뜻한 공감 능력과 빛나는 에너지로 현재를 즐기는 당신! 사람들과 어울리는 것을 좋아하며, 모든 순간을 특별하게 만드는 타고난 슈퍼스타입니다.',
      'ENFP': '따뜻한 공감 능력으로 사람들과의 관계를 이끌어가는 당신! 긍정적인 에너지와 창의적인 아이디어로 주변에 활기를 불어넣는, 사랑스러운 럭비공 같은 사람입니다.',
      'ENTP': '따뜻한 마음과 번뜩이는 재치로 사람들을 즐겁게 하는 당신! 지적인 호기심과 유쾌한 에너지로 주변 사람들에게 새로운 관점을 제시하는, 미워할 수 없는 발명가입니다.',
      'ESTJ': '따뜻한 마음과 강한 책임감으로 공동체를 이끄는 당신! 사람들을 살뜰히 챙기면서도 현실적인 계획으로 목표를 달성하는, 믿음직한 동네 반장님 같은 사람입니다.',
      'ESFJ': '넘치는 애정과 따뜻한 관심으로 주변을 살피는 당신! 다른 사람의 필요를 먼저 알아채고 기꺼이 돕는, 세상에 온기를 더하는 다정한 햇살 같은 사람입니다.',
      'ENFJ': '따뜻한 카리스마와 깊은 공감 능력으로 사람들을 이끄는 당신! 다른 사람의 성장을 진심으로 도우며, 긍정적인 영향력으로 세상을 더 따뜻하게 만드는 위대한 멘토입니다.',
      'ENTJ': '따뜻한 비전과 강력한 통솔력으로 사람들의 마음을 움직이는 당신! 사람들의 잠재력을 꿰뚫어 보고, 모두가 함께 성장할 수 있는 미래를 만들어나가는 다정한 지도자입니다.'
    }
  };

  const getDescription = () => {
    if (resultDescriptions[resultType] && resultDescriptions[resultType][mbti]) {
      return resultDescriptions[resultType][mbti];
    }
    return "결과 설명을 찾을 수 없습니다.";
  }

  const handleDownloadImage = () => { 
    logEvent(analytics, 'share', { method: 'download_image', content_type: `${resultType}_${mbti}` });
    html2canvas(resultCardRef.current, { useCORS: true }).then(canvas => { const image = canvas.toDataURL('image/png'); const link = document.createElement('a'); link.href = image; link.download = 'teto-egen-mbti-result.png'; document.body.appendChild(link); link.click(); document.body.removeChild(link); }); 
  };
  const handleShareToInstagram = () => { 
    logEvent(analytics, 'share', { method: 'instagram_story', content_type: `${resultType}_${mbti}` });
    alert("1. '결과 이미지 저장' 버튼을 눌러 이미지를 저장하세요.\n2. 인스타그램 앱을 열고, 스토리에서 저장된 이미지를 선택하여 공유하세요."); 
  };
  const hashtags = ['#테토에겐', '#MBTI성향테스트', `#${resultType}` , `#${mbti}`];
  const handleCopyHashtags = () => { navigator.clipboard.writeText(hashtags.join(' ')).then(() => alert('해시태그가 클립보드에 복사되었습니다!')); };

  return (
    <div className="result-container fade-in">
      <div className={`result-card ${theme} frame-${frame}`} ref={resultCardRef} onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}>
        <p className="result-intro">당신의 성향은...</p>
        <h1 className="result-title">{genderText} {resultType} {mbti}</h1>
        <p className="result-description">{getDescription()}</p>
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
      <div className="hashtag-section"><p className="hashtag-title">추천 해시태그</p><div className="hashtags">{hashtags.map(tag => <span key="tag" className="hashtag">{tag}</span>)}</div><button onClick={handleCopyHashtags} className="copy-button">해시태그 복사</button></div>
      <button onClick={onRestart} className="restart-button">테스트 다시하기</button>
    </div>
  );
}

export default Result;