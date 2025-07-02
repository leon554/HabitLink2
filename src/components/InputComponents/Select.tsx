import { useEffect, useRef, useState } from "react";
import { Util } from "../../utils/util";
import type { Origin } from "../../utils/types";

export interface dataFormat{
    name: string,
    id: number
}

interface SelectProps {
  items: dataFormat[];
  selectedItem: dataFormat | null;
  setSelectedItem: (id: number) => void;
  setText?: string | React.ReactNode
  style?: string
  origin?: Origin
}
export default function Select(props: SelectProps) {
    const focusElement = useRef<null|HTMLDivElement>(null)
    const [clicked, setClicked] = useState(false)

    function setItem(id: number) {
        props.setSelectedItem(id);
        if(focusElement.current != null){
            setClicked(false)
            focusElement.current.blur()
        }
    }

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (focusElement.current && !focusElement.current.contains(e.target as Node)) {
                setClicked(false);
            }
        }
        document.addEventListener("click", onClick)

        return () => {
            document.removeEventListener("click", onClick)
        }
    }, [])

    return (
        <div className="relative" ref={focusElement}>
            <button className={`group relative transition z-10  hover:cursor-pointer ${props.style ? props.style : " outline-1 bg-stone-800 text-sm text-stone-300 font-mono p-3 rounded-md flex justify-center  "}`}
                 onClick={() => setClicked(!clicked)}
            >
                {props.setText 
                    ?? (props.selectedItem == null 
                    ? "Select Habit" 
                    : Util.capitilizeFirst(props.selectedItem.name))}

            </button>
            <div className="absolute top-full right-0 rounded-2xl p-3 mt-2  flex flex-col justify-start items-start scale-0 duration-200 bg-panel1 text-subtext1  outline-border2  z-20 w-fit outline-1" style={{
                scale: clicked ? 1 : 0,
                transformOrigin: props.origin ?? "top"
                }}>
                {props.items && props.items.map((h) => {
                    return (
                    <p
                        className="hover:bg-highlight font-mono w-full flex justify-start p-1 rounded-xl transition duration-100 ease-in-out hover:cursor-pointer text-nowrap hover:text-btn-text px-3"
                        onClick={() => setItem(h.id)}
                    >
                        {Util.capitilizeFirst(h.name)}
                    </p>
                    );
                })}
            </div>
        </div>
    );
}
