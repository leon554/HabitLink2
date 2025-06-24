import type { ReactNode } from "react";





export default function InfoPanel({ children }: { children: ReactNode}) {
  return (
    <div className="bg-panel1 flex flex-col  rounded-2xl w-[90%] max-w-[600px]  p-5 font-mono outline-1 outline-border">
      {children}
    </div>
  )
}

InfoPanel.Title = function Title({title} : {title: string}){
    return(
        <p className="text-title text-lg">
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
        <p>
            {text}
        </p>
    )
}