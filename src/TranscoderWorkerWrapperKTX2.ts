/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompressedLevelBuffer } from '@pixi/compressed-textures';
import type { BASIS_FORMATS, BasisBinding } from './Basis';

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

/**
 * This wraps the transcoder web-worker functionality; it can be converted into a string to get the source code. It expects
 * you to prepend the transcoder JavaScript code so that the `BASIS` namespace is available.
 *
 * The transcoder worker responds to two types of messages: "init" and "transcode". You must always send the first "init"
 * {@link IInitializeTranscoderMessage} message with the WebAssembly binary; if the transcoder is successfully initialized,
 * the web-worker will respond by sending another {@link ITranscodeResponse} message with `success: true`.
 * @ignore
 */
export function TranscoderWorkerWrapperKTX2(): void {
    let KTX2Binding: BasisBinding;

    const messageHandlers = {
        init: (message: IInitializeTranscoderMessage): ITranscodeResponse | null => {
            // Already created global in 'pixi-basis-ktx2'.
            if (!self.BASIS) {
                console.warn('jsSource was not prepended?');

                return {
                    type: 'init',
                    success: false,
                };
            }

            void self.BASIS({ wasmBinary: message.wasmSource }).then((basisLibrary) => {
                basisLibrary.initializeBasis();
                KTX2Binding = basisLibrary;

                (self as any).postMessage({
                    type: 'init',
                    success: true,
                });
            });

            return null;
        },
        transcode(message: ITranscodeMessage): ITranscodeResponse {
            const basisData = message.basisData!;
            const BASIS = KTX2Binding;

            const data = basisData;
            const ktx2File = new BASIS.KTX2File(data);
            const imageCount = ktx2File.getLevels() * Math.max(1, ktx2File.getLayers()) * ktx2File.getFaces();
            let levels = ktx2File.getLevels();
            const layers = ktx2File.getLayers();
            const faces = ktx2File.getFaces();
            const hasAlpha = ktx2File.getHasAlpha();

            const basisFormat = hasAlpha ? message.rgbaFormat! : message.rgbFormat;
            const basisFallbackFormat = 14; // BASIS_FORMATS.cTFRGB565 (cannot import values into web-worker!)
            const imageArray = new Array(imageCount);

            let fallbackMode = false;

            if (!ktx2File.startTranscoding()) {
                ktx2File.close();
                ktx2File.delete();

                return {
                    type: 'transcode',
                    requestID: message.requestID,
                    success: false,
                };
            }

            for (let i = 0; i < levels; i++) {
                const imageResource: ITranscodedImage = {
                    imageID: i,
                    levelArray: new Array<{
                        levelID: number;
                        levelWidth: number;
                        levelHeight: number;
                        levelBuffer: Uint8Array;
                    }>(),
                };

                for (let j = 0; j < Math.max(1, layers); j++) {
                    for (let k = 0; k < faces; k++) {
                        const imageLevelInfo = ktx2File.getImageLevelInfo(i, j, k);
                        const width = imageLevelInfo.width;
                        const height = imageLevelInfo.height;
                        const format = !fallbackMode ? basisFormat : basisFallbackFormat;
                        const byteSize = ktx2File.getImageTranscodedSizeInBytes(i, j, k, format);

                        // Level 0 is texture's actual width, height
                        if (j === 0) {
                            const alignedWidth = (width + 3) & ~3;
                            const alignedHeight = (height + 3) & ~3;

                            imageResource.width = alignedWidth;
                            imageResource.height = alignedHeight;
                        }

                        const imageBuffer = new Uint8Array(byteSize);

                        if (!ktx2File.transcodeImage(imageBuffer, i, j, k, format, false, -1, -1)) {
                            if (fallbackMode) {
                                // We failed in fallback mode as well!
                                console.error(`Basis failed to transcode image ${i}, level ${j}!`);

                                return { type: 'transcode', requestID: message.requestID, success: false };
                            }

                            /* eslint-disable-next-line max-len */
                            console.warn(`Basis failed to transcode image ${i}, level ${j}! Retrying to an uncompressed texture format!`);
                            i = -1;
                            levels = 1;
                            fallbackMode = true;

                            break;
                        }

                        imageResource.levelArray.push({
                            levelID: j,
                            levelWidth: width,
                            levelHeight: height,
                            levelBuffer: imageBuffer,
                        });
                    }
                }
                imageArray[i] = imageResource;
            }

            ktx2File.close();
            ktx2File.delete();

            return {
                type: 'transcode',
                requestID: message.requestID,
                success: true,
                basisFormat: !fallbackMode ? basisFormat : basisFallbackFormat,
                imageArray,
            };
        },
    };

    self.onmessage = (e: { data: Partial<IInitializeTranscoderMessage | ITranscodeMessage> }): void => {
        const msg = e.data;
        const response = messageHandlers[msg.type!](msg as any);

        if (response) {
            (self as any).postMessage(response);
        }
    };
}
