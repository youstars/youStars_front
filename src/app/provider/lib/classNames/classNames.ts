type Mode = Record<string, boolean | string>

export function className(cls: string, mods: Mode, additional: string[]): string {
    return [
        cls,
        ...additional,
        ...Object.entries(mods)
            .filter(([_, value]) => Boolean(value))
            .map(([className]) => className)
    ].join(' ')
}
