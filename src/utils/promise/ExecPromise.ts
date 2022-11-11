import {exec, ExecOptionsWithStringEncoding} from 'child_process'

export function execAsync(command: string, options: ExecOptionsWithStringEncoding): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return
            }
            resolve(stdout.trim())
        })
    })
}
