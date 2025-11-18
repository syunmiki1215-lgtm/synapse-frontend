/**
 * バンドル割引計算ロジック
 * インテリジェント・バンドル割引のルールに基づいて、合計金額を計算します。
 */

export interface Module {
  module_id: number;
  module_name: string;
  tier_id: number;
  base_price: number;
}

export interface DiscountCalculationResult {
  totalBeforeDiscount: number;
  discountAmount: number;
  totalAfterDiscount: number;
  discountRate: number;
  discountedModuleId: number | null;
}

/**
 * 割引率を取得する関数
 * @param contractCount - 契約モジュール数
 * @returns 割引率（0.0 - 0.45）
 */
function getDiscountRate(contractCount: number): number {
  if (contractCount <= 1) return 0.0;
  if (contractCount === 2) return 0.15;
  if (contractCount === 3) return 0.25;
  if (contractCount === 4) return 0.35;
  return 0.45; // 5モジュール以上
}

/**
 * 契約モジュールの合計金額を計算する関数
 * @param selectedModules - 選択されたモジュール配列
 * @returns 割引計算結果
 */
export function calculateBundleDiscount(selectedModules: Module[]): DiscountCalculationResult {
  const contractCount = selectedModules.length;

  // 基本合計金額を計算
  const totalBeforeDiscount = selectedModules.reduce((sum, module) => sum + module.base_price, 0);

  // 割引率を取得
  const discountRate = getDiscountRate(contractCount);

  // 割引対象のモジュールを決定
  let discountedModuleId: number | null = null;
  let discountAmount = 0;

  if (discountRate > 0 && selectedModules.length > 0) {
    // 最も価格の低いモジュールを見つける
    const lowestPriceModule = selectedModules.reduce((lowest, current) =>
      current.base_price < lowest.base_price ? current : lowest
    );

    discountedModuleId = lowestPriceModule.module_id;
    discountAmount = lowestPriceModule.base_price * discountRate;
  }

  const totalAfterDiscount = totalBeforeDiscount - discountAmount;

  return {
    totalBeforeDiscount,
    discountAmount,
    totalAfterDiscount,
    discountRate,
    discountedModuleId,
  };
}

/**
 * 割引情報を人間が読みやすい形式で返す関数
 * @param result - 割引計算結果
 * @returns フォーマットされた割引情報
 */
export function formatDiscountInfo(result: DiscountCalculationResult): string {
  if (result.discountRate === 0) {
    return "割引なし";
  }

  const discountPercentage = (result.discountRate * 100).toFixed(0);
  return `${discountPercentage}% OFF (¥${result.discountAmount.toFixed(2)})`;
}
