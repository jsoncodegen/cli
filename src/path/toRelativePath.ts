import * as lodash from 'lodash'
import { findCommonRoot } from './findCommonRoot'
import { normalizePath } from './normalizePath'

export function toRelativePath(base: string[], target: string[]) {
	base = normalizePath(base)
	target = normalizePath(target)
	const common = findCommonRoot(base, target)
	return lodash
		.range(base.length - common.length)
		.map(() => '..')
		.concat(target.slice(common.length))
}
