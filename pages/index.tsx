import React from 'react';
import UserContractManager from '../components/UserContractManager';

// ダミーのモジュールデータ（本番ではDBから取得します）
const DUMMY_MODULES = [
  { module_id: 101, module_name: "AI Assistant", tier_id: 1, base_price: 1000 },
  { module_id: 102, module_name: "Data Analytics", tier_id: 2, base_price: 2000 },
  { module_id: 103, module_name: "Security Pack", tier_id: 1, base_price: 1500 },
  { module_id: 104, module_name: "Cloud Storage", tier_id: 3, base_price: 5000 },
];

const HomePage = () => {
  // APIサーバーのURL (環境変数から取得、なければローカル)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  // 契約が更新されたときに呼ばれる関数（ログを出すだけ）
  const handleContractUpdate = () => {
    console.log("Contract updated!");
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Synapse OS 管理画面</h1>
        <hr className="mb-6 border-gray-300" />
        
        {/* 子コンポーネントに必要な3つの道具を全て渡す */}
        <UserContractManager 
          apiBaseUrl={apiBaseUrl} 
          modules={DUMMY_MODULES}
          onContractUpdate={handleContractUpdate}
        />
      </div>
    </div>
  );
};

export default HomePage;