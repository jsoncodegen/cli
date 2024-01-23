import { INumberEnumValue } from 'jsoncodegen-types-for-generator'
import { InputEnum } from '../model/InputEnum.js'
import { TInputNamedType } from '../model/TInputNamedType.js'
import { getMixinFields } from './getMixinFields.js'

const hasWhiteSpaceRe = /\s/

export function parseNumberEnumFields({
	json,
	declarationPath,
	declaration,
}: {
	json: Map<string, TInputNamedType>
	declarationPath: string
	declaration: InputEnum
}): INumberEnumValue[] {
	let mixinFields = getMixinFields({
		json,
		declarationPath,
		mixins: declaration['...'],
	})
	const result = Object.entries({ ...mixinFields, ...declaration })
		.filter(([name]) => !name.startsWith('.'))
		.map(([name, valueMaybeDesc]): INumberEnumValue => {
			const value = Array.isArray(valueMaybeDesc)
				? (valueMaybeDesc[0] as unknown as number)
				: (valueMaybeDesc as unknown as number)
			const description = Array.isArray(valueMaybeDesc)
				? (valueMaybeDesc[1] as string)
				: ''
			return {
				kind: 'NumberEnumValue',
				name,
				value,
				description,
			}
		})
	for (const value of result) {
		if (hasWhiteSpaceRe.test(value.name)) {
			throw new Error(
				`[q2ckru] White space in number enum value name: ${value.name} (in ${declarationPath})`,
			)
		}
	}
	return result
}
