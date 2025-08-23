import { useEffect } from "react";

export default function Privacy() {
    useEffect(() => {
            window.scrollTo(0, 0);
    }, [])
    return (
        <div className="mt-13 text-subtext3 font-sans min-h-screen py-12 px-6 flex justify-center w-full">
        <div className="mx-auto max-w-[600px] w-[90%]">
            <h1 className="text-4xl font-bold mb-4 text-title">Privacy Policy</h1>
            <p className="mb-6 text-xs py-0.5 bg-btn text-btn-text w-fit px-2 rounded-full">Last Updated: 14/08/2025</p>

            <h2 className="text-lg font-semibold mt-6 mb-2 text-title">1. Information We Collect</h2>
            <ul className="list-disc list-inside mb-4 text-sm">
            <li>Account information (name, email, login credentials)</li>
            <li>Payment information via LemonSqueezy (handled securely by LemonSqueezy)</li>
            <li>Usage data to improve and provide the service</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2 text-title">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside mb-4 text-sm">
            <li>To provide and maintain the service</li>
            <li>To process payments and manage subscriptions</li>
            <li>To communicate important updates, notices, and support</li>
            <li>To store and manage data securely using <strong>Supabase</strong> as our backend service</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2 text-title">3. Data Sharing</h2>
            <p className="mb-4 text-sm">
            Your payment details are handled by LemonSqueezy. All other data is stored and processed securely with Supabase. We do not store sensitive payment information ourselves. We may share anonymized data for analytics and business purposes.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2 text-title">4. Data Security</h2>
            <p className="mb-4 text-sm">
            We implement reasonable security measures to protect your personal data. Supabase also ensures secure storage and access controls for your data.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2 text-title">5. Your Rights</h2>
            <ul className="list-disc list-inside mb-4 text-sm">
            <li>Access, correct, or delete your personal data by contacting <a  className="text-green-600 ">habitlinkapp@gmail.com</a></li>
            <li>You may opt-out of marketing communications at any time.</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2 text-title">6. Governing Law</h2>
            <p className="mb-4 text-sm">This Privacy Policy is governed by the laws of Australia.</p>

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
