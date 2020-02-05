import { InputEnum } from '../model/InputEnum'
import { TInputNamedType } from '../model/TInputNamedType'
import { getMixinFields } from './getMixinFields'

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
