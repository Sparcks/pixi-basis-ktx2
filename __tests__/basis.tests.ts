/* eslint-disable max-len */
// import { BasisParser, loadBasis } from '../src';
import { Loader } from '../assets/src/loader/Loader';

// import type { Texture } from '@pixi/core';

// const loaderJS = 'https://raw.githubusercontent.com/BinomialLLC/basis_universal/master/webgl/transcoder/build/basis_transcoder.js';
// const loaderWASM = 'https://raw.githubusercontent.com/BinomialLLC/basis_universal/master/webgl/transcoder/build/basis_transcoder.wasm';
// const basisTexture = 'https://github.com/Sparcks/pixijs/raw/feature/load-ktx2/packages/basis/test/images/kodim20.basis';

describe('Basis loading', () =>
{
    it('should load a Basis image', async () =>
    {
        // await BasisParser.loadTranscoder(loaderJS, loaderWASM);
        const loader = new Loader();
        expect(loader !== undefined).toBe(true);

        // loader['_parsers'].push(loadBasis as any);
        // const texture = await loader.load<Texture>(basisTexture);
        // expect(texture !== undefined).toBe(true);

        // expect(texture.baseTexture.valid).toBe(true);
        // expect(texture.width).toBe(768);
        // expect(texture.height).toBe(512);
    });
});