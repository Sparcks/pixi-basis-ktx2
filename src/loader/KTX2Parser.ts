import { CompressedTextureResource } from '@pixi/compressed-textures';
import { BufferResource, settings, TYPES } from '@pixi/core';
import {
    BASIS_FORMAT_TO_INTERNAL_FORMAT,
    BASIS_FORMATS,
    BASIS_FORMATS_ALPHA,
    INTERNAL_FORMAT_TO_BASIS_FORMAT,
} from '../Basis';
import { TranscoderWorkerKTX2 } from '../TranscoderWorkerKTX2';

import type { CompressedLevelBuffer, INTERNAL_FORMATS } from '@pixi/compressed-textures';
import type {
    BasisBinding,
    BasisTextureExtensions,
    TranscodedResourcesArray
} from '../Basis';

/**
 * Loader plugin for handling KTX2 supercompressed texture files.
 *
 * To use this loader, you must bind the basis_universal WebAssembly transcoder. There are two ways of
 * doing this:
 *
 * 1. Adding a &lt;script&gt; tag to your HTML page to the transcoder bundle in this package, and serving
 * the WASM binary from the same location.
 *
 * ```html
 * <!-- Copy ./node_modules/pixi-basis-ktx2/assets/basis_transcoder.wasm into your assets directory
 *     as well, so it is served from the same folder as the JavaScript! -->
 * <script src="./node_modules/pixi-basis-ktx2/assets/basis_transcoder.js"></script>
 * ```
 *
 * NOTE: `basis_transcoder.js` expects the WebAssembly binary to be named `basis_transcoder.wasm`.
 * NOTE-2: This method supports transcoding on the main-thread. Only use this if you have 1 or 2 *.ktx2
 * files.
 *
 * 2. Loading the transcoder source from a URL.
 *
 * ```js
 * // Use this if you to use the default CDN url for pixi-basis-ktx2
 * KTX2Parser.loadTranscoder();
 *
 * // Use this if you want to serve the transcoder on your own
 * KTX2Parser.loadTranscoder('./basis_transcoder.js', './basis_transcoder.wasm');
 * ```
 *
 * NOTE: This can only be used with web-workers.
 * @class
 * @memberof PIXI
 * @implements {PIXI.ILoaderPlugin}
 */
export class KTX2Parser
{
    public static ktx2Binding: BasisBinding;
    private static defaultRGBFormat: { basisFormat: BASIS_FORMATS, textureFormat: INTERNAL_FORMATS | TYPES };
    private static defaultRGBAFormat: { basisFormat: BASIS_FORMATS, textureFormat: INTERNAL_FORMATS | TYPES };
    private static fallbackMode = false;
    private static workerPool: TranscoderWorkerKTX2[] = [];

    /**
     * Runs transcoding and populates {@link imageArray}. It will run the transcoding in a web worker
     * if they are available.
     * @private
     */
    public static async transcode(arrayBuffer: ArrayBuffer): Promise<TranscodedResourcesArray>
    {
        let resources: TranscodedResourcesArray;

        if (typeof Worker !== 'undefined' && KTX2Parser.TranscoderWorker.wasmSource)
        {
            resources = await KTX2Parser.transcodeAsync(arrayBuffer);
        }
        else
        {
            resources = KTX2Parser.transcodeSync(arrayBuffer);
        }

        return resources;
    }

    /**
     * Finds a suitable worker for transcoding and sends a transcoding request
     * @private
     * @async
     */
    public static async transcodeAsync(arrayBuffer: ArrayBuffer): Promise<TranscodedResourcesArray>
    {
        if (!KTX2Parser.defaultRGBAFormat && !KTX2Parser.defaultRGBFormat)
        {
            KTX2Parser.autoDetectFormats();
        }

        const workerPool = KTX2Parser.workerPool;

        let leastLoad = 0x10000000;
        let worker = null;

        for (let i = 0, j = workerPool.length; i < j; i++)
        {
            if (workerPool[i].load < leastLoad)
            {
                worker = workerPool[i];
                leastLoad = worker.load;
            }
        }

        if (!worker)
        {
            /* eslint-disable-next-line no-use-before-define */
            worker = new TranscoderWorkerKTX2();

            workerPool.push(worker);
        }

        // Wait until worker is ready
        await worker.initAsync();

        const response = await worker.transcodeAsync(
            new Uint8Array(arrayBuffer),
            KTX2Parser.defaultRGBAFormat.basisFormat,
            KTX2Parser.defaultRGBFormat.basisFormat,
        );

        const basisFormat = response.basisFormat;
        const imageArray = response.imageArray;

        // whether it is an uncompressed format
        const fallbackMode = basisFormat > 12;
        let imageResources: TranscodedResourcesArray;

        if (!fallbackMode)
        {
            const format = BASIS_FORMAT_TO_INTERNAL_FORMAT[response.basisFormat];

            // HINT: this.imageArray is CompressedTextureResource[]
            imageResources = new Array<CompressedTextureResource>(imageArray.length) as TranscodedResourcesArray;

            for (let i = 0, j = imageArray.length; i < j; i++)
            {
                imageResources[i] = new CompressedTextureResource(null, {
                    format,
                    width: imageArray[i].width,
                    height: imageArray[i].height,
                    levelBuffers: imageArray[i].levelArray,
                    levels: imageArray[i].levelArray.length,
                });
            }
        }
        else
        {
            // TODO: BufferResource does not support manual mipmapping.
            imageResources = imageArray.map((image) => new BufferResource(
                new Uint16Array(image.levelArray[0].levelBuffer.buffer), {
                    width: image.width,
                    height: image.height,
                }),
            ) as TranscodedResourcesArray;
        }

        imageResources.basisFormat = basisFormat;

        return imageResources;
    }

