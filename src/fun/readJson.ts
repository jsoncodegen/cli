import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

const readFile = util.promisify(fs.readFile)

export async function readJson(file: string) {
	const fileContents = await readFile(path.resolve(file), 'utf8')
	return JSON.parse(fileContents)
}
