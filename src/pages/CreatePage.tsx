import { useIsMobile } from "@/components/Hooks/useIsMobile"
import Create from "../components/Create"

export default function CreatePage() {
    const isMobile = useIsMobile()
    return (
        <div className={`${isMobile ? "mb-24 mt-6" : "mt-20 mb-5"} flex flex-col items-center `}>
            <div className="max-w-[90%]">
                <Create compact={false}/>
            </div>
        </div>
    )
}
