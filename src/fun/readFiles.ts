import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'
import { TInputNamedType } from '../model/TInputNamedType'

const readFile = util.promisify(fs.readFile)

export async function readFiles(dir: string, inputFiles: string[]) {
	const json = new Map<string, TInputNamedType>()
	for (let inputFile of inputFiles) {
		try {
			const fileContents = await readFile(
				path.resolve(dir, inputFile),
				'utf8',
			)
			const parsedContents = JSON.parse(fileContents)
			const filePath = inputFile.replace(/\.json$/i, '')
			json.set(filePath, parsedContents)
		} catch (e) {
			console.error(`[q0wqv0] Error while parsing ${inputFile}: ${e}`)
			throw e
		}
	}
	return json
}
