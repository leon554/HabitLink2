import { useEffect, useState } from "react";

export function useIsPwa() {
  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    const checkPwa = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      const iosStandalone = (window.navigator as any).standalone === true;
      setIsPwa(standalone || iosStandalone);
    };

    checkPwa();

    window.addEventListener("resize", checkPwa);
    return () => window.removeEventListener("resize", checkPwa);
  }, []);

  return isPwa;
}