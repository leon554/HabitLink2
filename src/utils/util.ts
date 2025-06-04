export namespace Util{

    export function capitilizeFirst(value: string | undefined){
        if(!value) return
        return value.slice(0, 1).toUpperCase() + value.slice(1)
    }
    export function avgNumArr(arr: number[]){
        const sum = arr.reduce((s, c) => s + c, 0)
        return sum/arr.length
    }
}