import {
  Box,
  Heading,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useWallet } from '@meta-cred/usewallet';
import { InferGetStaticPropsType } from 'next';
import React, { useEffect } from 'react';

import { AlertModal } from '@/components/AlertModal';
import { Layout } from '@/components/Layout';
import { MetaLootCard } from "@/components/MetaLootCard";
import { useMetaLootContract, useMetaLootReader } from '@/lib/useContracts';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => ({
  props: {},
  revalidate: 1,
});

const IndexPage: React.FC<Props> = () => {

  const { isConnected, address, provider } = useWallet();
  const alertModal = useDisclosure();

  const metaLoot = useMetaLootContract();
  const owner = useMetaLootReader('buyMetaLoot', '');
  console.log({ owner });

  useEffect(() => {
    (async () => {
      if (metaLoot) {
        // const res = await metaLoot.owner()
        const res = await metaLoot.uri(1)
        console.log({ res });
      }
    })()
  }, [metaLoot, owner])

  return (
    <Layout>
      <Box my={[2, 4]}>
        {isConnected && address && provider ? (
          <Stack spacing={8} mt={4}>
            <MetaLootCard />
          </Stack>
        ) : (
          <Heading my="20" color="gray.300" textAlign="center">
            Connect Wallet to Continue
          </Heading>
        )}
        <AlertModal isOpen={alertModal.isOpen} onClose={alertModal.onClose} />
      </Box>
    </Layout>
  );
};

export default IndexPage;
