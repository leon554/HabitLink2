import { HabitTypeE } from "./types"

export namespace Util{

    export function capitilizeFirst(value: string | undefined){
        if(!value) return
        return value.slice(0, 1).toUpperCase() + value.slice(1)
    }
    export function avgNumArr(arr: number[]){
        const sum = arr.reduce((s, c) => s + c, 0)
        return sum/arr.length
    }
    export function pretifyNumber(num: number): string {
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1) + "b";
        } else if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + "m";
        } else if (num >= 1_000) {
            return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + "k";
        } else {
            return num.toString();
        }
    }
    export function secondsToHours(seconds: number): number {
        console.log(seconds)
        return Math.round((seconds / 3600) * 100) / 100;
    }
    export function pretifyData(data: string | undefined | number, type: HabitTypeE | undefined){
        if(data == undefined || !HabitTypeE) return "Loading..."
        if(type == HabitTypeE.Distance_Based){
            return `${Number(data)}km`
        }
        if(type == HabitTypeE.Time_Based){
            return secondsToString(Number(data))
        }
        return Number(data)
    }

    function secondsToString(time: number){
        let mins = time/60
        if(mins < 60) return `${Math.round(mins)}m`

        return `${ Math.floor(mins/60)}h ${mins % 60}m`
    }
}