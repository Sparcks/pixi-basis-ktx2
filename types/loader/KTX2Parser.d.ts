import { TranscoderWorkerKTX2 } from '../TranscoderWorkerKTX2';
import type { BasisBinding, BasisTextureExtensions, TranscodedResourcesArray } from '../Basis';
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
export declare class KTX2Parser {
    static ktx2Binding: BasisBinding;
    private static defaultRGBFormat;
    private static defaultRGBAFormat;
    private static fallbackMode;
    private static workerPool;
    /**
     * Runs transcoding and populates {@link imageArray}. It will run the transcoding in a web worker
     * if they are available.
     * @private
     */
    static transcode(arrayBuffer: ArrayBuffer): Promise<TranscodedResourcesArray | null>;
    /**
     * Finds a suitable worker for transcoding and sends a transcoding request
     * @private
     * @async
     */
    static transcodeAsync(arrayBuffer: ArrayBuffer): Promise<TranscodedResourcesArray>;
    /**
     * Runs transcoding on the main thread.
     * @private
     */
    static transcodeSync(arrayBuffer: ArrayBuffer): TranscodedResourcesArray | null;
    /**
     * Detects the available compressed texture formats on the device.
     * @param extensions - extensions provided by a WebGL context
     * @ignore
     */
    static autoDetectFormats(extensions?: Partial<BasisTextureExtensions>): void;
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
    static bindTranscoder(basisLibrary: BasisBinding): void;
    /**
     * Loads the transcoder source code for use in {@link PIXI.KTX2Parser.TranscoderWorker}.
     * @private
     * @param jsURL - URL to the javascript basis transcoder
     * @param wasmURL - URL to the wasm basis transcoder
     */
    static loadTranscoder(jsURL: string, wasmURL: string): Promise<[void, void]>;
    /**
     * Set the transcoder source code directly
     * @private
     * @param jsSource - source for the javascript basis transcoder
     * @param wasmSource - source for the wasm basis transcoder
     */
    static setTranscoder(jsSource: string, wasmSource: ArrayBuffer): void;
    static TranscoderWorker: typeof TranscoderWorkerKTX2;
    static get TRANSCODER_WORKER_POOL_LIMIT(): number;
    static set TRANSCODER_WORKER_POOL_LIMIT(limit: number);
}
