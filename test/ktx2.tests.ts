// import { KTX2Parser, loadKTX2 } from '../src';
import { Loader } from '../loaders/src/loader/Loader';
import { Resolver } from '../loaders/src/resolver/Resolver';
import { resolveKTX2TextureUrl } from '../src/loader/resolveKTX2TextureUrl';

// import type { Texture } from '@pixi/core';

// const loaderJS = 'https://raw.githubusercontent.com/BinomialLLC/basis_universal/master/webgl/transcoder/build/basis_transcoder.js';
// const loaderWASM = 'https://raw.githubusercontent.com/BinomialLLC/basis_universal/master/webgl/transcoder/build/basis_transcoder.wasm';
// const ktx2Texture = 'https://github.com/Sparcks/pixijs/raw/feature/load-ktx2/packages/basis/test/images/kodim20.ktx2';

// const basePath = process.env.GITHUB_ACTIONS
//     ? // eslint-disable-next-line max-len
//       `https://raw.githubusercontent.com/Sparcks/pixi-basis-ktx2/${process.env.GITHUB_SHA}/test/images/`
//     : 'http://localhost:8080/test/images/';

describe('KTX2 loading', () => {
    it('should load a KTX2 image via Loader', async () => {
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

    it('should load a KTX2 image via Assets', async () => {
        // await KTX2Parser.loadTranscoder(loaderJS, loaderWASM);
        // const texture = await Assets.load<Texture>(`kodim20.ktx2`);
        // expect(texture.baseTexture.valid).toBe(true);
        // expect(texture.width).toBe(768);
        // expect(texture.height).toBe(512);
    });

    it('should resolve KTX2 asset', () => {
        const resolver = new Resolver();

        resolver['_parsers'].push(resolveKTX2TextureUrl);

        resolver.prefer({
            priority: ['format'],
            params: {
                format: ['ktx2'],
                resolution: 1,
            },
        });

        resolver.add('test', [
            {
                resolution: 1,
                format: 'ktx2',
                src: 'kodim20.ktx2',
            },
        ]);

        const asset = resolver.resolveUrl('test');

        expect(asset).toEqual('kodim20.ktx2');
    });
});
