// import { BasisParser, loadBasis } from '../src';
// import { Loader } from '../loaders/src/loader/Loader';
// import { Resolver } from '../loaders/src/resolver/Resolver';
// import { resolveCompressedTextureUrl } from '@pixi/compressed-textures';

// import type { Texture } from '@pixi/core';

// const loaderJS = 'https://raw.githubusercontent.com/BinomialLLC/basis_universal/master/webgl/transcoder/build/basis_transcoder.js';
// const loaderWASM = 'https://raw.githubusercontent.com/BinomialLLC/basis_universal/master/webgl/transcoder/build/basis_transcoder.wasm';
// const basisTexture = 'https://github.com/Sparcks/pixijs/raw/feature/load-ktx2/packages/basis/test/images/kodim20.basis';

// const basePath = process.env.GITHUB_ACTIONS
//     ? // eslint-disable-next-line max-len
//       `https://raw.githubusercontent.com/Sparcks/pixi-basis-ktx2/${process.env.GITHUB_SHA}/test/images/`
//     : 'http://localhost:8080/test/images/';

describe('Basis loading', () => {
    it('should load a Basis image via Loader', async () => {
        // await BasisParser.loadTranscoder(loaderJS, loaderWASM);
        // const loader = new Loader();
        // expect(loader !== undefined).toBe(true);
        // loader['_parsers'].push(loadBasis as any);
        // const texture = await loader.load<Texture>(basisTexture);
        // expect(texture !== undefined).toBe(true);
        // expect(texture.baseTexture.valid).toBe(true);
        // expect(texture.width).toBe(768);
        // expect(texture.height).toBe(512);
    });

    it('should load a Basis image via Assets', async () => {
        // await BasisParser.loadTranscoder(loaderJS, loaderWASM);
        // const texture = await Assets.load<Texture>(`kodim20.basis`);
        // expect(texture.baseTexture.valid).toBe(true);
        // expect(texture.width).toBe(768);
        // expect(texture.height).toBe(512);
    });

    it('should resolve Basis asset', () => {
        // const resolver = new Resolver();
        // resolver['_parsers'].push(resolveCompressedTextureUrl);
        // resolver.prefer({
        //     priority: ['format'],
        //     params: {
        //         format: ['basis'],
        //         resolution: 1,
        //     },
        // });
        // resolver.add('test', [
        //     {
        //         resolution: 1,
        //         format: 'basis',
        //         src: 'kodim20.basis',
        //     },
        // ]);
        // const asset = resolver.resolveUrl('test');
        // expect(asset).toEqual('kodim20.basis');
    });
});
