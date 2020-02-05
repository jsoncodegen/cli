import { InputEnum } from '../model/InputEnum'
import { TInputNamedType } from '../model/TInputNamedType'
import { getInputEnumValues } from './getInputEnumValues'

export function isStringEnum({
	json,
	declarationPath,
	declaration,
}: {
	json: Map<string, TInputNamedType>
	declarationPath: string
	declaration: InputEnum
}) {
	const values = getInputEnumValues({
		json,
		declarationPath,
		declaration,
	})
	let isStringEnum: boolean | undefined = undefined
	for (const [, value] of values) {
		const v = Array.isArray(value) ? value[0] : value
		const t = typeof v
		if (isStringEnum == null) {
			isStringEnum = t === 'string'
		} else if (isStringEnum ? t !== 'string' : t !== 'number') {
			throw new Error(`[q0wxy5] Mixed enum type (at ${declarationPath})`)
		}
	}
	return isStringEnum
}
