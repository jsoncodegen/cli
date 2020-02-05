import * as _ from 'lodash'
import { InputMixin } from '../model/InputMixin'
import { TInputNamedType } from '../model/TInputNamedType'
import { pathDirectory } from '../path/pathDirectory'
import { pathFromString } from '../path/pathFromString'
import { pathToString } from '../path/pathToString'
import { resolvePath } from '../path/resolvePath'

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
		if (_.isString(mixins)) {
			mixins = [mixins]
		}
		for (const mixin of mixins) {
			if (!mixin) continue
			const declarationDir = pathDirectory(
				pathFromString(declarationPath),
			)
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
