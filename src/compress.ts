import { createReadStream, createWriteStream } from 'node:fs'
import { exists, rename, writeFile } from 'node:fs/promises'
import { createBrotliCompress, constants as ZLIB } from 'node:zlib'
import { pipeline } from 'node:stream/promises'

const opts = {
	params : {
		[ZLIB.BROTLI_PARAM_MODE] : ZLIB.BROTLI_MODE_TEXT,
		[ZLIB.BROTLI_PARAM_QUALITY] : 4,
	},
}

export async function compressBrotli(path: string) {
    const brPath = `${path}.br`
    const tmpPath = `${brPath}.tmp`
    if (await exists(brPath) || await exists(tmpPath)) {
        return
    }
	await pipeline(
		createReadStream(path),
		createBrotliCompress(opts),
		createWriteStream(tmpPath),
	)
    await rename(tmpPath, brPath)
}