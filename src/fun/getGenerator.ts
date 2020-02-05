import { IGenerator } from 'jsoncodegen-types-for-generator'
import * as path from 'path'

export function getGenerator(name: string): IGenerator {
	let generator: IGenerator | null = null
	if (!/[\\\/]/.test(name)) {
		try {
			generator = require(`jsoncodegen-generator-${name}`)
		} catch (e) {}
	}
	if (!generator) {
		try {
			generator = require(path.resolve(process.cwd(), name))
		} catch (e) {}
	}
	if (!generator) {
		throw new Error(`[q1864g] Generator not found: ${name}`)
	}
	return generator
}
