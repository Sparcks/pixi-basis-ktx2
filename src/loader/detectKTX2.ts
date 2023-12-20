import { extensions, ExtensionType } from '@pixi/core';
import { KTX2Parser } from './KTX2Parser';

import type { FormatDetectionParser } from '@pixi/assets';

export const detectKTX2 = {
    extension: {
        type: ExtensionType.DetectionParser,
        priority: 3,
    },
    test: async (): Promise<boolean> => !!(KTX2Parser.ktx2Binding && KTX2Parser.TranscoderWorker.wasmSource),
    add: async (formats) => [...formats, 'ktx2'],
    remove: async (formats) => formats.filter((f) => f !== 'ktx2'),
} as FormatDetectionParser;

extensions.add(detectKTX2);
