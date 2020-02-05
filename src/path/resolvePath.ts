import { normalizePath } from './normalizePath'

export function resolvePath(base: string[], target: string[]) {
	return normalizePath(base.concat(target))
}
