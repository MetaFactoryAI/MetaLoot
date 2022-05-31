import { useWallet } from "@meta-cred/usewallet";
import {  Event } from 'ethers';
import { useQuery } from 'react-query';

import { NEXTJS_API_BASE_URL } from '@/config';

export const getUnredeemedNfts = async (address: string) => {
  const res = await fetch(
    `${NEXTJS_API_BASE_URL}/api/unredeemed/${address}`,
  );

  return res.json();
};

export const useUnredeemedNfts = () => {
  const { address } = useWallet();
  const { data, refetch, isLoading } = useQuery<Event[]>(
    ['unredeemedBurns', address],
    async () => {
      if (!address) return null;
      return getUnredeemedNfts(address);
    },
  );
  return { events: data, isLoading, refetch };
};
