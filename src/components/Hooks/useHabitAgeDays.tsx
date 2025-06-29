import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
import { differenceInCalendarDays } from "date-fns";


export default function useHabitAgeDays(habitID: number) {
  
    const HC = useContext(UserContext)
    const habit = HC.habits.get(habitID)

    if(!habit) return null

    return differenceInCalendarDays(new Date(), new Date(Number(habit.creationDate)))
}
