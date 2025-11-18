// 
// このファイルが、バンドル割引を計算する「部品」です
// (UserContractManager.tsx がこの部品を必要としていました)
// 

// (TODO: あとで本物のロジックを実装します)
export function calculateBundleDiscount(contracts: any[]): number {
  console.log("Called calculateBundleDiscount");
  // とりあえず 0 を返します
  return 0;
}

// (TODO: あとで本物のロジックを実装します)
export function formatDiscountInfo(discount: number): string {
  console.log("Called formatDiscountInfo");
  if (discount > 0) {
    return `Bundle discount applied: ${discount} yen`;
  }
  return "No bundle discount";
}