import { useContext, useState } from "react"
import { AlertContext } from "./Alert/AlertProvider"
import { AiOutlineLoading } from "react-icons/ai";
import { AuthContext } from "./Providers/AuthProvider";
import { SignUpResponses } from "../utils/types";

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
        console.log("called loging")
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
        <div className="flex justify-center mt-20">
            <div className="outline-1 outline-border bg-panel1 w-[80%] max-w-100 flex justify-center rounded-2xl p-5 flex-col items-center ">
                <p className="text-title font-mono text-2xl m-1 mt-4 font-semibold">
                    {login ? "Log In" : "Sign Up"}
                </p>
                <div className="w-full flex justify-center">
                    <p className="text-subtext2 text-[13px] mb-7 font font-mono">
                    Start your improvement journey today
                </p>
                </div>
                <form className=" w-[80%] flex flex-col gap-3 text-subtext1 font-mono" onSubmit={e => submit(e)}>
                    {!login ? <div>
                        <p className="mb-1.5">Name</p>
                        <input type="text" 
                        onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                        value={formData.name}
                        placeholder="Enter name"
                        autoComplete="username"
                        className="outline-1 text-[12px] rounded-xl w-full border-0 pl-2  outline-border2 text-sm p-1.5 text-subtext1 mb-1"/>
                    </div> : ""}
                    <div>
                        <p className="mb-1.5">Email</p>
                        <input type="text"  
                        onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                        value={formData.email}
                        placeholder="Enter email"
                        autoComplete="email"
                        className="outline-1 text-[12px] rounded-xl w-full border-0 pl-2 outline-border2 text-sm p-1.5 text-subtext1 mb-1"/>
                    </div>
                    <div>
                        <p className="mb-1.5">Password</p>
                        <input type="password"  
                        onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                        value={formData.password}
                        placeholder={login ? "Enter Password" : "Create password"}
                        autoComplete="new-password"
                        className="outline-1 text-[12px] rounded-xl w-full border-0 pl-2 outline-border2 text-sm p-1.5 text-subtext1 mb-1"/>
                    </div>
                    {!login ? <div>
                        <p className="mb-1.5">Confirm Password</p>
                        <input type="password"  
                        onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
                        value={formData.confirmPassword}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        className="outline-1 text-[12px] rounded-xl w-full border-0 pl-2 outline-border2 text-sm p-1.5 text-subtext1 mb-1"/>
                    </div>: ""}
                    <button className="flex justify-center bg-btn rounded-xl p-1 text-btn-text outline-1 outline-border2 darkmode:outline-0 mt-1.5 hover:cursor-pointer  duration-400 ease-in-out  h-8 items-center"
                    type="submit">
                        {auth.loading ? <AiOutlineLoading className="animate-spin" /> : (login? "Log In" : "Sign Up")}
                    </button>
                    <div className="flex justify-center mt-1.5 mb-8">
                        <p className="text-[13px] text-subtext3">
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
