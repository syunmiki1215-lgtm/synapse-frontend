// 
// このファイルが、バンドル割引を計算する「部品」です
// 

// UserContractManager.tsx が期待する「割引結果」の型
interface DiscountResult {
  totalBeforeDiscount: number;
  discountAmount: number;
  discountRate: number;
  totalAfterDiscount: number;
  discountedModuleId: number | null;
}

// (TODO: あとで本物のロジックを実装します)
export function calculateBundleDiscount(contracts: any[]): DiscountResult {
  console.log("Called calculateBundleDiscount");
  
  // --- (ラファエル修正 9: ダミーの「オブジェクト」を返す) ---
  const totalBeforeDiscount = contracts.reduce((sum, mod) => sum + (mod.base_price || 0), 0);
  let discountAmount = 0;
  let discountRate = 0;
  let discountedModuleId = null;

  // ダミーロジック: 2つ以上契約したら10%オフ
  if (contracts.length >= 2) {
    discountRate = 0.1; // 10%
    // 一番安いモジュールを割引対象にする（ダミー）
    if (contracts.length > 0) {
      // base_price が存在するものだけをソート対象にする
      const sortedContracts = [...contracts].filter(c => c.base_price != null).sort((a, b) => a.base_price - b.base_price);
      if (sortedContracts.length > 0) {
        const cheapestModule = sortedContracts[0];
        discountedModuleId = cheapestModule.module_id;
        // 割引額は一番安いモジュールの10%
        discountAmount = cheapestModule.base_price * discountRate;
      }
    }
  }

  const totalAfterDiscount = totalBeforeDiscount - discountAmount;

  return {
    totalBeforeDiscount,
    discountAmount,
    discountRate,
    totalAfterDiscount,
    discountedModuleId,
  };
  // --- (ラファエル修正 9 ここまで) ---
}

// (TODO: あとで本物のロジックを実装します)
// --- (ラファエル修正 10: 引数を DiscountResult 型にする) ---
export function formatDiscountInfo(discountResult: DiscountResult): string {
  console.log("Called formatDiscountInfo");
  if (discountResult.discountAmount > 0) {
    return `(${(discountResult.discountRate * 100).toFixed(0)}% OFF)`;
  }
  return "";
}
// --- (ラファエル修正 10 ここまで) ---