import { bcs } from '@mysten/sui/bcs';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const BLUB_TYPE_PREFIX =
  '0x56e430bc0cc42baa5cc5242d914f2de249b5ffeb7a663dc2079de769d077744b::collection::Blub';

const BlubBcs = bcs.struct('Blub', {
  id: bcs.Address,
  name: bcs.string(),
  image_url: bcs.string(),
  description: bcs.string(),
  attributes: bcs.struct('VecMap', {
    contents: bcs.vector(
      bcs.struct('Entry', {
        key: bcs.string(),
        value: bcs.string(),
      })
    ),
  }),
});

export interface IBlubNft {
  objectId: string;
  version: string;
  digest: string;
  type: string;
  content: {
    id: string;
    name: string;
    image_url: string;
    description: string;
    attributes: Record<string, string>;
  };
}

function decodeBlubContent(content: Uint8Array) {
  const parsed = BlubBcs.parse(content);

  return {
    id: parsed.id,
    name: parsed.name,
    image_url: parsed.image_url,
    description: parsed.description,
    attributes: Object.fromEntries(
      parsed.attributes.contents.map((entry) => [entry.key, entry.value])
    ),
  };
}

export async function fetchBlubNfts(
  suiGrpcClient: SuiGrpcClient,
  owner: string
): Promise<IBlubNft[]> {
  const blubs: IBlubNft[] = [];
  let cursor: string | undefined;

  while (true) {
    const page = await suiGrpcClient.listOwnedObjects({
      owner,
      type: BLUB_TYPE_PREFIX,
      cursor,
      include: { content: true } as const,
    });

    for (const obj of page.objects) {
      if (!obj.content) continue;

      try {
        blubs.push({
          objectId: obj.objectId,
          version: obj.version,
          digest: obj.digest,
          type: obj.type,
          content: decodeBlubContent(obj.content),
        });
      } catch (error) {
        console.error('Failed to decode Blub NFT', obj.objectId, error);
      }
    }

    if (!page.hasNextPage) return blubs;
    cursor = page.cursor ?? undefined;
  }
}
