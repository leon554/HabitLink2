import ToolTip from "../ToolTip"

interface Props{
    value: string
    text: string
    toolTipText: string
}
export default function InfoBox(p: Props) {
    return (
        <ToolTip tooltip={
            <div className="rounded-2xl bg-panel2 outline-1 outline-border2 p-3 max-w-[300px] w-[200px]">
                <p className="whitespace-normal text-xs text-subtext2 w-full">
                    {p.toolTipText}
                </p>
            </div>
        }>
            <div className="flex relative group items-center justify-between rounded-2xl gap-2 px-4 py-2 outline-1 outline-border2 bg-panel2 hover:scale-[1.02] transition-transform duration-200 hover:cursor-default w-full">
                <p className="text-[12px]  text-subtext2 text-wrap text-center leading-none">
                    {p.text}
                </p>
                <p className="text-lg text-subtext1 leading-none ">
                    {p.value}
                </p>
            </div>
        </ToolTip>
    )
}
