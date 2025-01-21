import { createReadStream, createWriteStream } from 'node:fs'
import { exists, rename, stat, unlink } from 'node:fs/promises'
import { createBrotliCompress, constants as ZLIB } from 'node:zlib'
import { pipeline } from 'node:stream/promises'

const opts = {
	params : {
		[ZLIB.BROTLI_PARAM_MODE] : ZLIB.BROTLI_MODE_TEXT,
		[ZLIB.BROTLI_PARAM_QUALITY] : 4,
	},
}

export async function checkBrotli(path: string) {
	const brPath = `${path}.br`
	if (await exists(brPath) && (await stat(brPath)).mtimeMs < (await stat(path)).mtimeMs) {
		await unlink(brPath)
	}
}

export async function compressBrotli(path: string) {
    const brPath = `${path}.br`
    const tmpPath = `${brPath}.tmp`
    if (await exists(tmpPath)) return
	if (await exists(brPath) && (await stat(brPath)).mtimeMs > (await stat(path)).mtimeMs) return
	await pipeline(
		createReadStream(path),
		createBrotliCompress(opts),
		createWriteStream(tmpPath),
	)
    await rename(tmpPath, brPath)
}