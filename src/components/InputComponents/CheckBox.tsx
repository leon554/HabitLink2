import { FaCheck } from "react-icons/fa";

interface Props{
    checked: boolean
    setChecked: (checked: boolean) => void
}
export default function CheckBox(p: Props) {
    return (
        <div className={`${p.checked ? "bg-btn" : "bg-subtext2/40"} w-[13px] h-[13px] rounded-sm hover:cursor-pointer flex items-center justify-center`}
        onClick={() => p.setChecked(!p.checked)}>
            {p.checked ? <FaCheck size={9} className="text-btn-text mt-[1px]"/> : ""}
        </div>
    )
}
