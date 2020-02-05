import {
	IArray,
	IInterface,
	IInterfaceField,
	IInterfaceReference,
	IMap,
	INumberEnum,
	INumberEnumReference,
	INumberEnumValue,
	INumberEnumValueReference,
	IPrimitiveValue,
	IStringEnum,
	IStringEnumReference,
	IStringEnumValue,
	IStringEnumValueReference,
	TFieldType,
} from 'jsoncodegen-types-for-generator'
import { TInputNamedType } from '../model/TInputNamedType'
import { parse } from './parse'

it('[q1bkaj] Handles an empty interface.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {})
	const result = parse(json)
	const expectedResult = makeInterface({
		name: 'Foo',
	})
	expect(result.size).toBe(1)
	expect(result.get('Foo')).toEqual(expectedResult)
})

it('[q1bkle] Handles folders.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('some/folder/Foo', {})
	const result = parse(json)
	const expectedResult = makeInterface({
		directoryPath: ['some', 'folder'],
		name: 'Foo',
	})
	expect(result.size).toBe(1)
	expect(result.get('some/folder/Foo')).toEqual(expectedResult)
})

it('[q1bke7] Handles a field.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		bar: 'boolean',
	})
	const result = parse(json)
	const expectedResult = makeInterface({
		name: 'Foo',
		fields: [
			makePrimitiveInterfaceField({ name: 'bar', fieldType: 'boolean' }),
		],
	})
	expect(result.size).toBe(1)
	expect(result.get('Foo')).toEqual(expectedResult)
})

it('[q1bkpe] Handles a mixin.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		'...': 'Mix',
	})
	json.set('Mix', {
		'.is': 'mixin',
		bar: 'boolean',
	})
	const result = parse(json)
	const expectedResult = makeInterface({
		name: 'Foo',
		fields: [
			makePrimitiveInterfaceField({ name: 'bar', fieldType: 'boolean' }),
		],
	})
	expect(result.size).toBe(1)
	expect(result.get('Foo')).toEqual(expectedResult)
})

it('[q1bkzu] Handles multiple mixins.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		'...': ['Mix', 'Mix2'],
	})
	json.set('Mix', {
		'.is': 'mixin',
		bar: 'boolean',
		baz: 'boolean',
	})
	json.set('Mix2', {
		'.is': 'mixin',
		baz: 'string',
		quux: 'number',
	})
	const result = parse(json)
	const expectedResult = makeInterface({
		name: 'Foo',
		fields: [
			makePrimitiveInterfaceField({ name: 'bar', fieldType: 'boolean' }),
			makePrimitiveInterfaceField({ name: 'baz', fieldType: 'string' }),
			makePrimitiveInterfaceField({ name: 'quux', fieldType: 'number' }),
		],
	})
	expect(result.size).toBe(1)
	expect(result.get('Foo')).toEqual(expectedResult)
})

it('[q1blvl] Handles an interface field.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		foo: 'Bar',
	})
	json.set('Bar', {})
	const result = parse(json)
	const expectedFoo = makeInterface({
		name: 'Foo',
		fields: [
			makeInterfaceInterfaceField({ name: 'foo', interfaceName: 'Bar' }),
		],
	})
	const expectedBar = makeInterface({
		name: 'Bar',
	})
	expect(result.size).toBe(2)
	expect(result.get('Foo')).toEqual(expectedFoo)
	expect(result.get('Bar')).toEqual(expectedBar)
})

