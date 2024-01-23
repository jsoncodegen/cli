import { InputEnum } from '../model/InputEnum.js'
import { TInputNamedType } from '../model/TInputNamedType.js'
import { getMixinFields } from './getMixinFields.js'

export function getInputEnumValues({
	json,
	declarationPath,
	declaration,
}: {
	json: Map<string, TInputNamedType>
	declarationPath: string
	declaration: InputEnum
}) {
	let mixinFields = getMixinFields({
		json,
		declarationPath,
		mixins: declaration['...'],
	})
	const fields = Object.entries({ ...mixinFields, ...declaration }).filter(
		([name]) => !name.startsWith('.'),
	)
	return fields as [string, string | number | [string | number, string]][]
}
