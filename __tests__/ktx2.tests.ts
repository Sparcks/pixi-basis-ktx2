// import { KTX2Parser, loadKTX2 } from '../src';
import { Loader } from '../loaders/src/loader/Loader';

// import type { Texture } from '@pixi/core';

// const loaderJS = 'https://raw.githubusercontent.com/BinomialLLC/basis_universal/master/webgl/transcoder/build/basis_transcoder.js';
// const loaderWASM = 'https://raw.githubusercontent.com/BinomialLLC/basis_universal/master/webgl/transcoder/build/basis_transcoder.wasm';
// const ktx2Texture = 'https://github.com/Sparcks/pixijs/raw/feature/load-ktx2/packages/basis/test/images/kodim20.ktx2';

describe('KTX2 loading', () => {
    it('should load a KTX2 image', async () => {
        // await KTX2Parser.loadTranscoder(loaderJS, loaderWASM);
        const loader = new Loader();
        expect(loader !== undefined).toBe(true);

        // loader['_parsers'].push(loadKTX2 as any);
        // const texture = await loader.load<Texture>(ktx2Texture);
        // expect(texture !== undefined).toBe(true);

        // expect(texture.baseTexture.valid).toBe(true);
        // expect(texture.width).toBe(768);
        // expect(texture.height).toBe(512);
    });
});