it('[q1bmgq] Handles interface field paths.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('some/folder/Foo', {
		inSameFolderAbs: 'some/folder/InSameFolderAbs',
		inSameFolderRel: './InSameFolderRel',
		inParentFolderAbs: 'some/InParentFolderAbs',
		inParentFolderRel: '../InParentFolderRel',
		inRootFolderAbs: 'InRootFolderAbs',
		inRootFolderRel: '../../InRootFolderRel',
		inChildFolderAbs: 'some/folder/child/InChildFolderAbs',
		inChildFolderRel: './child/InChildFolderRel',
		inDesFolderAbs: 'some/folder/child/des/InDesFolderAbs',
		inDesFolderRel: './child/des/InDesFolderRel',
		inSiblingFolderAbs: 'some/other/InSiblingFolderAbs',
		inSiblingFolderRel: '../other/InSiblingFolderRel',
	})
	json.set('some/folder/InSameFolderAbs', {})
	json.set('some/folder/InSameFolderRel', {})
	json.set('some/InParentFolderAbs', {})
	json.set('some/InParentFolderRel', {})
	json.set('InRootFolderAbs', {})
	json.set('InRootFolderRel', {})
	json.set('some/folder/child/InChildFolderAbs', {})
	json.set('some/folder/child/InChildFolderRel', {})
	json.set('some/folder/child/des/InDesFolderAbs', {})
	json.set('some/folder/child/des/InDesFolderRel', {})
	json.set('some/other/InSiblingFolderAbs', {})
	json.set('some/other/InSiblingFolderRel', {})
	const result = parse(json)
	const expectedFoo = makeInterface({
		directoryPath: ['some', 'folder'],
		name: 'Foo',
		fields: /* prettier-ignore */ [
			makeInterfaceInterfaceField({ name: 'inSameFolderAbs'   , interfaceName: 'InSameFolderAbs'   , absoluteDirectoryPath: ['some', 'folder'                ], relativeDirectoryPath : ['.'                 ] }),
			makeInterfaceInterfaceField({ name: 'inSameFolderRel'   , interfaceName: 'InSameFolderRel'   , absoluteDirectoryPath: ['some', 'folder'                ], relativeDirectoryPath : ['.'                 ] }),
			makeInterfaceInterfaceField({ name: 'inParentFolderAbs' , interfaceName: 'InParentFolderAbs' , absoluteDirectoryPath: ['some'                          ], relativeDirectoryPath : ['..'                ] }),
			makeInterfaceInterfaceField({ name: 'inParentFolderRel' , interfaceName: 'InParentFolderRel' , absoluteDirectoryPath: ['some'                          ], relativeDirectoryPath : ['..'                ] }),
			makeInterfaceInterfaceField({ name: 'inRootFolderAbs'   , interfaceName: 'InRootFolderAbs'   , absoluteDirectoryPath: [                                ], relativeDirectoryPath : ['..', '..'          ] }),
			makeInterfaceInterfaceField({ name: 'inRootFolderRel'   , interfaceName: 'InRootFolderRel'   , absoluteDirectoryPath: [                                ], relativeDirectoryPath : ['..', '..'          ] }),
			makeInterfaceInterfaceField({ name: 'inChildFolderAbs'  , interfaceName: 'InChildFolderAbs'  , absoluteDirectoryPath: ['some', 'folder', 'child'       ], relativeDirectoryPath : ['.' , 'child'       ] }),
			makeInterfaceInterfaceField({ name: 'inChildFolderRel'  , interfaceName: 'InChildFolderRel'  , absoluteDirectoryPath: ['some', 'folder', 'child'       ], relativeDirectoryPath : ['.' , 'child'       ] }),
			makeInterfaceInterfaceField({ name: 'inDesFolderAbs'    , interfaceName: 'InDesFolderAbs'    , absoluteDirectoryPath: ['some', 'folder', 'child', 'des'], relativeDirectoryPath : ['.' , 'child', 'des'] }),
			makeInterfaceInterfaceField({ name: 'inDesFolderRel'    , interfaceName: 'InDesFolderRel'    , absoluteDirectoryPath: ['some', 'folder', 'child', 'des'], relativeDirectoryPath : ['.' , 'child', 'des'] }),
			makeInterfaceInterfaceField({ name: 'inSiblingFolderAbs', interfaceName: 'InSiblingFolderAbs', absoluteDirectoryPath: ['some', 'other'                 ], relativeDirectoryPath : ['..', 'other'       ] }),
			makeInterfaceInterfaceField({ name: 'inSiblingFolderRel', interfaceName: 'InSiblingFolderRel', absoluteDirectoryPath: ['some', 'other'                 ], relativeDirectoryPath : ['..', 'other'       ] }),
		],
	})
	expect(result.get('some/folder/Foo')).toEqual(expectedFoo)
})

