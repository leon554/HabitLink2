import type { ReactNode } from "react"
import { triggerHaptic } from "tactus"

interface Props{
    name: string | ReactNode
    onSubmit: () => Promise<void> | void
    icon?: ReactNode
    highlight: boolean
    style?: string
    small?: boolean
}
export default function ButtonComp({name, onSubmit, icon, highlight: highligh, style, small}: Props) {
  return (
    <button className={`flex justify-center items-center ${highligh ? "bg-highlight text-btn-text hover:bg-highlight/93 hover:rounded-lg" : "outline-1 outline-border2  text-subtext3 hover:bg-panel2 hover:rounded-b-lg"} transition-all duration-250 ease-in-out text-sm  ${small ? "h-7 px-3" : "h-8 px-5 font-medium"} rounded-md  hover:cursor-pointer ${style}`}
        onClick={async () => {
            triggerHaptic()
            onSubmit()
        }}>
        {icon}{name}
    </button>
  )
}