    /**
     * Runs transcoding on the main thread.
     * @private
     */
    public static transcodeSync(arrayBuffer: ArrayBuffer): TranscodedResourcesArray
    {
        if (!KTX2Parser.defaultRGBAFormat && !KTX2Parser.defaultRGBFormat)
        {
            KTX2Parser.autoDetectFormats();
        }

        const BASIS = KTX2Parser.ktx2Binding;
        let fallbackMode = KTX2Parser.fallbackMode;
        const data = new Uint8Array(arrayBuffer);
        const ktx2File = new BASIS.KTX2File(data);

        const dfdSize = ktx2File.getDFDSize();
        const dvdData = new Uint8Array(dfdSize);

        ktx2File.getDFD(dvdData);

        // Don't transcode all mipmap levels in fallback mode!
        const levels = !fallbackMode ? ktx2File.getLevels() : 1;
        const layers = ktx2File.getLayers();
        const faces = ktx2File.getFaces();
        const hasAlpha = ktx2File.getHasAlpha();
        const imageLevels = new Array<CompressedLevelBuffer>(levels);

        const basisFormat = hasAlpha
            ? KTX2Parser.defaultRGBAFormat.basisFormat
            : KTX2Parser.defaultRGBFormat.basisFormat;
        const basisFallbackFormat = BASIS_FORMATS.cTFRGB565;
        const imageResources = new Array<CompressedTextureResource | BufferResource>(levels);

        if (!ktx2File.startTranscoding())
        {
            // #if _DEBUG
            console.error(`Basis failed to start transcoding!`);
            // #endif

            ktx2File.close();
            ktx2File.delete();

            return null;
        }

        // Transcode mipmap levels into "imageLevels"
        for (let i = 0; i < levels; i++)
        {
            const firstLevel = ktx2File.getImageLevelInfo(i, 0, 0);
            const width = firstLevel.origWidth;
            const height = firstLevel.origHeight;
            const alignedWidth = (width + 3) & ~3;
            const alignedHeight = (height + 3) & ~3;

            for (let j = 0; j < Math.max(1, layers); j++)
            {
                for (let k = 0; k < faces; k++)
                {
                    const imageLevelInfo = ktx2File.getImageLevelInfo(i, j, k);
                    const levelWidth = imageLevelInfo.width;
                    const levelHeight = imageLevelInfo.height;
                    const byteSize = ktx2File.getImageTranscodedSizeInBytes(
                        i, j, k, !fallbackMode ? basisFormat : basisFallbackFormat);

                    imageLevels[j] = {
                        levelID: j,
                        levelBuffer: new Uint8Array(byteSize),
                        levelWidth,
                        levelHeight,
                    };

                    if (!ktx2File.transcodeImage(
                        // eslint-disable-next-line max-len
                        imageLevels[j].levelBuffer, i, j, k, !fallbackMode ? basisFormat : basisFallbackFormat, false, -1, -1))
                    {
                        if (fallbackMode)
                        {
                            // #if _DEBUG
                            console.error(`Basis failed to transcode image ${i}, level ${0}!`);
                            // #endif
                            break;
                        }
                        else
                        {
                            // Try transcoding to an uncompressed format before giving up!
                            // NOTE: We must start all over again as all Resources must be in compressed OR uncompressed.
                            i = -1;
                            fallbackMode = true;

                            // #if _DEBUG
                            /* eslint-disable-next-line max-len */
                            console.warn(`Basis failed to transcode image ${i}, level ${0} to a compressed texture format. Retrying to an uncompressed fallback format!`);
                            // #endif
                            continue;
                        }
                    }
                }
            }

            let imageResource;

            if (!fallbackMode)
            {
                imageResource = new CompressedTextureResource(null, {
                    format: BASIS_FORMAT_TO_INTERNAL_FORMAT[basisFormat],
                    width: alignedWidth,
                    height: alignedHeight,
                    levelBuffers: imageLevels,
                    levels,
                });
            }
            else
            {
                // TODO: BufferResource doesn't support manual mipmap levels
                imageResource = new BufferResource(
                    new Uint16Array(imageLevels[0].levelBuffer.buffer), { width, height });
            }

            imageResources[i] = imageResource;
        }

        ktx2File.close();
        ktx2File.delete();

        const transcodedResources = imageResources as TranscodedResourcesArray;

        transcodedResources.basisFormat = !fallbackMode ? basisFormat : basisFallbackFormat;

        return transcodedResources;
    }