it('[q1bp34] Handles a string enum.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		'.is': 'enum',
		NAME_1: 'VALUE_1',
		NAME_2: 'VALUE_2',
	})
	const result = parse(json)
	const expectedFoo = makeStringEnum({
		name: 'Foo',
		values: /* prettier-ignore */ [
			makeStringEnumValue({ name: 'NAME_1', value: 'VALUE_1' }),
			makeStringEnumValue({ name: 'NAME_2', value: 'VALUE_2' }),
		],
	})
	expect(result.get('Foo')).toEqual(expectedFoo)
})

it('[q1bpqm] Handles a number enum.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		'.is': 'enum',
		NAME_1: 1,
		NAME_2: 2,
	})
	const result = parse(json)
	const expectedFoo = makeNumberEnum({
		name: 'Foo',
		values: /* prettier-ignore */ [
			makeNumberEnumValue({ name: 'NAME_1', value: 1 }),
			makeNumberEnumValue({ name: 'NAME_2', value: 2 }),
		],
	})
	expect(result.get('Foo')).toEqual(expectedFoo)
})

it('[q1bpsa] Handles a number enum field.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		foo: 'Bar',
	})
	json.set('Bar', { '.is': 'enum', NAME_1: 1, NAME_2: 2 })
	const result = parse(json)
	const expectedFoo = makeInterface({
		name: 'Foo',
		fields: [
			makeNumberEnumInterfaceField({ name: 'foo', enumName: 'Bar' }),
		],
	})
	expect(result.size).toBe(2)
	expect(result.get('Foo')).toEqual(expectedFoo)
})

it('[q1qiop] Handles a string enum field.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		foo: 'Bar',
	})
	json.set('Bar', { '.is': 'enum', NAME_1: 'VALUE_1', NAME_2: 'VALUE_2' })
	const result = parse(json)
	const expectedFoo = makeInterface({
		name: 'Foo',
		fields: [
			makeStringEnumInterfaceField({ name: 'foo', enumName: 'Bar' }),
		],
	})
	expect(result.size).toBe(2)
	expect(result.get('Foo')).toEqual(expectedFoo)
})

it('[q1bq2h] Handles a number enum value field.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		foo: 'Bar.NAME_1',
	})
	json.set('Bar', { '.is': 'enum', NAME_1: 1, NAME_2: 2 })
	const result = parse(json)
	const expectedFoo = makeInterface({
		name: 'Foo',
		fields: [
			makeNumberEnumValueInterfaceField({
				name: 'foo',
				enumName: 'Bar',
				valueName: 'NAME_1',
			}),
		],
	})
	expect(result.size).toBe(2)
	expect(result.get('Foo')).toEqual(expectedFoo)
})

it('[q1qipj] Handles a string enum value field.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		foo: 'Bar.NAME_1',
	})
	json.set('Bar', { '.is': 'enum', NAME_1: 'VALUE_1', NAME_2: 'VALUE_2' })
	const result = parse(json)
	const expectedFoo = makeInterface({
		name: 'Foo',
		fields: [
			makeStringEnumValueInterfaceField({
				name: 'foo',
				enumName: 'Bar',
				valueName: 'NAME_1',
			}),
		],
	})
	expect(result.size).toBe(2)
	expect(result.get('Foo')).toEqual(expectedFoo)
})

it('[q1bq2l] Handles an array field.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		foo: 'boolean[]',
	})
	const result = parse(json)
	const expectedFoo = makeInterface({
		name: 'Foo',
		fields: [
			makeInterfaceField({
				name: 'foo',
				fieldType: makeArray({
					fieldType: makePrimitiveValue({
						name: 'boolean',
					}),
				}),
			}),
		],
	})
	expect(result.get('Foo')).toEqual(expectedFoo)
})

