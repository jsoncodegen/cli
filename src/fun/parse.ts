import {
	IInterface,
	INumberEnum,
	IStringEnum,
	TNamedType,
} from 'jsoncodegen-types-for-generator'
import { InputEnum } from '../model/InputEnum'
import { InputInterface } from '../model/InputInterface'
import { TInputNamedType } from '../model/TInputNamedType'
import { pathBaseName } from '../path/pathBaseName'
import { pathDirectory } from '../path/pathDirectory'
import { isStringEnum } from './isStringEnum'
import { parseInterfaceFields } from './parseInterfaceFields'
import { parseNumberEnumFields } from './parseNumberEnumFields'
import { parseStringEnumFields } from './parseStringEnumFields'

export function parse(json: Map<string, TInputNamedType>) {
	const result = new Map<string, TNamedType>()
	for (const [declarationPath, declaration] of json.entries()) {
		const declarationPathArray = declarationPath.split('/')
		const inType = declaration['.is'] || 'interface'
		switch (inType.trim()) {
			case 'enum': {
				if (
					isStringEnum({
						json,
						declarationPath,
						declaration: declaration as InputEnum,
					})
				) {
					const r: IStringEnum = {
						kind: 'StringEnum',
						id: declarationPath,
						directoryPath: pathDirectory(declarationPathArray),
						name: pathBaseName(declarationPathArray),
						description: declaration['.description'] || '',
						values: parseStringEnumFields({
							json,
							declarationPath,
							declaration: declaration as InputEnum,
						}),
					}
					result.set(declarationPath, r)
				} else {
					const r: INumberEnum = {
						kind: 'NumberEnum',
						id: declarationPath,
						directoryPath: pathDirectory(declarationPathArray),
						name: pathBaseName(declarationPathArray),
						description: declaration['.description'] || '',
						values: parseNumberEnumFields({
							json,
							declarationPath,
							declaration: declaration as InputEnum,
						}),
					}
					result.set(declarationPath, r)
				}
				break
			}
			case 'interface': {
				const r: IInterface = {
					kind: 'Interface',
					id: declarationPath,
					directoryPath: pathDirectory(declarationPathArray),
					name: pathBaseName(declarationPathArray),
					description: declaration['.description'] || '',
					fields: [],
				}
				result.set(declarationPath, r)
				break
			}
			case 'mixin':
				break
			default:
				throw new Error(
					`[q0wz2h] Unknown type: ${inType} (in ${declarationPath})`,
				)
		}
	}
	for (const [declarationPath, declaration] of result.entries()) {
		switch (declaration.kind) {
			case 'Interface': {
				const r: IInterface = {
					...declaration,
					fields: parseInterfaceFields({
						json,
						enumSource: result,
						declarationPath,
						declaration: json.get(
							declarationPath,
						) as InputInterface,
						interfaceType: declaration,
					}),
				}
				result.set(declarationPath, r)
				break
			}
		}
	}
	return result
}
