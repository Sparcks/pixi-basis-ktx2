import { createTexture } from '@pixi/assets';
import { CompressedTextureResource } from '@pixi/compressed-textures';
import { ALPHA_MODES, BaseTexture, FORMATS, MIPMAP_MODES } from '@pixi/core';
import { BASIS_FORMAT_TO_TYPE, BASIS_FORMATS } from '../compressions';
import { TranscoderWorkerKTX2 } from '../TranscoderWorkerKTX2';
import { KTX2Parser } from '../loader/KTX2Parser';

import type { Loader } from '@pixi/assets';
import type { Texture, TYPES } from '@pixi/core';

export async function loadKTX2BufferToTexture(byteArr: Uint8Array, fileName: string, loader: Loader): Promise<Texture | undefined> {
    await TranscoderWorkerKTX2.onTranscoderInitialized;
    const resources = await KTX2Parser.transcode(byteArr.buffer as ArrayBuffer);
    const type: TYPES | undefined = resources?.basisFormat ? BASIS_FORMAT_TO_TYPE[resources?.basisFormat] : undefined;
    const format: FORMATS = resources?.basisFormat !== BASIS_FORMATS.cTFRGBA32 ? FORMATS.RGB : FORMATS.RGBA;
    if (!resources || !resources[0]) return undefined;

    const mainResource = resources[0];
    const base = new BaseTexture(mainResource, {
        mipmap: mainResource instanceof CompressedTextureResource && mainResource.levels > 1 ? MIPMAP_MODES.ON_MANUAL : MIPMAP_MODES.OFF,
        alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
        type,
        format,
    });
    const texture = createTexture(base, loader, fileName);
    return texture;
}

export async function loadKTX2BufferToArray(byteArr: Uint8Array, fileName: string, loader: Loader): Promise<Texture[]> {
    await TranscoderWorkerKTX2.onTranscoderInitialized;
    const resources = await KTX2Parser.transcode(byteArr.buffer as ArrayBuffer);
    const type: TYPES | undefined = resources?.basisFormat ? BASIS_FORMAT_TO_TYPE[resources?.basisFormat] : undefined;
    const format: FORMATS = resources?.basisFormat !== BASIS_FORMATS.cTFRGBA32 ? FORMATS.RGB : FORMATS.RGBA;

    const textures =
        resources?.map((resource) => {
            const base = new BaseTexture(resource, {
                mipmap: resource instanceof CompressedTextureResource && resource.levels > 1 ? MIPMAP_MODES.ON_MANUAL : MIPMAP_MODES.OFF,
                alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
                type,
                format,
            });
            const texture = createTexture(base, loader, fileName);
            return texture;
        }) ?? [];

    return textures;
}