it('[q1bqft] Handles a map field.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		foo: 'boolean{}',
	})
	const result = parse(json)
	const expectedFoo = makeInterface({
		name: 'Foo',
		fields: [
			makeInterfaceField({
				name: 'foo',
				fieldType: makeMap({
					fieldType: makePrimitiveValue({
						name: 'boolean',
					}),
				}),
			}),
		],
	})
	expect(result.get('Foo')).toEqual(expectedFoo)
})

it('[q1bqgr] Handles map and array nesting.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		foo: 'boolean{}[]',
	})
	const result = parse(json)
	const expectedFoo = makeInterface({
		name: 'Foo',
		fields: [
			makeInterfaceField({
				name: 'foo',
				fieldType: makeArray({
					fieldType: makeMap({
						fieldType: makePrimitiveValue({
							name: 'boolean',
						}),
					}),
				}),
			}),
		],
	})
	expect(result.get('Foo')).toEqual(expectedFoo)
})

it('[q1bqmc] Handles nullable fields.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		nullable: 'boolean?',
		arrayWithNull: 'boolean?[]',
		nullableArrayWithNull: 'boolean?[]?',
		nullableMapWithArrayWithNull: 'boolean?[]{}?',
		nullableMapWithNullableArray: 'boolean[]?{}?',
	})
	const result = parse(json)
	const expectedFoo = makeInterface({
		name: 'Foo',
		fields: /* prettier-ignore */ [
			makeInterfaceField({ name: 'nullable'                    , fieldType:                                                                                     makePrimitiveValue({ isNullable: true , name: 'boolean'       }) }),
			makeInterfaceField({ name: 'arrayWithNull'               , fieldType:                                           makeArray({ isNullable: false, fieldType: makePrimitiveValue({ isNullable: true , name: 'boolean' })    }) }),
			makeInterfaceField({ name: 'nullableArrayWithNull'       , fieldType:                                           makeArray({ isNullable: true , fieldType: makePrimitiveValue({ isNullable: true , name: 'boolean' })    }) }),
			makeInterfaceField({ name: 'nullableMapWithArrayWithNull', fieldType: makeMap  ({ isNullable: true , fieldType: makeArray({ isNullable: false, fieldType: makePrimitiveValue({ isNullable: true , name: 'boolean' }) }) }) }),
			makeInterfaceField({ name: 'nullableMapWithNullableArray', fieldType: makeMap  ({ isNullable: true , fieldType: makeArray({ isNullable: true, fieldType:  makePrimitiveValue({ isNullable: false, name: 'boolean' }) }) }) }),
		],
	})
	expect(result.get('Foo')).toEqual(expectedFoo)
})

it('[q1br2r] Handles an interface field with a description.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		foo: ['boolean', 'Description.'],
	})
	const result = parse(json)
	const expectedFoo = makeInterface({
		name: 'Foo',
		fields: [
			makePrimitiveInterfaceField({
				name: 'foo',
				fieldType: 'boolean',
				description: 'Description.',
			}),
		],
	})
	expect(result.get('Foo')).toEqual(expectedFoo)
})

it('[q1br70] Handles an enum field with a description.', () => {
	const json = new Map<string, TInputNamedType>()
	json.set('Foo', {
		'.is': 'enum',
		NAME_1: ['VALUE_1', 'Description 1.'],
		NAME_2: ['VALUE_2', 'Description 2.'],
	})
	const result = parse(json)
	const expectedFoo = makeStringEnum({
		name: 'Foo',
		values: /* prettier-ignore */ [
			makeStringEnumValue({ name: 'NAME_1', value: 'VALUE_1', description: 'Description 1.' }),
			makeStringEnumValue({ name: 'NAME_2', value: 'VALUE_2', description: 'Description 2.' }),
		],
	})
	expect(result.get('Foo')).toEqual(expectedFoo)
})

