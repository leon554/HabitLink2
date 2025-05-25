import { Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert/Alert";



export default function Layout() {

    return (
        <>
            <Alert/>
            <Navbar/>
            <main>
                <Outlet/>
            </main>
        </>
    )
}
