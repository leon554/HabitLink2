import { Util } from "@/utils/util"
import { useContext, useState, type ReactNode } from "react"
import { AlertContext } from "../Alert/AlertProvider"
import { IoInformationCircleOutline } from "react-icons/io5"
import { IoMdEye, IoMdEyeOff } from "react-icons/io"
import { triggerHaptic } from "tactus"

interface Props{
    name: string
    charLimit: number
    value: string | undefined
    setValue: (value: string) => void
    placeHolder: string
    outerDivStyles?: string
    textArea?: boolean
    custom?: ReactNode
    numeric?: boolean
    password?: boolean
    infoText?: string
}
export default function TextBoxLimited({name, password, value, setValue, charLimit, placeHolder, outerDivStyles, textArea, custom, numeric, infoText}: Props) {
   
    const {alert} = useContext(AlertContext)
    const [showPass, setShowPass] = useState(false)

    return (
        <div className={`flex flex-col gap-2 relative ${outerDivStyles}`}>
            <div className="flex justify-between items-end ">
                <p className="text-sm font-medium text-subtext1 relative">
                    {name}
                    {infoText ? <IoInformationCircleOutline className="text-subtext3 absolute top-[4px] -right-6 hover:cursor-pointer"
                        onClick={() => alert(infoText)}/> : ""}
                </p>
                <p className="text-[10px] text-subtext3  ">
                    {(value ?? "").length}/{charLimit}
                </p>
            </div>
            {password ? 
            !showPass ? 
                
                <IoMdEyeOff className="absolute right-2 top-[33px] text-subtext3 hover:cursor-pointer" size={15} onClick={() => {setShowPass(true); triggerHaptic()}}/>:
                <IoMdEye className="absolute right-2 top-[33px] text-subtext3 hover:cursor-pointer" size={15} onClick={() => {setShowPass(false); triggerHaptic()}}/>
                
            : ""} 
            {textArea ? 
            <textarea 
                className="outline-1 outline-border2 rounded-md px-2 py-1.5 text-subtext3 text-xs h-20 resize-none"
                placeholder={placeHolder}
                value={value}
                onChange={e => Util.setValueLim(setValue, e.target.value, charLimit)}/>
            :
            <input type={!password || showPass ? "text" : "password"}
                className="outline-1 outline-border2 rounded-md px-2 text-subtext3 text-xs h-7 "
                placeholder={placeHolder}
                value={value}
                onChange={e => numeric ? isNaN(Number(e.target.value)) ?
                        null :
                        Util.setValueLim(setValue, e.target.value, charLimit) :
                        Util.setValueLim(setValue, e.target.value, charLimit)}/>
            }
            {custom}
        </div>
    )
}
