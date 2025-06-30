
import { createContext, useState, useEffect, useLayoutEffect} from "react"

interface Theme{
    dark: boolean | null
    setDark: (dark: boolean) => void
}
const initialTheme: Theme = {
    dark: true,
    setDark: () => null
}

export const themeContext = createContext<Theme>(initialTheme)

interface Props {
  children: React.ReactNode;
}
export default function ThemeProvider(props: Props) {
    const [dark, setDark] = useState<boolean| null>(null)

    useLayoutEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        console.log("theme: " +  savedTheme)
        if (savedTheme === "dark") {
        setDark(true);
        document.documentElement.classList.add("dark");
        } else if(savedTheme === "light"){
        setDark(false);
        document.documentElement.classList.remove("dark");
        }else{
        setDark(true)
        }
    }, []);

    useEffect(() => {
        if(dark === null) return
        if (dark) {
        document.documentElement.style.backgroundColor = "#1f1f1f"; // Dark background
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark");
        } else {
        document.documentElement.style.backgroundColor = "#ffffff"; // Light background
        document.documentElement.classList.remove("dark")
        localStorage.setItem("theme", "light");
        }
        
    }, [dark]);

    return (
        <themeContext.Provider value={{
            dark,
            setDark
        }}>
            
            {props.children}
        </themeContext.Provider>
    )
}
