import type React from "react"

interface NumericProps{
    value: number
    setValue: (value: number) => void
    increment: number
    min: number
    max: number
}

export default function NumericInput(p: NumericProps) {
    function increment(){
        if(p.value + p.increment > p.max) return
        p.setValue(p.value + p.increment)
    }
    function decrement(){
        if(p.value - p.increment < p.min) return
        p.setValue(p.value - p.increment)
    }
    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>){
        if(Number(e.target.value) <= p.max && Number(e.target.value) >= p.min){
            p.setValue(Number(e.target.value))
        }
        else{
            p.setValue(0)
        }
    }
    return (
        <div className="outline-1 rounded-md outline-border2 flex justify-between p-0 w-fit">
            <button 
                onClick={decrement}
                className="pl-3 pr-3 text-subtext1 hover:bg-highlight font-mono rounded-md hover:text-stone-900  hover:cursor-pointer">
                -
            </button>
            <input type="text" className="w-7 text-center text-subtext1 border-0 outline-0 text-[14px]" value={p.value} 
            onChange={e => handleOnChange(e)}/>
            <button 
                onClick={increment}
                className="pl-3 pr-3 text-subtext1 hover:bg-highlight font-mono rounded-md hover:text-stone-900 hover:cursor-pointer">
                +
            </button>
        </div>
    )
}
