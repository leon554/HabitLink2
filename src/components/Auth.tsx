import { useContext, useState } from "react"
import { AlertContext } from "./Alert/AlertProvider"
import { AiOutlineLoading } from "react-icons/ai";
import { AuthContext } from "./Providers/AuthProvider";
import { SignUpResponses } from "../utils/types";
import { LuLogIn } from "react-icons/lu";
import { triggerHaptic } from "tactus";
import CheckBox from "./InputComponents/CheckBox";
import { useNavigate } from "react-router-dom";
import TextBoxLimited from "./primatives/TextBoxLimited";
import { Turnstile } from '@marsidev/react-turnstile'



interface FormProps{
    name: string
    email: string
    password: string
    confirmPassword: string
}
export default function Auth() {
    const [formData, setFormData] = useState<FormProps>({name: "", email: "", password: "", confirmPassword: ""})
    const [login, setLogin] = useState(false)
    const navigate = useNavigate()

    const auth = useContext(AuthContext)
    const {alert} = useContext(AlertContext)
    const [checked, setChecked] = useState(false)

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(login){
            await logIn()
        }else{
            if(!checked){
                alert("Please read and agree to Terms & Conditions and Privacy Policy")
                return
            }
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

    async function resetPassword(){
        if(formData.email == ""){
            alert("Enter valid email to reset password")
            return
        }

        auth.sendResetPassword(formData.email)
    }

    return (
        <div className="flex justify-center mt-17">
            <div className="shadow-md shadow-gray-200 dark:shadow-none outline-1 outline-border bg-panel1 w-[90%] max-w-94 flex justify-center rounded-xl p-5 flex-col items-center ">
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
                        <TextBoxLimited
                            name="Name"
                            value={formData.name}
                            setValue={data => setFormData(prev => ({...prev, name: data}))}
                            placeHolder="Enter name"
                            charLimit={20}/>
                    </div> : ""}
                    <div>
                        <TextBoxLimited
                            name="Email"
                            value={formData.email}
                            setValue={data => setFormData(prev => ({...prev, email: data}))}
                            placeHolder="Enter email"
                            charLimit={70}/>
                    </div>
                    <div className="flex flex-col items-end mb-1">
                        <TextBoxLimited
                            name="Password"
                            value={formData.password}
                            setValue={data => setFormData(prev => ({...prev, password: data}))}
                            charLimit={40}
                            password={true}
                            placeHolder={login ? "Enter Password" : "Create password"}
                            outerDivStyles="w-full"/>
                        {login ? 
                        <p className="text-xs  text-subtext3 underline hover:cursor-pointer mt-1"
                            onClick={resetPassword}>
                            Forgot password
                        </p>
                        : null
                        }
                    </div>
                    {!login ? <div>
                        <TextBoxLimited
                            name="Confirm Password"
                            value={formData.confirmPassword}
                            setValue={data => setFormData(prev => ({...prev, confirmPassword: data}))}
                            charLimit={40}
                            password={true}
                            placeHolder={"Confirm password"}/>
                    </div>: ""}
                    {!login ? 
                    <div>
                        <label className="flex items-start space-x-2 text-xs mt-1 mb-2 text-subtext3">
                            <div className=" pt-1">
                                <CheckBox checked={checked} setChecked={setChecked}/>
                            </div>
                            <span className="">
                                I have read and agree to the{" "}
                                <a className="text-subtext3 underline leading-none hover:cursor-pointer" onClick={() => navigate("/terms")}>
                                Terms & Conditions
                                </a>{" "}
                                and{" "}
                                <a  className="text-subtext3 underline hover:cursor-pointer" onClick={() => navigate("/priv")}>
                                Privacy Policy
                                </a>.
                            </span>
                        </label>
                    </div>
                    : "" }
                    <div className="w-full flex justify-center">
                        <Turnstile
                            siteKey="0x4AAAAAABuQp8at38COv4fq"
                            onSuccess={(token) => {
                                auth.setCaptchaToken(token)
                            }}
                            
                        />
                    </div>
                    <button className="flex justify-center gap-2 bg-btn rounded-sm p-1 text-btn-text font-medium text-sm  outline-border2 darkmode:outline-0 mt-1.5 hover:cursor-pointer  duration-400 ease-in-out  h-8 items-center"
                        type="submit">
                        {auth.loading ? <AiOutlineLoading className="animate-spin" /> : (login? "Log In"  : "Sign Up")}  {auth.loading ? "" : <LuLogIn />}
                    </button>

                    <button
                        type="button"
                        onClick={ async (e) => {
                            triggerHaptic()
                            if(!checked && !login){
                                alert("Please read and agree to Terms & Conditions and Privacy Policy")
                                return
                            }
                            e.preventDefault()
                            await auth.signInWithGoogle()
                        }}
                        className="flex items-center h-9 justify-center gap-2.5 px-4 py-1.5 mt-0.5 border border-border2 rounded-md shadow-sm hover:cursor-pointer"
                        >
                            <img
                                src="https://www.svgrepo.com/show/355037/google.svg"
                                alt="Google logo"
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium text-subtext2 ">
                                {(!login ? " Sign up with Google" : " Log in with Google")}
                            </span>                         
                    </button>
                    <div className="flex justify-center mt-1.5 mb-8">
                        <p className="text-[13px] text-subtext3 text-center">
                            {login ? "Don't have and acount?" : "Allready have an acount?"}
                            <a className="text-highlight hover:cursor-pointer" 
                                onClick={() => {
                                    triggerHaptic()
                                    setLogin(!login)
                                }}> 
                                 {(login ? " Sign Up" : " Log In")}
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
