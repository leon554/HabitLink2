import { useContext, useState } from "react";
import TextBoxLimited from "./primatives/TextBoxLimited";
import ButtonComp from "./primatives/ButtonComp";
import { AlertContext } from "./Alert/AlertProvider";
import { AuthContext } from "./Providers/AuthProvider";
import { useNavigate } from "react-router-dom";


export default function ResetPassword() {

    const [password, setPassword] = useState("")
    const {alert} = useContext(AlertContext)
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    async function reset(){
        if(password.length < 5){
            alert("Enter longer password")
            return 
        }
        await auth.updatePassword(password)
        navigate("/dashboard")
    }
    return (
        <div className="w-full flex justify-center">
            <div className="p-7 outline-1 outline-border bg-panel1 gap-5 rounded-2xl mt-17 w-[90%] max-w-100 flex flex-col items-center">
                <p className="text-lg text-title font-medium">
                    Reset Password
                </p>
                <TextBoxLimited
                    name="New Password"
                    password={true}
                    charLimit={50}
                    value={password}
                    setValue={setPassword}
                    placeHolder="Enter new password"
                    outerDivStyles="w-full mt-2"/>

                <ButtonComp
                    name={"Reset"}
                    highlight={true}
                    style="w-full"
                    onSubmit={reset}/>
            </div>
        </div>
    )
}
