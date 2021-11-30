import { useWallet } from '@meta-cred/usewallet';
import { constants, Event } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

import { NEXTJS_API_BASE_URL } from '@/config';
import { useMetaLootContract } from '@/lib/useContracts';

export const useMetaLootBurnEvents = () => {
  const { address } = useWallet();
  const metaLoot = useMetaLootContract();
  const [eventMap, setEventMap] = useState<Event[]>([]);

  const filter = useMemo(() => {
    if (!address) return null;

    return metaLoot.filters.TransferSingle(
      address,
      address,
      constants.AddressZero,
    );
  }, [address, metaLoot.filters]);

  const queryEvents = useCallback(() => {
    (async (): Promise<void> => {
      if (!filter) return;
      const result = await metaLoot?.queryFilter(filter);
      if (result) {
        setEventMap((value) => {
          if (
            JSON.stringify(
              value.map((m) => `${m.transactionHash}_${m.logIndex}`),
            ) !==
            JSON.stringify(
              result.map((m) => `${m.transactionHash}_${m.logIndex}`),
            )
          ) {
            return result;
          }
          return value;
        });
      }
    })();
  }, [filter, metaLoot]);

  useEffect(() => {
    if (!filter) return () => {};

    try {
      metaLoot.on(filter, queryEvents);
      return () => {
        metaLoot?.off(filter, queryEvents);
      };
    } catch (e) {
      console.log(e);
      return () => {};
    }
  }, [filter, queryEvents, metaLoot]);
  // // get the events on initial load of hooks, without waiting for the next event
  // useEffect(() => {
  //   if (
  //     filter &&
  //     setEventMap &&
  //     (eventMap == null || eventMap?.length === 0) &&
  //     queryEvents
  //   ) {
  //     queryEvents();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [filter]);

  return eventMap;
};

export const getUnredeemedBurns = async (address: string) => {
  const res = await fetch(
    `${NEXTJS_API_BASE_URL}/api/unredeemedBurns/${address}`,
  );

  return res.json();
};

export const useUnredeemedBurns = () => {
  const { address } = useWallet();
  const metaLoot = useMetaLootContract();

  const { data, refetch, isLoading } = useQuery<Event[]>(
    ['unredeemedBurns', address],
    async () => {
      if (!address) return null;
      return getUnredeemedBurns(address);
    },
  );

  const refetchEvents = useCallback(() => refetch(), [refetch]);

  useEffect(() => {
    if (!address) return () => {};

    const filter = metaLoot.filters.TransferSingle(
      address,
      address,
      constants.AddressZero,
    );

    try {
      metaLoot.on(filter, refetchEvents);
      return () => {
        metaLoot?.off(filter, refetchEvents);
      };
    } catch (e) {
      console.log(e);
      return () => {};
    }
  }, [address, metaLoot, refetchEvents]);

  return { events: data, isLoading, refetch };
};
