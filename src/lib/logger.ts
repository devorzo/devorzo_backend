export enum Level {
    "VERBOSE",
    "INFO",
    "DEBUG",
    "WARN",
    "ERROR",
}

const logger = (str: any = "log", level: Level = Level.INFO) => {
    // @ts-ignore
    if (process.env[Level[level]] == 1) {
        if (level == Level.VERBOSE) {
            process.stdout.write(`\n${Level[level]}: `)
            console.log(str)
        }

        if (level == Level.INFO) {
            process.stdout.write(`\n${Level[level]}: `)
            console.info(str)
        }

        if (level == Level.DEBUG) {
            process.stdout.write(`\n${Level[level]}: `)
            console.trace(str)
        }

        if (level == Level.WARN) {
            process.stdout.write(`\n${Level[level]}: `)
            console.warn(str)
        }

        if (level == Level.ERROR) {
            process.stdout.write(`\n${Level[level]}: `)
            console.error(str)
        }
    }    
}

export default logger