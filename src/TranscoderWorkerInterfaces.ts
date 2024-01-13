import { CompressedLevelBuffer } from '@pixi/compressed-textures';
import { BASIS_FORMATS } from './Basis';

/**
 * Initialization message sent by the main thread.
 * @ignore
 */
export interface IInitializeTranscoderMessage {
    wasmSource: ArrayBuffer;
    type: 'init';
}

/**
 * Request parameters for transcoding basis files. It only supports transcoding all of the basis file at once.
 * @ignore
 */
export interface ITranscodeMessage {
    requestID?: number;
    rgbFormat: number;
    rgbaFormat?: number;
    basisData?: Uint8Array;
    type: 'transcode';
}

/** @ignore */
export interface ITranscodedImage {
    imageID: number;
    levelArray: Array<{
        levelID: number;
        levelWidth: number;
        levelHeight: number;
        levelBuffer: Uint8Array;
    }>;
    width?: number;
    height?: number;
}

/**
 * Response format for {@link TranscoderWorker}.
 * @ignore
 */
export interface ITranscodeResponse {
    type: 'init' | 'transcode';
    requestID?: number;
    success: boolean;
    basisFormat?: BASIS_FORMATS;
    imageArray?: Array<{
        imageID: number;
        levelArray: Array<CompressedLevelBuffer>;
        width: number;
        height: number;
    }>;
}
