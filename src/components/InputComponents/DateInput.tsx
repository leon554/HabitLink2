import { dateUtils } from "@/utils/dateUtils";

interface Props {
    date: string
    setDate: (date: string) => void
    minDate? : Date
    maxDate? : Date
    fullWidth? : boolean
}
export default function DateInput(p: Props) {
    

    return (
        <input 
            value={p.date}
            maxLength={10}
            onKeyDown={(e) => {
                const allowedChars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Backspace"];
                if (!allowedChars.includes(e.key)) {
                    e.preventDefault();
                }
            }}
            onChange={e => {
                let value = e.target.value
                let valueArr = e.target.value.split("")

                if(valueArr.length >= 2 && !valueArr.includes("/") && value.length > p.date.length){
                    valueArr.splice(2, 0, "/")
                }
                if(valueArr.length >= 5 && !valueArr.slice(3).includes("/") && value.length > p.date.length){
                    valueArr.splice(5, 0, "/")
                }
                
                p.setDate(valueArr.join(""))
            }}
            type="text" 
            placeholder="dd/mm/yyyy"
            className={`outline-1 ${dateUtils.isStringValidDate(p.date, p.minDate, p.maxDate) || p.date == "" ? "outline-border2 " : "outline-red-500"} rounded-xl pl-2 p-1 text-sm text-subtext2  ${p.fullWidth ? "w-full" : "w-30"}`}>
        </input>
    )
}