// Helpers

function makePrimitiveValue(
	o: Omit<Partial<IPrimitiveValue>, 'kind'> & {
		name: 'boolean' | 'number' | 'string'
	},
): IPrimitiveValue {
	return {
		...o,
		kind: 'PrimitiveValue',
		isNullable: o.isNullable || false,
	}
}

function makeInterface(
	o: Omit<Partial<IInterface>, 'kind'> & { name: string },
): IInterface {
	return {
		...o,
		kind: 'Interface',
		id: o.id || [...(o.directoryPath || []), o.name].join(`/`),
		description: o.description || '',
		directoryPath: o.directoryPath || [],
		fields: o.fields || [],
	}
}

function makeStringEnum(
	o: Omit<Partial<IStringEnum>, 'kind'> & {
		name: string
		values: IStringEnumValue[]
	},
): IStringEnum {
	return {
		...o,
		kind: 'StringEnum',
		id: o.id || [...(o.directoryPath || []), o.name].join(`/`),
		description: o.description || '',
		directoryPath: o.directoryPath || [],
	}
}

function makeStringEnumValue(
	o: Omit<Partial<IStringEnumValue>, 'kind'> & {
		name: string
		value: string
	},
): IStringEnumValue {
	return {
		...o,
		kind: 'StringEnumValue',
		description: o.description || '',
	}
}

function makeNumberEnum(
	o: Omit<Partial<INumberEnum>, 'kind'> & {
		name: string
		values: INumberEnumValue[]
	},
): INumberEnum {
	return {
		...o,
		kind: 'NumberEnum',
		id: o.id || [...(o.directoryPath || []), o.name].join(`/`),
		description: o.description || '',
		directoryPath: o.directoryPath || [],
	}
}

function makeNumberEnumValue(
	o: Omit<Partial<INumberEnumValue>, 'kind'> & {
		name: string
		value: number
	},
): INumberEnumValue {
	return {
		...o,
		kind: 'NumberEnumValue',
		description: o.description || '',
	}
}

function makeInterfaceReference(
	o: Omit<IInterfaceReference, 'kind'>,
): IInterfaceReference {
	return {
		...o,
		kind: 'InterfaceReference',
	}
}

function makeStringEnumReference(
	o: Omit<IStringEnumReference, 'kind'>,
): IStringEnumReference {
	return {
		...o,
		kind: 'StringEnumReference',
	}
}

function makeStringEnumValueReference(
	o: Omit<IStringEnumValueReference, 'kind'>,
): IStringEnumValueReference {
	return {
		...o,
		kind: 'StringEnumValueReference',
	}
}

function makeNumberEnumReference(
	o: Omit<INumberEnumReference, 'kind'>,
): INumberEnumReference {
	return {
		...o,
		kind: 'NumberEnumReference',
	}
}

function makeNumberEnumValueReference(
	o: Omit<INumberEnumValueReference, 'kind'>,
): INumberEnumValueReference {
	return {
		...o,
		kind: 'NumberEnumValueReference',
	}
}

function makeArray(
	o: Omit<Partial<IArray>, 'kind'> & { fieldType: TFieldType },
): IArray {
	return {
		...o,
		kind: 'Array',
		isNullable: o.isNullable || false,
	}
}

function makeMap(
	o: Omit<Partial<IMap>, 'kind'> & { fieldType: TFieldType },
): IMap {
	return {
		...o,
		kind: 'Map',
		isNullable: o.isNullable || false,
	}
}

function makeInterfaceField(
	o: Omit<Partial<IInterfaceField>, 'kind'> & {
		name: string
		fieldType: TFieldType
	},
): IInterfaceField {
	return {
		...o,
		kind: 'InterfaceField',
		description: o.description || '',
	}
}

