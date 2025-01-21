# pixi-basis-ktx2

This package contains the parser for _.basis & _.ktx2 files, and it also ships with the transcoder.

## Installation

```bash
npm install pixi-basis-ktx2
```

## Usage

Import loadKTX2 and/or loadBasis it into your class and add them as pixi loader parser (Typescript example):

```ts
import {loadKTX2, loadBasis, detectKTX2, detectBasis, resolveKTX2TextureUrl } from 'pixi-basis-ktx2';
import * as Pixi from 'pixi.js';

constructor() {
    // Adding needed parsers & detections
    // KTX2
    Pixi.Assets.loader.parsers.push(loadKTX2);
    Pixi.Assets.detections.push(detectKTX2);
    Pixi.Assets.resolver.parsers.push(resolveKTX2TextureUrl);
    // Basis
    Pixi.Assets.loader.parsers.push(loadBasis);
    Pixi.Assets.detections.push(detectBasis);
    //Pixi already added .basis in compressed textures resolver
}
```

Import KTX2Parser and/or BasisParser it into your class and load the transcoders (Typescript example):

```ts
import {KTX2Parser, BasisParser} from 'pixi-basis-ktx2';

private async init(): Promise<void> {
    // KTX2
    await KTX2Parser.loadTranscoder('YOUR_URL_TO/basis_transcoder.js', 'YOUR_URL_TO/basis_transcoder.wasm');
    // Basis
    await BasisParser.loadTranscoder('YOUR_URL_TO/basis_transcoder.js', 'YOUR_URL_TO/basis_transcoder.wasm');
}
```

Load your .ktx2 and/or .basis file as Pixi Texture with Asset.load (Typescript example):

```ts
import * as Pixi from 'pixi.js';

private async loadTexture(): Promise<void> {
    // KTX2
    const textureKTXTwo = (await Pixi.Assets.load<Pixi.Texture>('YOUR_PATH_TO/image.ktx2'));
    // Basis
    const textureBasis = (await Pixi.Assets.load<Pixi.Texture>('YOUR_PATH_TO/image.basis'));
}
```

Load your .ktx2 and/or .basis file as Pixi AnimationSprite with Asset.load (Typescript example):

```ts
import * as Pixi from 'pixi.js';

private async loadSpriteAnimation(): Promise<void> {
    // KTX2
    const spritePaths = ["path/image1.ktx2", "path/image2.ktx2"];
    const textureArray: Pixi.Texture[] = [];
    for (let i = 0; i < spritePaths.length; i++) {
        const textureKTXTwo = new Pixi.Texture((await Pixi.Assets.load<Pixi.BaseTexture>(spritePaths[i])));
        textureArray.push(textureKTXTwo);
    }
    const spriteAnim = new Pixi.AnimatedSprite(textureArray);

    // Basis
    const spritePaths = ["path/image1.basis", "path/image2.basis"];
    const textureArray: Pixi.Texture[] = [];
    for (let i = 0; i < spritePaths.length; i++) {
        const textureBasis = new Pixi.Texture((await Pixi.Assets.load<Pixi.BaseTexture>(spritePaths[i])));
        textureArray.push(textureBasis);
    }
    const spriteAnim = new Pixi.AnimatedSprite(textureArray);
}
```

Load your .ktx2 and/or .basis array buffer data as Pixi Texture (Typescript example):

```ts
import { loadKTX2BufferToTexture, loadKTX2BufferToArray, loadBasisBufferToTexture, loadKTX2BufferToArray } from 'pixi-basis-ktx2';
import * as Pixi from 'pixi.js';

private async loadTextureFromBuffer(byteArr: Uint8Array, fileName: string): Promise<void> {
    // KTX2
    const textureKTXTwo = loadKTX2BufferToTexture(byteArr, fileName, Pixi.Assets.loader); // Texture
    const textureKTXTwoArr = loadKTX2BufferToArray(byteArr, fileName, Pixi.Assets.loader); // Texture[]
    // Basis
    const textureBasis = loadBasisBufferToTexture(byteArr, fileName, Pixi.Assets.loader); // Texture
    const textureBasisArr = loadKTX2BufferToArray(byteArr, fileName, Pixi.Assets.loader); // Texture[]
}
```
