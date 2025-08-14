import { AuthContext } from "@/components/Providers/AuthProvider"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"


export default function Thankyou() {

    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    return (
        <div className="w-full flex justify-center mt-30">
            <div className="bg-panel1 outline-1 outline-border rounded-2xl w-[90%] max-w-[600px] p-7 flex flex-col gap-5">
                <p className="text-3xl font-medium text-title text-center">
                    Thankyou For Your Purchase
                </p>
                <p className="text-center text-sm text-subtext2">
                    You now have {auth.localUser?.tokens} tokens to use on any AI features throughout the app
                </p>
                <button className="bg-btn text-btn-text rounded-2xl h-8 text-sm font-medium hover:cursor-pointer"
                    onClick={() => navigate("/dashboard")}>
                    Home
                </button>
            </div>
        </div>
    )
}
