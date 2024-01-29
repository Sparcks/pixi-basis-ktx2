import { extensions, ExtensionType, settings, utils } from '@pixi/core';

import type { ResolveURLParser, UnresolvedAsset } from '@pixi/assets';

export const resolveKTX2TextureUrl = {
    extension: ExtensionType.ResolveParser,
    test: (value: string) => {
        const extension = utils.path.extname(value).slice(1);

        return ['ktx2'].includes(extension);
    },
    parse: (value: string): UnresolvedAsset => {
        const extension = utils.path.extname(value).slice(1);

        return {
            resolution: parseFloat(settings.RETINA_PREFIX?.exec(value)?.[1] ?? '1'),
            format: extension,
            src: value,
        };
    },
} as ResolveURLParser;

extensions.add(resolveKTX2TextureUrl);
