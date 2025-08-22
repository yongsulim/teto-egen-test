import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, getDocs } from "firebase/firestore";

function Profile({ onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (auth.currentUser) {
        const q = query(collection(db, "users", auth.currentUser.uid, "results"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const userResults = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResults(userResults);
      }
      setLoading(false);
    };

    fetchResults();
  }, []);

  if (loading) {
    return <p>결과를 불러오는 중...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>나의 결과 기록</h2>
        <button onClick={onBack} className="user-action-button">← 뒤로가기</button>
      </div>
      <div className="results-list">
        {results.length > 0 ? (
          results.map(result => (
            <div key={result.id} className="result-item">
              <p><strong>{new Date(result.timestamp?.toDate()).toLocaleString()}</strong></p>
              <p>테토: {result.scores.Teto}, 에겐: {result.scores.Egen}</p>
              <p>결과: {result.mbti} ({result.scores.Teto > result.scores.Egen ? '테토형' : '에겐형'})</p>
            </div>
          ))
        ) : (
          <p>아직 저장된 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
