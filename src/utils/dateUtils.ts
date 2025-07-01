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
}