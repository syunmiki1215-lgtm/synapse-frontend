// 
// このファイルが、APIサーバー(synapse-backend)と通信する「部品」です
// 

/**
 * APIサーバーにGETリクエストを送信する
 * @param apiBaseUrl - APIサーバーのURL
 * @param path - エンドポイントのパス (例: "/contracts")
 */
async function fetchFromAPI(apiBaseUrl: string, path: string) {
  const url = `${apiBaseUrl}${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * APIサーバーにPOSTリクエストを送信する
 * @param apiBaseUrl - APIサーバーのURL
 * @param path - エンドポイントのパス
 * @param data - 送信するデータ (JSON)
 */
async function postToAPI(apiBaseUrl: string, path: string, data: any) {
  const url = `${apiBaseUrl}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return await response.json();
}

//
// UserContractManager.tsx が必要としていた3つの関数
//

export async function getUserContracts(apiBaseUrl: string) {
  // (TODO: あとで "GET /contracts" などの正しいパスに修正します)
  // return await fetchFromAPI(apiBaseUrl, "/contracts");
  
  console.log("Called getUserContracts");
  
  // --- (ラファエル修正 7: ダミーデータを ContractWithModule の型に合わせる) ---
  // UserContractManager.tsx が期待する「ContractWithModule」の型に
  // 合致するダミーデータを返します
  const dummyData = [
    { 
      contract_id: 1, 
      module_id: 101, 
      module_name: "AI Assistant", 
      tier_id: 2, 
      base_price: 3000, 
      is_active: true, 
      start_date: "2025-01-01" 
    },
    { 
      contract_id: 2, 
      module_id: 102, 
      module_name: "Data Analytics", 
      tier_id: 3, 
      base_price: 5000, 
      is_active: true, 
      start_date: "2025-01-15" 
    },
  ];
  
  return Promise.resolve(dummyData);
  // --- (ラファエル修正 7 ここまで) ---
}

export async function addContract(apiBaseUrl: string, contractData: any) {
  // (TODO: あとで "POST /contracts" などの正しいパスに修正します)
  // return await postToAPI(apiBaseUrl, "/contracts", contractData);
  
  console.log("Called addContract with:", contractData);
  // --- (ラファエル修正 8: 返り値もダミーデータに合わせておく) ---
  return Promise.resolve({ 
    success: true, 
    newContract: { 
      ...contractData, 
      contract_id: 3, 
      module_name: "New Module (Dummy)", 
      tier_id: 1, 
      base_price: 1000, 
      is_active: true, 
      start_date: "2025-11-18"
    } 
  });
  // --- (ラファエル修正 8 ここまで) ---
}

export async function deleteContract(apiBaseUrl: string, contractId: number) {
  // (TODO: あとで "DELETE /contracts/:id" などの正しいパスに修正します)
  // return await postToAPI(apiBaseUrl, `/contracts/${contractId}`, { method: 'DELETE' });
  
  console.log("Called deleteContract with:", contractId);
  return Promise.resolve({ success: true, deletedContractId: contractId });
}