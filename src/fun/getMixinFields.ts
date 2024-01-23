import { isString } from 'lodash-es'
import { InputMixin } from '../model/InputMixin.js'
import { TInputNamedType } from '../model/TInputNamedType.js'
import { pathDirectory } from '../path/pathDirectory.js'
import { pathFromString } from '../path/pathFromString.js'
import { pathToString } from '../path/pathToString.js'
import { resolvePath } from '../path/resolvePath.js'

export function getMixinFields({
	json,
	declarationPath,
	mixins,
}: {
	json: Map<string, TInputNamedType>
	declarationPath: string
	mixins: (string | null)[] | string | null | undefined
}) {
	let mixinFields = {}
	if (mixins) {
		if (isString(mixins)) {
			mixins = [mixins]
		}
		for (const mixin of mixins) {
			if (!mixin) continue
			const declarationDir = pathDirectory(pathFromString(declarationPath))
			const mixinPath = pathFromString(mixin)
			const canonicalMixinPath = mixin.startsWith('.')
				? resolvePath(declarationDir, mixinPath)
				: mixinPath
			const mixinDeclaration = json.get(
				pathToString(canonicalMixinPath),
			) as InputMixin
			if (!mixinDeclaration) {
				throw new Error(
					`[q10dwq] Missing mixin: ${pathToString(
						canonicalMixinPath,
					)} (in ${declarationPath})`,
				)
			}
			if (mixinDeclaration['.is'] !== 'mixin') {
				throw new Error(
					`[q10e0h] Invalid mixin: ${pathToString(
						canonicalMixinPath,
					)} (in ${declarationPath})`,
				)
			}
			mixinFields = { ...mixinFields, ...mixinDeclaration }
		}
	}
	return mixinFields
}
