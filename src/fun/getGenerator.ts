import { IGenerator } from 'jsoncodegen-types-for-generator'
import * as path from 'path'

export async function getGenerator(name: string): Promise<IGenerator> {
	let generator: IGenerator | null = null
	if (!/[\\\/]/.test(name)) {
		try {
			generator = (await import(`jsoncodegen-generator-${name}`)).generator
		} catch (e) {}
	}
	if (!generator) {
		try {
			generator = (await import(path.resolve(process.cwd(), name))).generator
		} catch (e) {}
	}
	if (!generator) {
		throw new Error(`[q1864g] Generator not found: ${name}`)
	}
	return generator
}
