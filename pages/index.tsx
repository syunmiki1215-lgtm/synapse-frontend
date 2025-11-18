import React from 'react';
// components フォルダから、あきにぃさんの部品を読み込む
import UserContractManager from '../components/UserContractManager';

const HomePage = () => {
  // APIサーバーのURL (あとで Cloud Run の環境変数で設定します)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  return (
    <div>
      <h1>Synapse OS 管理画面</h1>
      <hr />
      <UserContractManager apiBaseUrl={apiBaseUrl} />
    </div>
  );
};

export default HomePage;