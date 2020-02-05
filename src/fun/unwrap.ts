import {
	IArray,
	IInterface,
	IInterfaceReference,
	IMap,
	INumberEnumReference,
	INumberEnumValueReference,
	IPrimitiveValue,
	IStringEnumReference,
	IStringEnumValueReference,
	TFieldType,
	TNamedType,
} from 'jsoncodegen-types-for-generator'
import { normalizePath } from '../path/normalizePath'
import { pathBaseName } from '../path/pathBaseName'
import { pathDirectory } from '../path/pathDirectory'
import { pathForceRelative } from '../path/pathForceRelative'
import { pathFromString } from '../path/pathFromString'
import { pathToString } from '../path/pathToString'
import { resolvePath } from '../path/resolvePath'
import { toRelativePath } from '../path/toRelativePath'

const isNullableRe = /\?$/
const isMapRe = /\{\}$/
const isArrayRe = /\[\]$/

export function unwrap({
	fieldTypeString,
	namedTypesById,
	interfaceType,
}: {
	namedTypesById: Map<string, TNamedType>
	interfaceType: IInterface
	fieldTypeString: string
}): TFieldType {
	const isNullable = isNullableRe.test(fieldTypeString)
	if (isNullable) {
		fieldTypeString = fieldTypeString.replace(isNullableRe, '')
	}
	if (isMapRe.test(fieldTypeString)) {
		fieldTypeString = fieldTypeString.replace(isMapRe, '')
		const r: IMap = {
			kind: 'Map',
			isNullable,
			fieldType: unwrap({
				namedTypesById,
				fieldTypeString,
				interfaceType,
			}),
		}
		return r
	} else if (isArrayRe.test(fieldTypeString)) {
		fieldTypeString = fieldTypeString.replace(isArrayRe, '')
		const r: IArray = {
			kind: 'Array',
			isNullable,
			fieldType: unwrap({
				namedTypesById,
				fieldTypeString,
				interfaceType,
			}),
		}
		return r
	} else {
		if (['boolean', 'string', 'number'].includes(fieldTypeString)) {
			const r: IPrimitiveValue = {
				kind: 'PrimitiveValue',
				name: fieldTypeString as 'boolean' | 'number' | 'string',
				isNullable,
			}
			return r
		} else {
			const typeSpecifiedPathWithField = normalizePath(
				pathFromString(fieldTypeString),
			)
			const typeFullPathWithField = fieldTypeString.startsWith('.')
				? resolvePath(
						interfaceType.directoryPath,
						typeSpecifiedPathWithField,
				  )
				: typeSpecifiedPathWithField
			const typeName = pathBaseName(typeFullPathWithField).split('.')
			const typePath = pathDirectory(typeFullPathWithField)
			const typeFullPath = [...typePath, typeName[0]]
			const typeDeclaration = namedTypesById.get(
				pathToString(typeFullPath),
			)
			if (!typeDeclaration)
				throw new Error(
					`[q2cmbl] Type declaration not found: ${fieldTypeString} (at ${interfaceType.id})`,
				)
			const relativeDirectoryPath = pathForceRelative(
				toRelativePath(interfaceType.directoryPath, typePath),
			)
			switch (typeDeclaration.kind) {
				case 'Interface': {
					const r: IInterfaceReference = {
						kind: 'InterfaceReference',
						absoluteDirectoryPath: typeDeclaration.directoryPath,
						relativeDirectoryPath,
						isNullable,
						name: typeDeclaration.name,
						targetId: typeDeclaration.id,
					}
					return r
				}
				case 'StringEnum': {
					if (typeName.length === 2) {
						const r: IStringEnumValueReference = {
							kind: 'StringEnumValueReference',
							targetId: typeDeclaration.id,
							absoluteDirectoryPath:
								typeDeclaration.directoryPath,
							relativeDirectoryPath,
							isNullable,
							name: typeDeclaration.name,
							valueName: typeName[1],
						}
						return r
					} else {
						const r: IStringEnumReference = {
							kind: 'StringEnumReference',
							targetId: typeDeclaration.id,
							absoluteDirectoryPath:
								typeDeclaration.directoryPath,
							relativeDirectoryPath,
							isNullable,
							name: typeDeclaration.name,
						}
						return r
					}
				}
				case 'NumberEnum': {
					if (typeName.length === 2) {
						const r: INumberEnumValueReference = {
							kind: 'NumberEnumValueReference',
							targetId: typeDeclaration.id,
							absoluteDirectoryPath:
								typeDeclaration.directoryPath,
							relativeDirectoryPath,
							isNullable,
							name: typeDeclaration.name,
							valueName: typeName[1],
						}
						return r
					} else {
						const r: INumberEnumReference = {
							kind: 'NumberEnumReference',
							targetId: typeDeclaration.id,
							absoluteDirectoryPath:
								typeDeclaration.directoryPath,
							relativeDirectoryPath,
							isNullable,
							name: typeDeclaration.name,
						}
						return r
					}
				}
				default:
					throw new Error(`[q2cms3]`)
			}
		}
	}
}
