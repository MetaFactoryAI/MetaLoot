const walletconnectKey = 'walletconnect';
const mobileLinkChoiceKey = 'WALLETCONNECT_DEEPLINK_CHOICE';

export const get = (key: string): string | null =>
  typeof window === 'undefined' ? null : localStorage.getItem(key);

export const set = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};
export const remove = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

// Temporary workaround to clear cached walletconnect mobile wallet
// https://github.com/WalletConnect/walletconnect-monorepo/issues/394
export const clearWalletConnect = (): void => {
  remove(walletconnectKey);
  remove(mobileLinkChoiceKey);
};
