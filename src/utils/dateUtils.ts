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
    export function daysLeftInWeek(){
        return 6 - (new Date()).getDay()
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
}