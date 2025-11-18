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
// UserContractManager.tsx が必要としていた3つの関数を、ここで定義します
//

export async function getUserContracts(apiBaseUrl: string) {
  // (TODO: あとで "GET /contracts" などの正しいパスに修正します)
  // return await fetchFromAPI(apiBaseUrl, "/contracts");

  // 現時点では、ダミーデータを返すようにしておきます
  console.log("Called getUserContracts");
  return Promise.resolve([
    { id: 1, userId: "user123", planName: "Standard", status: "active", startDate: "2025-01-01" },
    { id: 2, userId: "user456", planName: "Premium", status: "active", startDate: "2025-01-15" },
  ]);
}

export async function addContract(apiBaseUrl: string, contractData: any) {
  // (TODO: あとで "POST /contracts" などの正しいパスに修正します)
  // return await postToAPI(apiBaseUrl, "/contracts", contractData);

  console.log("Called addContract with:", contractData);
  return Promise.resolve({ success: true, newContract: { ...contractData, id: 3 } });
}

export async function deleteContract(apiBaseUrl: string, contractId: number) {
  // (TODO: あとで "DELETE /contracts/:id" などの正しいパスに修正します)
  // return await postToAPI(apiBaseUrl, `/contracts/${contractId}`, { method: 'DELETE' });

  console.log("Called deleteContract with:", contractId);
  return Promise.resolve({ success: true, deletedContractId: contractId });
}