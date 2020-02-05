import { TGeneratorResult } from 'jsoncodegen-types-for-generator'
import * as _ from 'lodash'

export function generatorResultToMap(generatorResult: TGeneratorResult) {
	const result = new Map<string, string>()
	if (generatorResult) {
		for (const g of Array.isArray(generatorResult)
			? generatorResult
			: [generatorResult]) {
			if (_.isNil(g)) {
				continue
			}
			if (!_.isObject(g)) {
				throw new Error(
					`[q0wtl2] Object expected for generated result. Got: ${typeof g}`,
				)
			}
			if (!_.isArray(g.filePath)) {
				throw new Error(
					`[q0wtij] Array expected for path. Got: ${typeof g.filePath}`,
				)
			}
			if (!g.filePath.length) {
				throw new Error(`[q1bep7] Empty file path.`)
			}
			if (!_.isString(g.content)) {
				throw new Error(
					`[q0wtnj] String expected for content. Got: ${typeof g.content}`,
				)
			}
			const filePath = g.filePath.join('/')
			if (result.has(filePath)) {
				throw new Error(
					`[q0wuct] Generator attempted to overwrite path: ${JSON.stringify(
						filePath,
					)}`,
				)
			}
			try {
				result.set(filePath, g.content)
			} catch (e) {
				throw new Error(
					`[q0wu95] Could not set generated result at: ${JSON.stringify(
						filePath,
					)}`,
				)
			}
		}
	}
	return result
}
