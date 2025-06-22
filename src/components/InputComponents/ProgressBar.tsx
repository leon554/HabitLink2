
interface ProgressBarProps{
    min: number
    max: number
    current: number
}
export default function ProgressBar(p: ProgressBarProps) {
  return (
    <div className="h-3 border-1 border-stone-500 rounded-full box-border flex items-center">
        {(p.current / (p.max - p.min)) * 100 < 1 ? "" 
        : 
        <div className={`dark:bg-highlight bg-highlight h-3 rounded-full ml-[-1px] `} style={{ width: `${(p.current / (p.max - p.min)) * 101}%` }}>

        </div>}
    </div>
  )
}
