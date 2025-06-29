
interface Props{
    value: string
    text: string
}
export default function InfoBox(p: Props) {
    return (
        <div className="flex items-center justify-between rounded-2xl gap-2 px-4 py-2 outline-1 outline-border2 bg-panel2 hover:scale-[1.02] transition-transform duration-200 hover:cursor-default w-full">
            <p className="text-[12px]  text-subtext2 text-wrap text-center leading-none">
                {p.text}
            </p>
            <p className="text-lg text-subtext1 leading-none ">
                {p.value}
            </p>
        </div>
    )
}
