export function get2Digit(object:number):string {
    return ['0', object].join('').slice(-2)
}