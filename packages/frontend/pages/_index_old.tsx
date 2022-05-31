import { Box, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '@meta-cred/usewallet';
import { InferGetStaticPropsType } from 'next';
import React from 'react';

import { AlertModal } from '@/components/AlertModal';
import { EmptyState } from '@/components/EmptyState';
import { Layout } from '@/components/Layout';
import { MetaLootInfo } from '@/components/MetaLootInfo';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => ({
  props: {},
  revalidate: 1,
});

const IndexPage: React.FC<Props> = () => {
  const { isConnected, address, provider } = useWallet();
  const alertModal = useDisclosure();

  return (
    <Layout>
      <Box my={[2, 4]}>
        {isConnected && address && provider ? (
          <MetaLootInfo />
        ) : (
          <EmptyState title="Connect Wallet to Continue" />
        )}
        <AlertModal isOpen={alertModal.isOpen} onClose={alertModal.onClose} />
      </Box>
    </Layout>
  );
};

export default IndexPage;
