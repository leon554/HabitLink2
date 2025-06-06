import { useRef, useState } from "react";
import type { HabitType } from "../../utils/types";
import { Util } from "../../utils/util";


interface SelectProps {
  habits: HabitType[];
  selectedHabit: HabitType | null;
  setSelectedHabit: (habit: HabitType) => void;
  setText?: string | React.ElementType
  style?: string
}
export default function Select(props: SelectProps) {
    const focusElement = useRef<null|HTMLButtonElement>(null)
    const [clicked, setClicked] = useState(false)

    function setHabit(h: HabitType) {
        props.setSelectedHabit(h);
        if(focusElement.current != null){
        focusElement.current.blur()
        }
    }
    return (
        <div>
        <button className={`group relative transition delay-50 duration-300 ease-in-out hover:cursor-pointer ${props.style ? props.style : " outline-1 bg-stone-800 text-sm text-stone-300 font-mono p-3 rounded-md flex justify-center  "}`}
            ref={focusElement} onClick={() => setClicked(!clicked)}
        >
            {props.setText ? 
            <props.setText/>
            :props.selectedHabit == null
            ? "Select Habit"
            : Util.capitilizeFirst(props.selectedHabit.name)}
            <div className="absolute top-full rounded-md p-3 mt-2  flex flex-col justify-start items-start scale-0 origin-top duration-200 bg-stone-800  z-20 w-fit outline-1" style={{
            scale: clicked ? 1 : 0
            }}>
            {props.habits && props.habits.map((h) => {
                return (
                <p
                    className="hover:bg-green-400 font-mono w-full flex justify-start p-1 rounded-md transition duration-100 ease-in-out hover:cursor-pointer text-nowrap hover:text-stone-800"
                    onClick={() => setHabit(h)}
                >
                    {Util.capitilizeFirst(h.name)}
                </p>
                );
            })}
            </div>
        </button>
        </div>
    );
}
