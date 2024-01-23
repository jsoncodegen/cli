import * as fs from 'fs'
import { mkdirp } from 'mkdirp'
import * as path from 'path'
import * as util from 'util'

const writeFile = util.promisify(fs.writeFile)

export async function writeOutput(outputDir: string, out: Map<string, string>) {
	for (const [key, value] of out.entries()) {
		const fileName = path.resolve(outputDir, key)
		await mkdirp(path.dirname(fileName))
		if (path.relative(outputDir, fileName).startsWith('..')) {
			console.error(`[q0yyv3] Key: ${key}`)
			throw new Error(`[q0x2cw] Invalid output path: ${fileName}`)
		}
		await writeFile(fileName, value)
	}
}
