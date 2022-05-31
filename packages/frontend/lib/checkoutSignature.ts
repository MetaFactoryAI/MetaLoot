import { providers } from 'ethers';

import { NEXTJS_API_BASE_URL } from '@/config';
import { requestSignature, verifySignature } from '@/lib/signature';
import { CheckoutData, CheckoutOptions } from '@/lib/types';

const MESSAGE = 'Sign this message to confirm your redemption\n\n';

export async function verifyOrderSignature(
  orderMessage: string,
  signature: string,
  provider: providers.BaseProvider,
): Promise<CheckoutOptions | null> {
  try {
    const checkoutOptions = JSON.parse(
      orderMessage.replace(MESSAGE, ''),
    ) as CheckoutOptions;

    const valid = await verifySignature(
      checkoutOptions.ethAddress,
      orderMessage,
      signature,
      provider,
    );

    if (!valid) {
      throw new Error('invalid signature');
    }
    return checkoutOptions;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Signature verification failed', e);
    return null;
  }
}

export const getSignatureForCheckout = async (
  opts: CheckoutOptions,
  provider: providers.Web3Provider,
) => {
  const serializedOptions = JSON.stringify(opts);
  const orderMessage = `${MESSAGE}${serializedOptions}`;
  const signature = await requestSignature(provider, orderMessage);

  return { signature, orderMessage };
};

export const getCheckoutUrlForOrder = async (
  opts: CheckoutOptions,
  provider: providers.Web3Provider,
): Promise<CheckoutData | { error: Error }> => {
  const data = await getSignatureForCheckout(opts, provider);

  try {
    const res = await fetch(`${NEXTJS_API_BASE_URL}/api/getCheckoutUrl`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if(!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText)
    }

    return (await res.json()) as CheckoutData;
  } catch (e) {
    return {  error: e as Error };
  }
};
