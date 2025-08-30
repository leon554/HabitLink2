import { Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert/Alert";
import { useContext } from "react";
import { AuthContext } from "@/components/Providers/AuthProvider";
import { AiOutlineLoading } from "react-icons/ai";
import { themeContext } from "@/components/Providers/ThemeProvider";



export default function Layout() {
    const auth = useContext(AuthContext)
    const theme = useContext(themeContext)
    
    return (
        <div >
            <Alert/>
            <Navbar/>
            {auth.loading || theme.loading? 
                <div className="w-full flex justify-center">
                    <AiOutlineLoading className="animate-spin mt-30 text-highlight" size={40}/>
                </div> :
                <main>
                    <Outlet/>
                </main>
            }
        </div>
    )
}
