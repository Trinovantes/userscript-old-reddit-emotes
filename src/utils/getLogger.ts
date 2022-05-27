export function getLogger(prefix: string) {
    return {
        logDebug: (...args: Array<unknown>) => console.debug(DEFINE.NAME, prefix, ...args),
        logInfo: (...args: Array<unknown>) => console.info(DEFINE.NAME, prefix, ...args),
        logWarn: (...args: Array<unknown>) => console.warn(DEFINE.NAME, prefix, ...args),
        logError: (...args: Array<unknown>) => console.error(DEFINE.NAME, prefix, ...args),
    }
}
