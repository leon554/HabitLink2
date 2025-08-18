import { HabitTypeE } from "./types"

export namespace Util{

    export function capitilizeFirst(value: string | undefined){
        if(!value) return
        value = value.trim()
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
    export function pretifyGoalData(data: string | undefined | number, type: HabitTypeE | undefined){
        if(data == undefined || !HabitTypeE) return "Loading..."
        if(type == HabitTypeE.Distance_Based){
            return `${Number(data)}km`
        }
        if(type == HabitTypeE.Time_Based){
            return `${data}h`
        }
        return Number(data)
    }

    function secondsToString(time: number){
        let mins = time/60
        if(mins < 60) return `${Math.round(mins)}m`

        return `${ Math.floor(mins/60)}h ${mins % 60}m`
    }
    export function fetchMapItems<T>(ids: number[], map: Map<number, T>){
        let values: T[] = []
        ids.forEach(id => {
            const value = map.get(Number(id))
            if(value !== undefined) values.push(value)
        })
        return values
    }
    export function fetchAllMapItems<T, B>(map: Map<T, B>){
        return Array.from(map.values())
    }
    export function calculateProgress(startVal: number, currentVal: number, goalVal: number){
        if(goalVal > startVal){
            return (currentVal - startVal)/(goalVal - startVal)
        }
        else{
            return Math.abs(startVal - currentVal)/Math.abs(goalVal-startVal)
        }
    }
    export function updateMapArray<K, V>(originalMap: Map<K, V[]>, key: K, newItem: V): Map<K, V[]> {
        const currentArray = originalMap.get(key) ?? [];
        const updatedArray = [...currentArray, newItem];
        const newMap = new Map(originalMap);
        newMap.set(key, updatedArray);
        return newMap;
    }
    export function updateMap<K, V>(originalMap: Map<K, V>, key: K, newItem: V): Map<K, V> {
        const newMap = new Map(originalMap);
        newMap.set(key, newItem);
        return newMap;
    }
    export function deleteMapItem<K, V>(originalMap: Map<K, V>, key: K): Map<K, V> {
        const newMap = new Map(originalMap);
        newMap.delete(key);
        return newMap;
    }

    export function getInterpolatedColor(min: number,max: number,value: number,colorStart: string,colorEnd: string): string {
        value = Math.max(min, Math.min(value, max));

        const ratio = (value - min) / (max - min);

        const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
            const cleanHex = hex.replace("#", "");
            if (cleanHex.length !== 6) {
                throw new Error(`Invalid hex color: ${hex}`);
            }

            return {
                r: parseInt(cleanHex.substring(0, 2), 16),
                g: parseInt(cleanHex.substring(2, 4), 16),
                b: parseInt(cleanHex.substring(4, 6), 16),
            };
        };

        const toHex = (c: number): string => c.toString(16).padStart(2, "0");

        const start = hexToRgb(colorStart);
        const end = hexToRgb(colorEnd);

        const r = Math.round(start.r + (end.r - start.r) * ratio);
        const g = Math.round(start.g + (end.g - start.g) * ratio);
        const b = Math.round(start.b + (end.b - start.b) * ratio);

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    export function standardDeviation(numbers: number[]): number {
        const n = numbers.length;
        if (n === 0) return NaN;

        const mean = numbers.reduce((acc, val) => acc + val, 0) / n;
        const variance = numbers.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;

        return Math.sqrt(variance);
    }
    export function setValueLim(setFunc: (value: string) => void, value: string, lim: number){
        if(value.length <= lim){
            setFunc(value)
        }
    }
    export function sunBinrayStringToMon(data: string){
        const map = [6, 0, 1, 2, 3, 4, 5]
        let fixed: string[] = []
        data.split("").forEach((d, i) => {
            fixed[map[i]] = d
        })
        return fixed.join("")
    }
    export function monBinrayStringToSun(data: string){
        const map = [1,2,3,4,5,6,0]
        let fixed: string[] = []
        data.split("").forEach((d, i) => {
            fixed[map[i]] = d
        })
        return fixed.join("")
    }
    export function hslStringToHex(hsl: string): string {
        const match = hsl.match(/hsla?\(\s*([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\s*\)/i);

        if (!match) {
            throw new Error(`Invalid HSL string: ${hsl}`);
        }

        const h = parseFloat(match[1]);
        const s = parseFloat(match[2]);
        const l = parseFloat(match[3]);

        return hslToHex(h, s, l);
        }

        function hslToHex(h: number, s: number, l: number): string {
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }

        const toHex = (n: number) =>
            Math.round((n + m) * 255)
            .toString(16)
            .padStart(2, "0");

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

}