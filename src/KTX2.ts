import type { BASIS_FORMATS } from './Basis';

/**
 * Interface for the KTX2 image  level info.
 * @ignore
 */
export interface KTX2LevelInfo
{
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
export declare class KTX2File
{
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
    getImageLevelInfo(
        level_index: number,
        layer_index: number,
        face_index: number): KTX2LevelInfo;
    getImageTranscodedSizeInBytes(
        level: number,
        layer: number,
        face: number,
        basisFormat: number): number;
    transcodeImage(dstBuff: Uint8Array,
        level: number,
        layer: number,
        face: number,
        basisFormat: BASIS_FORMATS,
        getAlphaForOpaqueFormats: boolean,
        channel0: number,
        channel1: number): number;
    close(): void;
    delete(): void;
}
