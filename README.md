# pixi-basis-ktx2

This package contains the parser for _.basis & _.ktx2 files, and it also ships with the transcoder.

## Installation

```bash
npm install pixi-basis-ktx2
```

## Usage

Import loadKTX2 and/or loadBasis it into your class and add them as pixi loader parser (Typescript example):

```ts
import {loadKTX2, loadBasis} from 'pixi-basis-ktx2';
import * as Pixi from 'pixi.js';

constructor() {
    // KTX2
    Pixi.Assets.loader.parsers.push(loadKTX2);
    // Basis
    Pixi.Assets.loader.parsers.push(loadBasis);
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

Load your .ktx2 and/or .basis file as Pixi Texture (Typescript example):

```ts
private async loadTexture(): Promise<void> {
    // KTX2
    const textureKTXTwo = (await Pixi.Assets.load('YOUR_PATH_TO/image.ktx2')) as Pixi.Texture;
    // Basis
    const textureBasis = (await Pixi.Assets.load('YOUR_PATH_TO/image.basis')) as Pixi.Texture;
}
```

## CDN Install

Via jsDelivr:

```html
<!-- This script tag should be placed after pixi.min.js -->
<script src="https://cdn.jsdelivr.net/npm/pixi-basis-ktx2@0.x/dist/pixi-basis-ktx2.min.js"></script>
```

Or via unpkg:

```html
<!-- This script tag should be placed after pixi.min.js -->
<script src="https://unpkg.com/pixi-basis-ktx2@0.x/dist/pixi-basis-ktx2.min.js"></script>
```
