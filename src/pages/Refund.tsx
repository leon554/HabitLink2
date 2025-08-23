import { useEffect } from "react";

export default function Refund() {
    useEffect(() => {
            window.scrollTo(0, 0);
        }, [])
    return (
        <div className="mt-13 text-subtext3 font-sans min-h-screen py-12 px-6 flex justify-center w-full">
        <div className="mx-auto max-w-[600px] w-[90%]">
            <h1 className="text-4xl font-bold mb-4 text-title">Refund Policy</h1>
            <p className="mb-6 text-xs py-0.5 bg-btn text-btn-text w-fit px-2 rounded-full">Last Updated: 14/08/2025</p>

            <h2 className="text-lg font-semibold mt-6 mb-2 text-title">1. General Policy</h2>
            <p className="mb-4 text-sm">
            All payments for subscriptions and products are processed via LemonSqueezy. We aim to provide high-quality service; however, refunds are handled under the conditions below.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2 text-title">2. Refund Eligibility</h2>
            <ul className="list-disc list-inside mb-4 text-sm">
            <li>Refunds are available within 14 days of the initial purchase for first-time customers if the service has not been substantially used.</li>
            <li>Refunds for recurring subscriptions may be pro-rated based on usage at our discretion.</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2 text-title">3. How to Request a Refund</h2>
            <p className="mb-4 text-sm">
            Contact us at <a className="text-green-600 ">habitlinkapp@gmail.com</a> with your account information and reason for refund. LemonSqueezy will process eligible refunds according to their policies.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2 text-title">4. Exceptions</h2>
            <p className="mb-4 text-sm">
            No refunds are available after 14 days from purchase. Any abuse of the service or violation of Terms and Conditions may void refund eligibility.
            </p>

            <button
            className="text-sm font-medium bg-btn text-btn-text py-2 px-6 rounded-xl hover:cursor-pointer"
            onClick={() => window.history.back()}
            >
            Done
            </button>
        </div>
        </div>
    )
}
