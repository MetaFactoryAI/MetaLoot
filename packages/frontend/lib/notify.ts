import Notify, { API as NotifyAPI } from 'bnc-notify';

import { CONFIG, TARGET_NETWORK } from '@/config';

let notify: NotifyAPI;

export const getNotifyAPI = (): NotifyAPI => {
  if (notify) {
    return notify;
  }
  notify = Notify({
    dappId: CONFIG.onboardDappId,
    system: 'ethereum',
    networkId: TARGET_NETWORK.chainId,
    darkMode: false,
    transactionHandler: (txInformation): void => {
      console.log('HANDLE TX', txInformation);
    },
  });
  return notify;
};
