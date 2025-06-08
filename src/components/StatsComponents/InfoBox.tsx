
interface Props{
    value: string
    text: string
}
export default function InfoBox(p: Props) {
    return (
        <div className="outline-1 flex flex-col items-center justify-center rounded-md outline-stone-600  grow-1">
            <p className="text-xl mt-3 mb-1.5 text-stone-400">
                {p.value}
            </p>
            <p className="text-[11px] m-2 mt-0 text-stone-400 text-wrap text-center">
                {p.text}
            </p>
        </div>
    )
}
