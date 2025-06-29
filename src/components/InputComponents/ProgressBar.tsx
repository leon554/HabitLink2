
interface ProgressBarProps{
    min: number
    max: number
    current: number
}
export default function ProgressBar(p: ProgressBarProps) {
  return (
    <div className="h-3 bg-progress-panel rounded-full box-border flex items-center">
        {(p.current / (p.max - p.min)) * 100 < 1 ? "" 
        : 
        <div className={`dark:bg-highlight bg-highlight h-3 rounded-full ml-[-1px] transition-all duration-2000 ease-in-out`} style={{ width: `${(p.current / (p.max - p.min)) * 101}%` }}>

        </div>}
    </div>
  )
}
