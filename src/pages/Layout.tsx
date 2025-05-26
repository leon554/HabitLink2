import { Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert/Alert";
import HabitInputBox from "../components/InputBox/HabitInputBox";



export default function Layout() {

    return (
        <>
            <Alert/>
            <HabitInputBox/>
            <Navbar/>
            <main>
                <Outlet/>
            </main>
        </>
    )
}
