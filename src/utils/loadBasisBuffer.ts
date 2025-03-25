/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createTexture } from '@pixi/assets';
import { CompressedTextureResource } from '@pixi/compressed-textures';
import { ALPHA_MODES, BaseTexture, FORMATS, MIPMAP_MODES } from '@pixi/core';
import { BASIS_FORMAT_TO_TYPE, BASIS_FORMATS } from '../compressions';
import { TranscoderWorkerBasis } from '../transcoderWorkerBasis';
import { BasisParser } from '../loader/BasisParser';

import type { Loader } from '@pixi/assets';
import type { Texture, TYPES } from '@pixi/core';

export async function loadBasisBufferToTexture(byteArr: Uint8Array, fileName: string, loader: Loader): Promise<Texture | undefined> {
    await TranscoderWorkerBasis.onTranscoderInitialized;
    const resources = await BasisParser.transcode(byteArr.buffer as ArrayBuffer);
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

export async function loadBasisBufferToArray(byteArr: Uint8Array, fileName: string, loader: Loader): Promise<Texture[]> {
    await TranscoderWorkerBasis.onTranscoderInitialized;
    const resources = await BasisParser.transcode(byteArr.buffer as ArrayBuffer);
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
