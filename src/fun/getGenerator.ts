import { IGenerator } from 'jsoncodegen-types-for-generator'
import * as path from 'path'
import { pathToFileURL } from 'url'
import { readJson } from './readJson.js'

export async function getGenerator(name: string): Promise<IGenerator> {
	let generator: IGenerator | null = null
	if (!/[\\\/]/.test(name) && name !== '.') {
		// console.log(`Importing generator ${JSON.stringify(name)} as module...`)
		try {
			generator = (await import(`jsoncodegen-generator-${name}`)).generator
			// console.log(` → Success:`, generator)
		} catch (e) {
			console.log(`[s7pzwk] Failed importing generator as module:`, e)
		}
	}
	if (!generator) {
		try {
			const packageJsonPath = path.resolve(process.cwd(), name, 'package.json')
			// console.log(
			// 	`Importing package.json from ${JSON.stringify(packageJsonPath)}...`,
			// )
			const packageJson = await readJson(packageJsonPath)
			// console.log(` → Success:`, { main: packageJson.main })
			const mainJsPath = packageJson.main ?? 'index.js'
			const mainJsUrl = pathToFileURL(
				path.resolve(process.cwd(), name, mainJsPath),
			).toString()
			// console.log(
			// 	`Importing generator ${JSON.stringify(name)} from ${JSON.stringify(
			// 		mainJsUrl,
			// 	)}...`,
			// )
			generator = (await import(mainJsUrl)).generator
			// console.log(` → Success:`, generator)
		} catch (e) {
			console.log(`[s7pzxj] Failed importing generator from path:`, e)
		}
	}
	if (!generator) {
		throw new Error(`[q1864g] Generator not found: ${name}`)
	}
	return generator
}
