import { Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert/Alert";


export default function Layout() {

    return (
        <>
            <div className="absolute inset-0 texture opacity-20 dark:opacity-10 pointer-events-none -z-30 h-screen" />
            <Alert/>
            <Navbar/>
            <main>
                <Outlet/>
            </main>
        </>
    )
}
