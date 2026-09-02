import { Transaction } from '@mysten/sui/transactions';
import { ArrowRight } from '@phosphor-icons/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { DataNotAvailable } from '@/components/data-not-available';
import { Loader } from '@/components/loader';
import { useToast } from '@/components/toaster';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardHeaderItem,
} from '@/components/ui/card';
import { useSettingsContext } from '@/context/settings-context';
import { useWalletContext } from '@/context/wallet-context';
import useBreakpoint from '@/hooks/useBreakpoint';
import { cn } from '@/utils/twind';

import {
  fetchBlubNfts,
  type IBlubNft,
} from '../functions/fetch-blub-nfts';

const BROKEN_IMAGE_HOST = 'https://walrus.tusky.io';
const NEW_IMAGE_HOST = 'https://bucket.blubsui.website';
const BLUB_PACKAGE_ID =
  '0x56e430bc0cc42baa5cc5242d914f2de249b5ffeb7a663dc2079de769d077744b';

function hasBrokenImageUrl(blub: IBlubNft) {
  return blub.content.image_url.startsWith(BROKEN_IMAGE_HOST);
}

function getNewImageUrl(blub: IBlubNft) {
  const blobId = blub.content.attributes.BlobId ?? '';
  return `${NEW_IMAGE_HOST}/${blobId}`;
}

export const BlubImageMigration = () => {
  const { address, signExecuteAndWaitForTransaction } = useWalletContext();
  const { suiGrpcClient } = useSettingsContext();
  const { mobile } = useBreakpoint();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fixingObjectId, setFixingObjectId] = useState<string | null>(null);

  const {
    data: blubs,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['blub-nfts', address],
    queryFn: () => fetchBlubNfts(suiGrpcClient, address!),
    enabled: Boolean(address),
    staleTime: 5 * 60 * 1000,
  });

  if (!address || isPending) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <DataNotAvailable
        className="border-none"
        message={
          error instanceof Error
            ? error.message
            : 'Failed to load your Blub NFTs.'
        }
      />
    );
  }

  if (!blubs?.length) {
    return (
      <DataNotAvailable
        className="border-none"
        message="You don't have Blub NFT"
      />
    );
  }

  const brokenBlubs = blubs.filter(hasBrokenImageUrl);

  async function handleFixImageHost(blub: IBlubNft) {
    setFixingObjectId(blub.objectId);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${BLUB_PACKAGE_ID}::collection::owner_update_image_host`,
        arguments: [tx.object(blub.objectId), tx.pure.string(NEW_IMAGE_HOST)],
      });

      await signExecuteAndWaitForTransaction(tx);
      await queryClient.invalidateQueries({ queryKey: ['blub-nfts', address] });
      toast.success('Blub image host updated');
    } catch (fixError) {
      toast.error(
        fixError instanceof Error
          ? fixError.message
          : 'Failed to update image host'
      );
    } finally {
      setFixingObjectId(null);
    }
  }

  if (brokenBlubs.length > 0) {
    return (
      <div className="space-y-5">
        {brokenBlubs.map((blub) => {
          const newImageUrl = getNewImageUrl(blub);
          const isFixing = fixingObjectId === blub.objectId;

          return (
            <Card key={blub.objectId} variant="secondary">
              <CardHeader paddingY="small">
                <CardHeaderItem>
                  {blub.content.name || 'Blub image host'}
                </CardHeaderItem>
              </CardHeader>
              <CardContent
                variant="secondary"
                className={mobile ? 'p-3' : 'p-4'}
              >
                <div
                  className={cn('flex items-center gap-4', {
                    'flex-col': mobile,
                  })}
                >
                  <BlubImagePreview
                    src={blub.content.image_url}
                    label={blub.content.image_url}
                  />
                  <ArrowRight
                    className={cn(
                      'size-6 shrink-0 text-patara-light-mode-950 dark:text-patara-dark-mode-950',
                      {
                        'rotate-90': mobile,
                      }
                    )}
                  />
                  <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
                    <BlubImagePreview src={newImageUrl} label={newImageUrl} />
                    <Button
                      onClick={() => handleFixImageHost(blub)}
                      disabled={isFixing || !blub.content.attributes.BlobId}
                      size="sm"
                    >
                      {isFixing ? 'Fixing...' : 'Fix it'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <Card variant="secondary">
      <CardHeader paddingY="small">
        <CardHeaderItem>Your Blub NFTs</CardHeaderItem>
      </CardHeader>
      <CardContent variant="secondary" className={mobile ? 'p-3' : 'p-4'}>
        <div
          className={cn('grid gap-4', {
            'grid-cols-1': mobile,
            'grid-cols-2 sm:grid-cols-3': !mobile,
          })}
        >
          {blubs.map((blub) => (
            <div
              key={blub.objectId}
              className="flex flex-col items-center gap-2 rounded-xl bg-background p-3 dark:bg-black"
            >
              <img
                src={blub.content.image_url}
                alt={blub.content.name}
                className="size-40 rounded-xl object-cover"
              />
              <span className="text-center text-paragraph font-semibold">
                {blub.content.name}
              </span>
              <span
                title={blub.content.image_url}
                className="w-full truncate text-center text-metadata-1 text-patara-light-mode-950 dark:text-patara-dark-mode-950"
              >
                {blub.content.image_url}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

function BlubImagePreview({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <img src={src} alt={label} className="size-40 rounded-xl object-cover" />
      <span
        title={label}
        className="w-full truncate text-center text-metadata-1 text-patara-light-mode-950 dark:text-patara-dark-mode-950"
      >
        {label}
      </span>
    </div>
  );
}
