export function pathForceRelative(p: string[]) {
	return p[0] != null && p[0].startsWith('.') ? p : ['.', ...p]
}