function makePrimitiveInterfaceField({
	name,
	fieldType,
	isNullable = false,
	description,
}: {
	name: string
	fieldType: 'boolean' | 'number' | 'string'
	isNullable?: boolean
	description?: string
}): IInterfaceField {
	return makeInterfaceField({
		name: name,
		description: description,
		fieldType: makePrimitiveValue({
			isNullable: isNullable,
			name: fieldType,
		}),
	})
}

function makeInterfaceInterfaceField({
	name,
	interfaceName,
	isNullable = false,
	absoluteDirectoryPath = [],
	relativeDirectoryPath = ['.'],
}: {
	name: string
	interfaceName: string
	isNullable?: boolean
	absoluteDirectoryPath?: string[]
	relativeDirectoryPath?: string[]
}): IInterfaceField {
	return makeInterfaceField({
		name: name,
		fieldType: makeInterfaceReference({
			name: interfaceName,
			targetId: [...absoluteDirectoryPath, interfaceName].join(`/`),
			isNullable,
			absoluteDirectoryPath: absoluteDirectoryPath,
			relativeDirectoryPath: relativeDirectoryPath,
		}),
	})
}

function makeStringEnumInterfaceField({
	name,
	enumName,
	isNullable = false,
	absoluteDirectoryPath = [],
	relativeDirectoryPath = ['.'],
}: {
	name: string
	enumName: string
	isNullable?: boolean
	absoluteDirectoryPath?: string[]
	relativeDirectoryPath?: string[]
}): IInterfaceField {
	return makeInterfaceField({
		name: name,
		fieldType: makeStringEnumReference({
			name: enumName,
			targetId: [...absoluteDirectoryPath, enumName].join(`/`),
			isNullable,
			absoluteDirectoryPath: absoluteDirectoryPath,
			relativeDirectoryPath: relativeDirectoryPath,
		}),
	})
}

function makeNumberEnumInterfaceField({
	name,
	enumName,
	isNullable = false,
	absoluteDirectoryPath = [],
	relativeDirectoryPath = ['.'],
}: {
	name: string
	enumName: string
	isNullable?: boolean
	absoluteDirectoryPath?: string[]
	relativeDirectoryPath?: string[]
}): IInterfaceField {
	return makeInterfaceField({
		name: name,
		fieldType: makeNumberEnumReference({
			name: enumName,
			targetId: [...absoluteDirectoryPath, enumName].join(`/`),
			isNullable,
			absoluteDirectoryPath: absoluteDirectoryPath,
			relativeDirectoryPath: relativeDirectoryPath,
		}),
	})
}

function makeStringEnumValueInterfaceField({
	name,
	enumName,
	valueName,
	isNullable = false,
	absoluteDirectoryPath = [],
	relativeDirectoryPath = ['.'],
}: {
	name: string
	enumName: string
	valueName: string
	isNullable?: boolean
	absoluteDirectoryPath?: string[]
	relativeDirectoryPath?: string[]
}): IInterfaceField {
	return makeInterfaceField({
		name: name,
		fieldType: makeStringEnumValueReference({
			name: enumName,
			targetId: [...absoluteDirectoryPath, enumName].join(`/`),
			isNullable,
			absoluteDirectoryPath: absoluteDirectoryPath,
			relativeDirectoryPath: relativeDirectoryPath,
			valueName: valueName,
		}),
	})
}

function makeNumberEnumValueInterfaceField({
	name,
	enumName,
	valueName,
	isNullable = false,
	absoluteDirectoryPath = [],
	relativeDirectoryPath = ['.'],
}: {
	name: string
	enumName: string
	valueName: string
	isNullable?: boolean
	absoluteDirectoryPath?: string[]
	relativeDirectoryPath?: string[]
}): IInterfaceField {
	return makeInterfaceField({
		name: name,
		fieldType: makeNumberEnumValueReference({
			name: enumName,
			valueName: valueName,
			targetId: [...absoluteDirectoryPath, enumName].join(`/`),
			isNullable,
			absoluteDirectoryPath: absoluteDirectoryPath,
			relativeDirectoryPath: relativeDirectoryPath,
		}),
	})
}
