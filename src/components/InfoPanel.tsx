import type { ReactNode } from "react";





export default function InfoPanel({ children, full }: { children: ReactNode, full?: boolean}) {
  return (
    <div className={`bg-panel1 flex flex-col  rounded-2xl ${full ? "w-full" : "w-[90%]"} max-w-[600px]  p-5 outline-1 outline-border`}>
      {children}
    </div>
  )
}

InfoPanel.Title = function Title({title} : {title: string}){
    return(
        <p className="text-title text-lg font-medium">
            {title}
        </p>
    )
}
InfoPanel.BodyContainer = function BodyContainer({ children }: { children: ReactNode}){
    return(
        <div className="mt-3 flex flex-col text-subtext2 gap-1">
            {children}
        </div>
    )
}
InfoPanel.SubText = function SubText({text} : {text: string}){
    return(
        <p className="text-sm">
            {text}
        </p>
    )
}
InfoPanel.BubbleText = function BubbleText({text, bubbleText, mb}: {text: string, bubbleText: string, mb: number}){
    return(
         <div className="flex gap-2" style={{marginBottom: `${mb}px`}}>
            <p className="text-sm">
                {text}
            </p>
            <p className="outline-border2 outline-1 dark:outline-0 rounded-xl px-3 pb-0.5 bg-btn text-btn-text text-xs flex items-center">
                {bubbleText}
            </p>
        </div>
    )
}