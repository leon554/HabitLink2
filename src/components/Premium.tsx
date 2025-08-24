import { useContext, useRef, useState } from "react"
import { AuthContext } from "./Providers/AuthProvider"
import { supabase } from "@/supabase-client";
import { AiOutlineLoading } from "react-icons/ai";


export default function Premium() {
    const {products, localUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const loadingRef = useRef(-1)


    async function handleBuy(variantId: number, userId: string, email: string) {
        setLoading(true)

        const { data, error } = await supabase.functions.invoke("getCheckoutURL", {
            body: { variantId, userId, email },
        });

        if (error) {
            console.error("Failed to create checkout session", error.message);
            setLoading(false)
            return;
        }

        const parsedData = typeof data === "string" ? JSON.parse(data) : data;

        if (parsedData.checkoutUrl) {
            window.location.href = parsedData.checkoutUrl;
        } else {
            console.error("No checkout URL returned", parsedData);
        }

        setLoading(false)
    }


    return (
        <div className="shadow-md shadow-gray-200 dark:shadow-none bg-panel1 rounded-2xl outline-1 outline-border w-[90%] max-w-[600px] px-7 py-4">
            <p className="text-lg font-medium text-title">
                Premium
            </p>
            {products.length == 0 || !localUser? 
                <p className="text-subtext2 text-xs animate-pulse mt-5 mb-5">
                    Fetching Products...
                </p>
                :
                <div>
                    <div className="flex w-full justify-between gap-5 mt-5 mb-5">
                        {products.map((p, i) => (
                            <div
                            className="shadow-sm shadow-gray-200 dark:shadow-none outline-1 outline-border2 rounded-2xl flex-1 p-5 pt-4 flex flex-col gap-4"
                            key={i}
                            >
                            <p className="text-title font-medium">{p.product.attributes.name}</p>
                            <p className="text-xs text-subtext2">
                                {p.product.attributes.description.slice(3, p.product.attributes.description.length - 4)}
                            </p>
                            <p className="text-title font-medium">{p.product.attributes.price_formatted}</p>
                            <button
                                className="bg-btn text-btn-text text-sm font-medium h-8 rounded-lg hover:cursor-pointer flex items-center justify-center"
                                onClick={async () => {
                                    loadingRef.current = i
                                    await handleBuy(Number(p.variants[0].id), localUser.user_id, localUser.email)
                                }}
                            >
                                {loading && loadingRef.current == i ? <AiOutlineLoading className="animate-spin"/> : "Buy Now"}
                            </button>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-subtext3 mb-2">
                        Note: Some features in this app rely on AI, and running those features comes with real costs. To keep the app sustainable, tokens are only required when using AI-powered tools, while all the standard features are free.
                    </p>
                </div>
            }
        </div>
    )
}
