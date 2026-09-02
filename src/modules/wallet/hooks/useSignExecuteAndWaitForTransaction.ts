import { useSignTransaction } from '@mysten/dapp-kit';
import type { GrpcTransactionResult } from '@mysten/sui/grpc';
import { Transaction } from '@mysten/sui/transactions';
import { fromBase64 } from '@mysten/sui/utils';
import { WalletAccount } from '@mysten/wallet-standard';
import { useCallback } from 'react';

import { useSettingsContext } from '@/context/settings-context';

interface TxInclude {
  effects: true;
  balanceChanges: true;
  events: true;
}

const TX_INCLUDE: TxInclude = {
  effects: true,
  balanceChanges: true,
  events: true,
};

export type SignedExecutedTransaction = Extract<
  GrpcTransactionResult<TxInclude>,
  { $kind: 'Transaction' }
>['Transaction'];

function getFailureMessage(result: {
  $kind: 'Transaction' | 'FailedTransaction';
  Transaction?: {
    status: { success: boolean; error?: { message: string } | null };
  };
  FailedTransaction?: {
    status: { success: boolean; error?: { message: string } | null };
  };
}): string | undefined {
  if (result.$kind === 'FailedTransaction') {
    return (
      result.FailedTransaction?.status.error?.message ?? 'Transaction failed'
    );
  }

  if (result.Transaction && !result.Transaction.status.success) {
    return result.Transaction.status.error?.message ?? 'Transaction failed';
  }

  return undefined;
}

interface Props {
  account?: WalletAccount;
}

export const useSignExecuteAndWaitForTransaction = ({
  account,
}: Props) => {
  const { suiGrpcClient } = useSettingsContext();
  const { mutateAsync: signTransaction } = useSignTransaction();

  const signExecuteAndWaitForTransaction = useCallback(
    async (transaction: Transaction): Promise<SignedExecutedTransaction> => {
      const sender = account?.address;

      if (sender) {
        try {
          transaction.setSenderIfNotSet(sender);

          const simResult = await suiGrpcClient.simulateTransaction({
            transaction,
            include: { effects: true },
          });
          const simError = getFailureMessage(simResult);
          if (simError) throw new Error(simError);
        } catch (err) {
          console.error('Error while executing the transaction', err);
          throw err instanceof Error ? err : new Error(String(err));
        }
      }

      try {
        const signedTransaction = await signTransaction({
          transaction,
          chain: 'sui:mainnet',
        });

        const transactionBytes =
          typeof signedTransaction.bytes === 'string'
            ? fromBase64(signedTransaction.bytes)
            : signedTransaction.bytes;

        const executed = await suiGrpcClient.executeTransaction({
          transaction: transactionBytes,
          signatures: [signedTransaction.signature],
          include: TX_INCLUDE,
        });

        const waited = await suiGrpcClient.waitForTransaction({
          result: executed,
          include: TX_INCLUDE,
        });

        const errorMessage = getFailureMessage(waited);
        if (errorMessage) throw new Error(errorMessage);

        if (waited.$kind !== 'Transaction' || !waited.Transaction) {
          throw new Error('Transaction failed');
        }

        return waited.Transaction;
      } catch (err) {
        throw err;
      }
    },
    [account?.address, signTransaction, suiGrpcClient]
  );

  return signExecuteAndWaitForTransaction;
};
