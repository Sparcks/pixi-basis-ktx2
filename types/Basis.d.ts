import { INTERNAL_FORMATS } from '@pixi/compressed-textures';
import { TYPES } from '@pixi/core';
import type { CompressedTextureResource } from '@pixi/compressed-textures';
import type { BufferResource } from '@pixi/core';
/**
 * The transcoding formats provided by basis_universal.
 *
 * NOTE: Not all of these formats are supported on WebGL!
 * @ignore
 */
export declare enum BASIS_FORMATS {
    cTFETC1 = 0,
    cTFETC2 = 1,
    cTFBC1 = 2,
    cTFBC3 = 3,
    cTFBC4 = 4,
    cTFBC5 = 5,
    cTFBC7 = 6,
    cTFPVRTC1_4_RGB = 8,
    cTFPVRTC1_4_RGBA = 9,
    cTFASTC_4x4 = 10,
    cTFATC_RGB = 11,
    cTFATC_RGBA_INTERPOLATED_ALPHA = 12,
    cTFRGBA32 = 13,
    cTFRGB565 = 14,
    cTFBGR565 = 15,
    cTFRGBA4444 = 16
}
/**
 * Maps {@link BASIS_FORMATS} to {@link PIXI.INTERNAL_FORMATS}
 * @ignore
 */
export declare const BASIS_FORMAT_TO_INTERNAL_FORMAT: {
    [id: number]: INTERNAL_FORMATS;
};
/**
 * Maps {@link BASIS_FORMATS} to {@link PIXI.TYPES}. These formats are a fallback when the basis file cannot be transcoded
 * to a valid compressed texture format.
 *
 * NOTE: {@link BASIS_FORMATS.cTFBGR565} is not supported, while {@link BASIS_FORMATS.cTFRGBA4444} is not implemented by
 *  [at]pixi/basis.
 * @ignore
 */
export declare const BASIS_FORMAT_TO_TYPE: {
    [id: number]: TYPES;
};
/**
 * Maps {@link PIXI.INTERNAL_FORMATS} to {@link BASIS_FORMATS}
 * @ignore
 */
export declare const INTERNAL_FORMAT_TO_BASIS_FORMAT: {
    [id: number]: number;
};
/**
 * Enumerates the basis formats with alpha components
 * @ignore
 */
export declare const BASIS_FORMATS_ALPHA: {
    [id: number]: boolean;
};
export type TranscodedResourcesArray = (Array<CompressedTextureResource> | Array<BufferResource>) & {
    basisFormat: BASIS_FORMATS;
};
/**
 * Binding to C++ {@code BasisFile} wrapper class.
 * @see https://github.com/BinomialLLC/basis_universal/blob/master/webgl/transcoder/basis_wrappers.cpp
 * @see https://github.com/BinomialLLC/basis_universal/blob/master/webgl/texture/index.html
 * @private
 */
export declare class BasisFile {
    constructor(buffer: Uint8Array);
    getNumImages(): number;
    getNumLevels(imageId: number): number;
    getImageWidth(imageId: number, level: number): number;
    getImageHeight(imageId: number, level: number): number;
    getHasAlpha(): boolean;
    startTranscoding(): boolean;
    getImageTranscodedSizeInBytes(imageId: number, level: number, basisFormat: number): number;
    transcodeImage(dstBuff: Uint8Array, imageId: number, level: number, basisFormat: BASIS_FORMATS, pvrtcWrapAddressing: boolean, getAlphaForOpaqueFormats: boolean): number;
    close(): void;
    delete(): void;
}
/**
 * Compressed texture extensions relevant to the formats into which Basis can decompress into.
 * @ignore
 */
export type BasisTextureExtensions = {
    s3tc?: WEBGL_compressed_texture_s3tc;
    s3tc_sRGB?: WEBGL_compressed_texture_s3tc_srgb;
    etc: any;
    etc1: any;
    pvrtc: any;
    atc: any;
    astc?: WEBGL_compressed_texture_astc;
};
/**
 * Interface for the KTX2 image  level info.
 * @ignore
 */
export interface KTX2LevelInfo {
    levelIndex: number;
    layerIndex: number;
    faceIndex: number;
    origWidth: number;
    origHeight: number;
    width: number;
    height: number;
    numBlocksX: number;
    numBlocksY: number;
    totalBlocks: number;
    alphaFlag: number;
    iframeFlag: number;
}
/**
 * Binding to C++ {@code KTX2File} wrapper class.
 * @see https://github.com/BinomialLLC/basis_universal/blob/master/webgl/transcoder/basis_wrappers.cpp
 * @see https://github.com/BinomialLLC/basis_universal/blob/master/webgl/ktx2_encode_test/index.html
 * @private
 */
export declare class KTX2File {
    constructor(buffer: Uint8Array);
    getLevels(): number;
    getLayers(): number;
    getFaces(): number;
    getWidth(): number;
    getHeight(): number;
    getHasAlpha(): boolean;
    getDFD(data: Uint8Array): number;
    getDFDSize(): number;
    startTranscoding(): boolean;
    getImageLevelInfo(level_index: number, layer_index: number, face_index: number): KTX2LevelInfo;
    getImageTranscodedSizeInBytes(level: number, layer: number, face: number, basisFormat: number): number;
    transcodeImage(dstBuff: Uint8Array, level: number, layer: number, face: number, basisFormat: BASIS_FORMATS, getAlphaForOpaqueFormats: boolean, channel0: number, channel1: number): number;
    close(): void;
    delete(): void;
}
/** API provided by basis_universal WebGL library. */
export type BasisBinding = {
    BasisFile: typeof BasisFile;
    KTX2File: typeof KTX2File;
    initializeBasis: () => void;
};
/**
 * Binding to basis_universal WebGL library.
 * @see https://github.com/BinomialLLC/basis_universal/blob/master/webgl/transcoder/build/basis_transcoder.js
 * @ignore
 */
export type BASIS = (opts?: {
    wasmBinary: ArrayBuffer;
}) => Promise<BasisBinding>;
