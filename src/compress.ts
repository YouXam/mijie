import { createReadStream, createWriteStream } from 'node:fs'
import { exists, writeFile } from 'node:fs/promises'
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
    if (await exists(brPath)) {
        return
    }
    await writeFile(brPath, '')
	await pipeline(
		createReadStream(path),
		createBrotliCompress(opts),
		createWriteStream(brPath),
	)
	console.timeEnd('pipeline')
}