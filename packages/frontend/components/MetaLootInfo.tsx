import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  useDisclosure,
  useNumberInput,
  VStack,
} from '@chakra-ui/react';
import { useWallet } from '@meta-cred/usewallet';
import { BigNumber, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';

import { AlertModal } from '@/components/AlertModal';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { CONFIG, TARGET_NETWORK } from '@/config';
import { maybePluralize } from '@/lib/stringHelpers';
import {
  useAgldBalance,
  useAGLDContract,
  useMetaLootContract,
  useMetaLootData,
  useTypedContractReader,
} from '@/lib/useContracts';
import { useTransactor } from '@/lib/useTransactor';

import { AmountSelector } from './AmountSelector';

const TOKEN_ID = '1';

export const MetaLootInfo: React.FC = () => {
  const [isApproving, setIsApproving] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { address, provider, onboard } = useWallet();
  const { watchTx } = useTransactor(provider);

  const metaLoot = useMetaLootContract();
  const agld = useAGLDContract();
  const agldBalance = useAgldBalance();
  const alertModal = useDisclosure();

  const numberInputProps = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: 5,
  });

  useEffect(() => {
    onboard?.walletCheck();
  }, [onboard]);

  const readAllowance = useTypedContractReader(
    agld,
    'allowance',
    address || '',
    metaLoot.address,
  )({ refetchInterval: 10000 });

  const { data: isActive } = useTypedContractReader(
    metaLoot,
    'saleActive',
  )({
    refetchInterval: 5000,
  });
  const readSalePrice = useTypedContractReader(metaLoot, 'salePrice')();
  const readTotalSupply = useTypedContractReader(
    metaLoot,
    'totalSupply',
    TOKEN_ID,
  )({ refetchInterval: 5000 });
  const readMaxSupply = useTypedContractReader(metaLoot, 'maxSupply')();

  const readNumOwned = useTypedContractReader(
    metaLoot,
    'balanceOf',
    address || '',
    TOKEN_ID,
  )();

  const unitPrice =
    (readSalePrice.data && +formatEther(readSalePrice.data)) || 0;
  const allowance =
    (readAllowance.data && +formatEther(readAllowance.data)) || 0;

  const totalSupply = readTotalSupply.data?.toNumber() || 0;
  const maxSupply = readMaxSupply.data?.toNumber() || 0;
  const numOwned = readNumOwned.data?.toNumber() || 0;

  const price = unitPrice * numberInputProps.valueAsNumber;

  const hasEnoughAllowance = allowance >= price;

  const { loading, nft, reload } = useMetaLootData(TOKEN_ID);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const supplyAvailable = maxSupply - totalSupply;
  const isSoldOut = maxSupply === totalSupply;

  const supplyString =
    (supplyAvailable > 0 && isActive) || isSoldOut
      ? `${supplyAvailable} / ${maxSupply} available`
      : 'Not Available';

  const mintButtonDisabled =
    !isActive || supplyAvailable <= 0 || isApproving || isMinting;

  const onMint = async () => {
    if (!readAllowance.data || !readSalePrice.data) return;

    if (!price || agldBalance - price <= 0) {
      alertModal.onOpen();
      return;
    }

    if (!hasEnoughAllowance) {
      setIsApproving(true);
      const approveTx = agld.approve(
        metaLoot.address,
        ethers.constants.MaxUint256,
      );
      const approveRes = await watchTx(approveTx);
      setIsApproving(false);
      readAllowance.refetch();
      console.log({ approveRes });
      if (!approveRes) return;
    }

    setIsMinting(true);
    const buyTx = metaLoot.buyMetaLoot(
      BigNumber.from(numberInputProps.valueAsNumber),
    );
    const buyRes = await watchTx(buyTx);
    setIsMinting(false);
    readTotalSupply.refetch();
    readNumOwned.refetch();
    console.log({ buyRes });
  };

  if (loading && !nft) return <LoadingState loading={loading} />;

  if (!nft) return <EmptyState title="Coming Soon" />;

  if (!nft) return null;

  return (
    <Grid
      templateColumns="minmax(200px, 1fr) 1fr"
      columnGap={6}
      rowGap={6}
      alignItems="center"
      justifyItems="center"
      mx={[4, 4, 2]}
    >
      <GridItem colSpan={[2, 2, 1]}>
        <Image src="bag.png" maxW={[350, 400, 500]} />
      </GridItem>

      <GridItem colSpan={[2, 2, 1]}>
        <VStack spacing={6} align="flex-start">
          <Heading>{nft.name}</Heading>
          <Text>{nft.description}</Text>
          <HStack w="100%">
            <Button
              disabled={mintButtonDisabled}
              isLoading={isApproving || isMinting}
              loadingText={isApproving ? 'Approving AGLD' : 'Minting'}
              variant="primary"
              onClick={onMint}
              size="md"
              w="100%"
              py={10}
            >
              <Flex justify="space-between" align="center" flex={1}>
                <Flex direction="column" align="flex-start">
                  <Text>
                    {isSoldOut
                      ? 'SOLD OUT'
                      : `MINT ${maybePluralize(
                          numberInputProps.valueAsNumber,
                          'BAG',
                        ).toUpperCase()}`}
                  </Text>
                  {supplyString && (
                    <Text fontSize="xs" color="gray.300" mt={1}>
                      {supplyString}
                    </Text>
                  )}
                </Flex>
                <Text color="yellow.400">{`${price} AGLD`}</Text>
              </Flex>
            </Button>
            <AmountSelector
              {...numberInputProps}
              isDisabled={mintButtonDisabled}
            />
          </HStack>

          <Button disabled onClick={onMint} w="100%" p={8} fontStyle="italic">
            <Flex direction="column">
              <Text>REDEMPTION COMING SOON</Text>
              {numOwned ? (
                <Text fontSize="sm" color="yellow.700" mt={1}>
                  {`You have ${maybePluralize(numOwned, 'bag')}`}
                </Text>
              ) : null}
            </Flex>
          </Button>
        </VStack>
      </GridItem>
      <GridItem colSpan={2} align="center" mt={10}>
        <Image src="flatlay.png" />
      </GridItem>
      <GridItem colSpan={2} py={10} px={[5, 5, 10]}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video autoPlay loop>
          <source
            src="https://gateway.pinata.cloud/ipfs/QmTnapfDtgnaf3tTtWaUXocbL1fZ2qWmh2shTF4hYf6xBE"
            type="video/mp4"
          />
        </video>
      </GridItem>
      <GridItem colSpan={2} align="center" p={6} pb="16">
        <HStack spacing={6}>
          <Link
            href={`${TARGET_NETWORK.blockExplorer}address/${metaLoot.address}`}
            isExternal
          >
            Etherscan
          </Link>
          {CONFIG.openseaUrl ? (
            <Link href={CONFIG.openseaUrl} isExternal>
              OpenSea
            </Link>
          ) : null}
        </HStack>
      </GridItem>

      <AlertModal isOpen={alertModal.isOpen} onClose={alertModal.onClose} />
    </Grid>
  );
};
