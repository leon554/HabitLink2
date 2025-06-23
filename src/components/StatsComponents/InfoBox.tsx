
interface Props{
    value: string
    text: string
}
export default function InfoBox(p: Props) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl px-0.5 outline-1 outline-border2 bg-panel2 grow-1">
            <p className="text-xl mt-3 mb-1.5 text-subtext1">
                {p.value}
            </p>
            <p className="text-[11px] m-2 mt-0 text-subtext2 text-wrap text-center">
                {p.text}
            </p>
        </div>
    )
}
