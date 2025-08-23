import { useEffect, useRef, useState, type ReactNode } from "react";
import { Util } from "../../utils/util";
import type { Origin } from "../../utils/types";
import { triggerHaptic } from "tactus";

export interface dataFormat{
    icon?: ReactNode
    name: string,
    id: number
}

interface SelectProps {
  items: dataFormat[];
  selectedItem: dataFormat | null;
  setSelectedItem: (id: number) => void;
  setText?: string | React.ReactNode
  defaultText?: string
  style?: string
  origin?: Origin
  center?: boolean
  blur?: boolean
  largeText?: boolean
  setBlur?: (blur: boolean) => void
  onBtnClick? : () => void
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
        if(props.blur && props.setBlur && focusElement.current != null){
            setClicked(false)
            focusElement.current.blur()
            props.setBlur(false)
        }
        const onClick = (e: MouseEvent) => {
            if (focusElement.current && !focusElement.current.contains(e.target as Node)) {
                setClicked(false);
            }
        }
        document.addEventListener("click", onClick)

        return () => {
            document.removeEventListener("click", onClick)
        }
    }, [props.blur])

    return (
        <div className="relative" ref={focusElement}>
            <button className={`group relative transition-transform   hover:cursor-pointer ${props.style ? props.style : " outline-1 bg-stone-800 text-sm text-stone-300 font-mono p-3 rounded-md flex justify-center  "}`}
                 onClick={(e) => {
                    triggerHaptic()
                    setClicked(!clicked)
                    props.onBtnClick?.()
                    e.stopPropagation()
                }}>
                {props.setText 
                    ?? (props.selectedItem == null 
                    ? props.defaultText 
                    : Util.capitilizeFirst(props.selectedItem.name))}

            </button>
            <div className={`absolute top-full ${props.center ? "left-1/2 transform -translate-x-1/2" : "right-0 "} rounded-2xl p-2.5  overflow-y-scroll no-scrollbar max-h-100 px-1.5 mt-2 m-2 ${props.largeText ? "gap-1.5" : "gap-1"} flex flex-col justify-start items-start scale-0 transition-transform duration-200 bg-panel1 text-subtext1  outline-border2  z-20 w-fit outline-1`} style={{
                scale: clicked ? 1 : 0,
                transformOrigin: props.origin ?? "top"
                }}
                onWheel={e => {
                    e.stopPropagation();
                    e.preventDefault();
                }}>
                {props.items && props.items.map((h) => {
                    return (
                    <p
                        className={`hover:bg-highlight gap-1.5 w-full flex items-center justify-start p-1 px-0.5 ${props.largeText ? "" : "text-sm"} rounded-xl transition duration-100 ease-in-out hover:cursor-pointer text-nowrap hover:text-btn-text px-3`}
                        onClick={() => {
                            triggerHaptic()
                            setItem(h.id)
                        }}>
                        {h.icon} {Util.capitilizeFirst(h.name)}
                    </p>
                    );
                })}
            </div>
        </div>
    );
}
