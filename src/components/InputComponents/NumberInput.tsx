

interface amountProps{
    setAmount: (amount: number) => void
    amount: number
    max?: number
}
export default function AmountInput(p: amountProps) {
   
    return (
        <div className="flex font-mono p-1 gap-2 rounded-md text-sm outline-1 outline-stone-500 justify-stretch">
            <div className="flex items-center  grow-1">
                <p className="text-stone-400 pl-1 pr-2 w-9 overflow-hidden">
                    {p.amount}
                </p>
                <input
                    type="range"
                    min="0"
                    max={p.max ? p.max : "50"}
                    value={p.amount}
                    onChange={e => p.setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer slider-thumb mr-1"
                />
            </div>
            
        </div>
    )
}