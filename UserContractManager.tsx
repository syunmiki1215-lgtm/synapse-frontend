'use client';

import React, { useState, useEffect } from 'react';
import { getUserContracts, addContract, deleteContract } from '@/lib/api';
import { calculateBundleDiscount, formatDiscountInfo } from '@/lib/bundleDiscount';

interface Module {
  module_id: number;
  module_name: string;
  tier_id: number;
  base_price: number;
}

interface ContractWithModule {
  contract_id: number;
  module_id: number;
  module_name: string;
  tier_id: number;
  base_price: number;
  is_active: boolean;
  start_date: string;
}

interface UserContractManagerProps {
  userId: number;
  modules: Module[];
  onContractUpdate: () => void;
}

export default function UserContractManager({
  userId,
  modules,
  onContractUpdate,
}: UserContractManagerProps) {
  const [contracts, setContracts] = useState<ContractWithModule[]>([]);
  const [selectedModuleIds, setSelectedModuleIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ユーザーの契約を取得
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const data = await getUserContracts(userId);
        setContracts(data || []);
        setSelectedModuleIds(new Set(data?.map((c: ContractWithModule) => c.module_id) || []));
        setError(null);
      } catch (err) {
        setError('Failed to load contracts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [userId]);

  // チェックボックスの変更を処理
  const handleModuleToggle = async (moduleId: number, isChecked: boolean) => {
    try {
      if (isChecked) {
        // 契約を追加
        await addContract(userId, moduleId);
        setSelectedModuleIds(new Set([...selectedModuleIds, moduleId]));
      } else {
        // 契約を削除
        const contractToDelete = contracts.find((c) => c.module_id === moduleId);
        if (contractToDelete) {
          await deleteContract(contractToDelete.contract_id);
          const newSelected = new Set(selectedModuleIds);
          newSelected.delete(moduleId);
          setSelectedModuleIds(newSelected);
        }
      }

      // 契約一覧を再取得
      const updatedContracts = await getUserContracts(userId);
      setContracts(updatedContracts || []);
      onContractUpdate();
    } catch (err) {
      setError('Failed to update contract');
      console.error(err);
    }
  };

  // 選択されたモジュールの情報を取得
  const selectedModules = modules.filter((m) => selectedModuleIds.has(m.module_id));

  // バンドル割引を計算
  const discountResult = calculateBundleDiscount(selectedModules);

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-4">Loading contracts...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Contract Management</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {/* モジュール選択チェックボックス */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Available Modules</h3>
        <div className="space-y-2">
          {modules.map((module) => (
            <label key={module.module_id} className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={selectedModuleIds.has(module.module_id)}
                onChange={(e) => handleModuleToggle(module.module_id, e.target.checked)}
                className="w-4 h-4 mr-3"
              />
              <div className="flex-1">
                <div className="font-semibold">{module.module_name}</div>
                <div className="text-sm text-gray-600">
                  Tier {module.tier_id} - ¥{module.base_price.toFixed(2)}/month
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 価格シミュレーション */}
      {selectedModules.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Price Simulation</h3>

          {/* 選択されたモジュール一覧 */}
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <div className="text-sm font-semibold mb-2">Selected Modules ({selectedModules.length}):</div>
            <div className="space-y-1">
              {selectedModules.map((module) => (
                <div key={module.module_id} className="text-sm">
                  {module.module_name}
                  {discountResult.discountedModuleId === module.module_id && (
                    <span className="ml-2 text-red-600 font-semibold">
                      {formatDiscountInfo(discountResult)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 価格計算結果 */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>¥{discountResult.totalBeforeDiscount.toFixed(2)}</span>
            </div>

            {discountResult.discountAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount ({(discountResult.discountRate * 100).toFixed(0)}%):</span>
                <span>-¥{discountResult.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total Monthly Cost:</span>
              <span>¥{discountResult.totalAfterDiscount.toFixed(2)}</span>
            </div>
          </div>

          {/* 割引情報 */}
          {discountResult.discountRate > 0 && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
              <strong>Bundle Discount Applied!</strong> The lowest-priced module (
              {modules.find((m) => m.module_id === discountResult.discountedModuleId)?.module_name})
              receives {(discountResult.discountRate * 100).toFixed(0)}% off.
            </div>
          )}
        </div>
      )}

      {selectedModules.length === 0 && (
        <div className="p-3 bg-gray-50 rounded text-center text-gray-500">
          No modules selected. Select modules to see pricing.
        </div>
      )}
    </div>
  );
}