    /**
     * Detects the available compressed texture formats on the device.
     * @param extensions - extensions provided by a WebGL context
     * @ignore
     */
    static autoDetectFormats(extensions?: Partial<BasisTextureExtensions>): void
    {
        // Auto-detect WebGL compressed-texture extensions
        if (!extensions)
        {
            const canvas = settings.ADAPTER.createCanvas();
            const gl = canvas.getContext('webgl');

            if (!gl)
            {
                console.error('WebGL not available for BASIS transcoding. Silently failing.');

                return;
            }

            extensions = {
                s3tc: gl.getExtension('WEBGL_compressed_texture_s3tc'),
                s3tc_sRGB: gl.getExtension('WEBGL_compressed_texture_s3tc_srgb'), /* eslint-disable-line camelcase */
                astc: gl.getExtension('WEBGL_compressed_texture_astc'),
                etc: gl.getExtension('WEBGL_compressed_texture_etc'),
                etc1: gl.getExtension('WEBGL_compressed_texture_etc1'),
                pvrtc: gl.getExtension('WEBGL_compressed_texture_pvrtc')
                    || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc'),
                atc: gl.getExtension('WEBGL_compressed_texture_atc'),
            };
        }

        // Discover the available texture formats
        const supportedFormats: { [id: string]: INTERNAL_FORMATS } = {};

        for (const key in extensions)
        {
            const extension = (extensions as any)[key];

            if (!extension)
            {
                continue;
            }

            Object.assign(supportedFormats, Object.getPrototypeOf(extension));
        }

        // Set the default alpha/non-alpha output formats for basisu transcoding
        for (let i = 0; i < 2; i++)
        {
            const detectWithAlpha = !!i;
            let internalFormat: number;
            let basisFormat: number;

            for (const id in supportedFormats)
            {
                internalFormat = supportedFormats[id];
                basisFormat = INTERNAL_FORMAT_TO_BASIS_FORMAT[internalFormat];

                if (basisFormat !== undefined)
                {
                    if ((detectWithAlpha && BASIS_FORMATS_ALPHA[basisFormat])
                        || (!detectWithAlpha && !BASIS_FORMATS_ALPHA[basisFormat]))
                    {
                        break;
                    }
                }
            }

            if (internalFormat)
            {
                KTX2Parser[detectWithAlpha ? 'defaultRGBAFormat' : 'defaultRGBFormat'] = {
                    textureFormat: internalFormat,
                    basisFormat,
                };
            }
            else
            {
                KTX2Parser[detectWithAlpha ? 'defaultRGBAFormat' : 'defaultRGBFormat'] = {
                    textureFormat: TYPES.UNSIGNED_SHORT_5_6_5,
                    basisFormat: BASIS_FORMATS.cTFRGB565,
                };

                KTX2Parser.fallbackMode = true;
            }
        }
    }

    /**
     * Binds the basis_universal transcoder to decompress *.ktx2 files. You must initialize the transcoder library yourself.
     * @example
     * import { KTX2Parser } from 'pixi-basis-ktx2';
     *
     * // BASIS() returns a Promise-like object
     * globalThis.BASIS().then((basisLibrary) =>
     * {
     *     // Initialize basis-library; otherwise, transcoded results maybe corrupt!
     *     basisLibrary.initializeBasis();
     *
     *     // Bind KTX2Parser to the transcoder
     *     KTX2Parser.bindTranscoder(basisLibrary);
     * });
     * @param basisLibrary - the initialized transcoder library
     * @private
     */
    static bindTranscoder(basisLibrary: BasisBinding): void
    {
        KTX2Parser.ktx2Binding = basisLibrary;
    }

    /**
     * Loads the transcoder source code for use in {@link PIXI.KTX2Parser.TranscoderWorker}.
     * @private
     * @param jsURL - URL to the javascript basis transcoder
     * @param wasmURL - URL to the wasm basis transcoder
     */
    static loadTranscoder(jsURL: string, wasmURL: string): Promise<[void, void]>
    {
        return KTX2Parser.TranscoderWorker.loadTranscoder(jsURL, wasmURL);
    }

    /**
     * Set the transcoder source code directly
     * @private
     * @param jsSource - source for the javascript basis transcoder
     * @param wasmSource - source for the wasm basis transcoder
     */
    static setTranscoder(jsSource: string, wasmSource: ArrayBuffer): void
    {
        KTX2Parser.TranscoderWorker.setTranscoder(jsSource, wasmSource);
    }

    static TranscoderWorker: typeof TranscoderWorkerKTX2 = TranscoderWorkerKTX2;

    static get TRANSCODER_WORKER_POOL_LIMIT(): number
    {
        return this.workerPool.length || 1;
    }

    static set TRANSCODER_WORKER_POOL_LIMIT(limit: number)
    {
        // TODO: Destroy workers?
        for (let i = this.workerPool.length; i < limit; i++)
        {
            this.workerPool[i] = new TranscoderWorkerKTX2();
            this.workerPool[i].initAsync();
        }
    }
}
