import { useIsMobile } from "@/components/Hooks/useIsMobile";
import CreateGoal from "../components/CreateGoal";



export default function CreateGaolPage() {
    const isMobile= useIsMobile()
    return (
        <div className={`${isMobile ? "mb-24 mt-6" : "mb-5 mt-20"} flex justify-center `}>
                <CreateGoal/> 
        </div>
    )
}
