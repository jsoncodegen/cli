import {
	IInterface,
	IInterfaceField,
	TNamedType,
} from 'jsoncodegen-types-for-generator'
import { InputInterface } from '../model/InputInterface'
import { TInputNamedType } from '../model/TInputNamedType'
import { getMixinFields } from './getMixinFields'
import { unwrap } from './unwrap'

const whiteSpaceRe = /\s/

export function parseInterfaceFields({
	json,
	enumSource,
	declarationPath,
	declaration,
	interfaceType,
}: {
	json: Map<string, TInputNamedType>
	enumSource: Map<string, TNamedType>
	declarationPath: string
	declaration: InputInterface
	interfaceType: IInterface
}) {
	const result: IInterfaceField[] = []
	const mixinFields = getMixinFields({
		json,
		declarationPath,
		mixins: declaration['...'],
	})
	for (const [fieldName, typeTuple] of Object.entries({
		...mixinFields,
		...declaration,
	}) as [string, string | [string, string]][]) {
		if (fieldName.startsWith('.')) continue
		if (whiteSpaceRe.test(fieldName)) {
			throw new Error(
				`[q163nh] White space in property name: ${fieldName} (in ${declarationPath})`,
			)
		}
		const typeWrapped = Array.isArray(typeTuple) ? typeTuple[0] : typeTuple
		const fieldDescription = Array.isArray(typeTuple) ? typeTuple[1] : ''
		const interfaceField: IInterfaceField = {
			kind: 'InterfaceField',
			name: fieldName,
			description: fieldDescription,
			fieldType: unwrap({
				namedTypesById: enumSource,
				interfaceType: interfaceType,
				fieldTypeString: typeWrapped,
			}),
		}
		result.push(interfaceField)
	}
	return result
}
