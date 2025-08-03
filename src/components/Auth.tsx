import { useContext, useState } from "react"
import { AlertContext } from "./Alert/AlertProvider"
import { AiOutlineLoading } from "react-icons/ai";
import { AuthContext } from "./Providers/AuthProvider";
import { SignUpResponses } from "../utils/types";
import { LuLogIn } from "react-icons/lu";
import { Util } from "@/utils/util";

interface FormProps{
    name: string
    email: string
    password: string
    confirmPassword: string
}
export default function Auth() {
    const [formData, setFormData] = useState<FormProps>({name: "", email: "", password: "", confirmPassword: ""})
    const [login, setLogin] = useState(false)

    const auth = useContext(AuthContext)
    const {alert} = useContext(AlertContext)

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(login){
            await logIn()
        }else{
            await signUp()
        }
    }

    const logIn = async () => {
       await auth.login(formData.email, formData.password)
    }

    const signUp = async () => {
        if(formData.password != formData.confirmPassword){
            alert("Passwords do not match")
            return
        }
        if(formData.email == "" || formData.name == ""){
            alert("Some fields have no values")
        }

        const response = await auth.signup(formData.name, formData.email, formData.password)
        if(response == SignUpResponses.UserExists) setLogin(true)
    }

    return (
        <div className="flex justify-center mt-17">
            <div className="outline-1 outline-border bg-panel1 w-[90%] max-w-100 flex justify-center rounded-md p-5 flex-col items-center ">
                <p className="text-title  text-2xl m-1 mt-4 font-semibold">
                    {login ? "Log In" : "Sign Up"}
                </p>
                <div className="w-[90%] flex justify-center">
                    <p className="text-subtext2 mt-1 mb-5 font text-xs  text-center">
                    Start your improvement journey today
                </p>
                </div>
                <form className=" w-[90%] flex flex-col gap-3 text-subtext1 " onSubmit={e => submit(e)}>
                    {!login ? <div>
                        <p className="mb-1.5 text-sm font-medium">Name</p>
                        <input type="text" 
                        onChange={(e) => Util.setValueLim((v: string) => setFormData(prev => ({...prev, name: v})), e.target.value, 25) }
                        value={formData.name}
                        placeholder="Enter name"
                        autoComplete="username"
                        className="outline-1 text-[12px] rounded-sm w-full border-0 pl-2  outline-border2 text-sm p-1.5 text-subtext1 mb-1"/>
                        <div className="w-full flex justify-end mb-[-12px]">
                            <p className="text-xs text-subtext3">
                                {formData.name.length}/25
                            </p>
                        </div>
                    </div> : ""}
                    <div>
                        <p className="mb-1.5 text-sm font-medium">Email</p>
                        <input type="text"  
                        onChange={(e) => Util.setValueLim((v: string) => setFormData(prev => ({...prev, email: v})), e.target.value, 70)}
                        value={formData.email}
                        placeholder="Enter email"
                        autoComplete="email"
                        className="outline-1 text-[12px] rounded-sm w-full border-0 pl-2 outline-border2 text-sm p-1.5 text-subtext1 mb-1"/>
                        <div className="w-full flex justify-end mb-[-12px]">
                            <p className="text-xs text-subtext3">
                                {formData.email.length}/70
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="mb-1.5 text-sm font-medium">Password</p>
                        <input type="password"  
                        onChange={(e) => Util.setValueLim((v: string) => setFormData(prev => ({...prev, password: v})), e.target.value, 40)}
                        value={formData.password}
                        placeholder={login ? "Enter Password" : "Create password"}
                        autoComplete="new-password"
                        className="outline-1 text-[12px] rounded-sm w-full border-0 pl-2 outline-border2 text-sm p-1.5 text-subtext1 mb-1"/>
                        <div className={`w-full flex justify-end ${login ? "mb-[-5px]" : "mb-[-12px]"}`}>
                            <p className="text-xs text-subtext3">
                                {formData.password.length}/40
                            </p>
                        </div>
                    </div>
                    {!login ? <div>
                        <p className="mb-1.5 text-sm font-medium">Confirm Password</p>
                        <input type="password"  
                        onChange={(e) => Util.setValueLim((v: string) => setFormData(prev => ({...prev, confirmPassword: v})), e.target.value, 40)}
                        value={formData.confirmPassword}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        className="outline-1 text-[12px] rounded-sm w-full border-0 pl-2 outline-border2 text-sm p-1.5 text-subtext1 mb-1"/>
                        <div className={`w-full flex justify-end mb-[-5px]`}>
                            <p className="text-xs text-subtext3">
                                {formData.confirmPassword.length}/40
                            </p>
                        </div>
                    </div>: ""}
                    <button className="flex justify-center gap-2 bg-btn rounded-sm p-1 text-btn-text font-medium text-sm  outline-border2 darkmode:outline-0 mt-1.5 hover:cursor-pointer  duration-400 ease-in-out  h-8 items-center"
                    type="submit">
                         {auth.loading ? <AiOutlineLoading className="animate-spin" /> : (login? "Log In"  : "Sign Up")} {auth.loading ? "" : <LuLogIn />}
                    </button>
                    <div className="flex justify-center mt-1.5 mb-8">
                        <p className="text-[13px] text-subtext3 text-center">
                            {login ? "Don't have and acount?" : "Allready have an acount?"}
                            <a className="text-highlight hover:cursor-pointer" 
                                onClick={() => setLogin(!login)}> 
                                 {(login ? " Sign Up" : " Log In")}
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
