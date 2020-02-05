import { IStringEnumValue } from 'jsoncodegen-types-for-generator'
import { InputEnum } from '../model/InputEnum'
import { TInputNamedType } from '../model/TInputNamedType'
import { getMixinFields } from './getMixinFields'

const hasWhiteSpaceRe = /\s/

export function parseStringEnumFields({
	json,
	declarationPath,
	declaration,
}: {
	json: Map<string, TInputNamedType>
	declarationPath: string
	declaration: InputEnum
}): IStringEnumValue[] {
	let mixinFields = getMixinFields({
		json,
		declarationPath,
		mixins: declaration['...'],
	})
	const result = Object.entries({ ...mixinFields, ...declaration })
		.filter(([name]) => !name.startsWith('.'))
		.map(
			([name, valueMaybeDesc]): IStringEnumValue => {
				const value = Array.isArray(valueMaybeDesc)
					? valueMaybeDesc[0]
					: valueMaybeDesc
				const description = Array.isArray(valueMaybeDesc)
					? valueMaybeDesc[1]
					: ''
				return {
					kind: 'StringEnumValue',
					name,
					value: value!,
					description: description!,
				}
			},
		)
	for (const value of result) {
		if (hasWhiteSpaceRe.test(value.name)) {
			throw new Error(
				`[q163az] White space in string enum value name: ${value.name} (in ${declarationPath})`,
			)
		}
	}
	return result
}
