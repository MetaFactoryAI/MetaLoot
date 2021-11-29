import { useColorModeValue } from '@chakra-ui/react';
import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/providers';
import { parseProviderOrSigner } from 'eth-hooks/functions';
import { TEthersProviderOrSigner } from 'eth-hooks/models';
import { useEffect, useMemo, useState } from 'react';

import { NetworkName, NETWORKS } from '@/config';
import { getNotifyAPI } from '@/lib/notify';

const isCompatibleNetwork = (networkId: number) =>
  [1, 3, 4, 5, 42, 100].includes(networkId);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTransactor = (
  providerOrSigner: TEthersProviderOrSigner | null | undefined,
) => {
  const [pending, setPending] = useState(false);
  const isDark = useColorModeValue(false, true);

  const notify = useMemo(getNotifyAPI, []);

  useEffect(() => {
    notify.config({ darkMode: isDark });
  }, [notify, isDark]);

  const watchTx = async (
    tx: Promise<TransactionResponse>,
  ): Promise<Record<string, unknown> | TransactionReceipt | undefined> => {
    const { provider, providerNetwork } = await parseProviderOrSigner(
      providerOrSigner || undefined,
    );

    if (!providerNetwork) {
      throw new Error('No network detected');
    }
    const networkConfig = NETWORKS[providerNetwork.name as NetworkName];

    const etherscanTxUrl = networkConfig
      ? `${networkConfig.blockExplorer}tx/`
      : '';

    try {
      setPending(true);
      const result = await tx;

      if (!result) return result;

      if (isCompatibleNetwork(providerNetwork.chainId)) {
        const { emitter } = notify.hash(result.hash);
        emitter.on('all', (transaction) => ({
          link: `${etherscanTxUrl}${transaction.hash ?? ''}`,
        }));
      } else {
        notify.notification({
          message: `Local Transaction Sent`,
          type: 'hint',
        });
        // on most networks BlockNative will update a transaction handler,
        // but locally we will set an interval to listen...
        const listeningInterval = setInterval(async (): Promise<void> => {
          if (!result?.hash) return;

          const currentTransactionReceipt =
            await provider?.getTransactionReceipt(result.hash);
          if (currentTransactionReceipt?.confirmations) {
            notify.notification({
              message: 'Transaction Confirmed!',
              type: 'success',
            });
            if (listeningInterval) clearInterval(listeningInterval);
          }
        }, 500);
      }

      return await result.wait();
    } catch (e: any) {
      console.log(e);
      notify.notification({
        message: 'data' in e ? e.data.message : e.message,
        type: 'error',
        autoDismiss: 4000,
      });
      return undefined;
    }
  };

  return { watchTx, txPending: pending };
};
