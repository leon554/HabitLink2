import { isValid, isAfter, isBefore} from "date-fns";

export namespace dateUtils{

    export function isDatesSameDay(date1: Date, date2: Date){
        return (date1.getFullYear() == date2.getFullYear() &&
                date1.getMonth() == date2.getMonth() &&
                date1.getDate() == date2.getDate())
    }
    export function isDateInCurrentWeek(date: Date) {
        const now = new Date();
        
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const targetDate = new Date(date);

        return targetDate >= startOfWeek && targetDate <= endOfWeek;
    }
    export function getStartOfWeekDate(){
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return startOfWeek
    }
    export function getEndOfWeekDate() {
        const now = new Date();
        const endOfWeek = new Date(now);

        const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
        endOfWeek.setDate(now.getDate() + daysUntilSaturday);
        endOfWeek.setHours(23, 59, 59, 999);

        return endOfWeek;
    }
    export function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    export function daysLeftInWeekExToday(today?: Date){
        return 6 - (today ?? new Date()).getDay()
    }
    export function daysLeftInWeekIncToday(today?: Date){
        return 7 - (today ?? new Date()).getDay()
    }
    export function isDateInWeek(date: Date, week: Date) {
        
        const startOfWeek = new Date(week);
        startOfWeek.setDate(week.getDate() - week.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const targetDate = new Date(date);

        return targetDate >= startOfWeek && targetDate <= endOfWeek;
    }
    export function formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
    export function isStringValidDate(date: string, minDate?: Date, maxDate? : Date){
        const maxTimeNum = 8640000000000000

        const componets = date.split("/").map(c => Number(c)).filter(c => !isNaN(c))
        if(componets.length != 3) return false
        if(componets[1] > 12) return false
        if(componets[0] > 31) return false

        const selectedDate = new Date(`${componets[2]}-${String(componets[1]).padStart(2, "0")}-${String(componets[0]).padStart(2, "0")}T${dateUtils.getCurrentTime()}`)
       
        if(!isAfter(selectedDate, minDate ?? new Date(0))) return false
        if(!isBefore(selectedDate, maxDate ?? new Date(maxTimeNum))) return false

        return isValid(selectedDate)
    }
    export function stringToDate(date: string){
        const componets = date.split("/").map(c => Number(c)).filter(c => !isNaN(c))
        return new Date(`${componets[2]}-${String(componets[1]).padStart(2, "0")}-${String(componets[0]).padStart(2, "0")}T${dateUtils.getCurrentTime()}`)
    }
    export function formatTime(ms: number): string {
        if (ms <= 0) return "0d 00h 00m 00s";

        const totalSeconds = Math.floor(ms / 1000);

        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
    }
    export function getDayStringFromDay(date: Date, charAmount?: number){
        const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

        return daysArr[date.getDay()].slice(0, Math.min(charAmount ?? 3, 3))
    }
    export function formatTo12HourTime(unixMs: number): string {
        const date = new Date(unixMs);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 === 0 ? 12 : hours % 12;
        const paddedMinutes = minutes.toString().padStart(2, '0');

        return `${hour12}:${paddedMinutes} ${ampm}`;
    }

}