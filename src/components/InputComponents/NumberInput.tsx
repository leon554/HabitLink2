

interface amountProps{
    setAmount: (amount: number) => void
    amount: number
    max?: number
}
export default function AmountInput(p: amountProps) {
   
    return (
        <div className="flex font-mono p-1 gap-2 rounded-md text-sm outline-1 outline-border2 justify-stretch">
            <div className="flex items-center  grow-1">
                <p className="text-subtext1 pl-1 pr-2 w-10 overflow-hidden truncate">
                    {p.amount}
                </p>
                <input
                    type="range"
                    min="0"
                    max={p.max ? p.max : "50"}
                    value={p.amount}
                    onChange={e => p.setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-panel2 rounded-lg appearance-none cursor-pointer slider-thumb mr-1"
                />
            </div>
        </div>
    )
}