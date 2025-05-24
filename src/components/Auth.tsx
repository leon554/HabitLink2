import { useContext, useState } from "react"
import { AlertContext } from "./Alert/AlertProvider"
import { supabase } from "../supabase-client"
import { AiOutlineLoading } from "react-icons/ai";

interface FormProps{
    name: string
    email: string
    password: string
    confirmPassword: string
}
export default function Auth() {
    const [formData, setFormData] = useState<FormProps>({name: "", email: "", password: "", confirmPassword: ""})
    const [login, setLogin] = useState(false)
    const [loading, setLoading] = useState(false)
    const alertData = useContext(AlertContext)


    const submit = async () => {
        setLoading(true)
        if(login){
            await logIn()
        }else{
            await signUp()
        }
        setLoading(false)
    }
    const logIn = async () => {
        const {error} = await supabase.auth.signInWithPassword({email: formData.email, password: formData.password})
        if(error){
            alertData.alert("Log In Error: " + error)
        }
    }
    const signUp = async () => {
        if(formData.password != formData.confirmPassword){
            alertData.alert("Passwords do not match")
            return
        }
        if(formData.email == "" || formData.name == ""){
            alertData.alert("Some fields have no values")
        }

        const {error, data} = await supabase.auth.signUp({email: formData.email, password: formData.password})
        
        if(error){
            alertData.alert("Sign Up Error: " + error.message)
            return
        }
        if(data.user?.identities?.length === 0){
            alertData.alert("User allready exists please log in")
            setLogin(true)
        }else{
            alertData.alert("Confirmation email sent")
        }
        
    }

    return (
        <div className="flex justify-center mt-20">
            <div className="outline-1 bg-stone-800 w-[80%] max-w-100 flex justify-center rounded-md p-5 flex-col items-center">
                <p className="text-gray-200 font-mono text-2xl m-1 mt-4 font-semibold">
                    {login ? "Log In" : "Sign Up"}
                </p>
                <div className="w-full flex justify-center">
                    <p className="text-stone-300 text-[13px] mb-7 font font-mono">
                    Start your improvement journey today
                </p>
                </div>
                <form className=" w-[80%] flex flex-col gap-3 text-gray-300 font-mono" onSubmit={submit}>
                    {!login ? <div>
                        <p className="mb-1.5">Name</p>
                        <input type="text" 
                        onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                        value={formData.name}
                        placeholder="Enter name"
                        autoComplete="username"
                        className="outline-1 text-[12px] rounded-md w-full border-0  outline-gray-500 text-sm p-1.5 text-gray-200 mb-1"/>
                    </div> : ""}
                    <div>
                        <p className="mb-1.5">Email</p>
                        <input type="text"  
                        onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                        value={formData.email}
                        placeholder="Enter email"
                        autoComplete="email"
                        className="outline-1 text-[12px] rounded-md w-full border-0 outline-gray-500 text-sm p-1.5 text-gray-200 mb-1"/>
                    </div>
                    <div>
                        <p className="mb-1.5">Password</p>
                        <input type="password"  
                        onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                        value={formData.password}
                        placeholder={login ? "Enter Password" : "Create password"}
                        autoComplete="new-password"
                        className="outline-1 text-[12px] rounded-md w-full border-0 outline-gray-500 text-sm p-1.5 text-gray-200 mb-1"/>
                    </div>
                    {!login ? <div>
                        <p className="mb-1.5">Confirm Password</p>
                        <input type="password"  
                        onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
                        value={formData.confirmPassword}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        className="outline-1 text-[12px] rounded-md w-full border-0 outline-gray-500 text-sm p-1.5 text-gray-200 mb-1"/>
                    </div>: ""}
                    <button className="flex justify-center bg-green-400 rounded-md p-1 text-stone-800 mt-1.5 hover:cursor-pointer hover:text-stone-950 duration-400 ease-in-out hover:bg-green-300 h-8 items-center"
                    type="submit">
                        {loading ? <AiOutlineLoading className="animate-spin" /> : (login? "Log In" : "Sign Up")}
                    </button>
                    <div className="flex justify-center mt-1.5 mb-8">
                        <p className="text-[13px] text-stone-400">
                            {login ? "Don't have and acount?" : "Allready have an acount?"}
                            <a className="text-green-400 hover:cursor-pointer" 
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
