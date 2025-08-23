import { useEffect } from "react"


export default function Terms() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="mt-13 text-subtext3 font-sans min-h-screen py-12 px-6 flex justify-center w-full">
            <div className="mx-auto  max-w-[600px] w-[90%]">
                <h1 className="text-4xl font-bold mb-4 text-title">Terms & Conditions</h1>
                <p className="mb-6 text-xs py-0.5 bg-btn text-btn-text w-fit px-2 rounded-full">Last Updated: 14/08/2025</p>

                <p className="mb-4 text-sm">
                Welcome to HabitLink! By using our website and services, you agree to these Terms and Conditions. Please read them carefully.
                </p>

                <h2 className="text-lg font-semibold mt-6 mb-2 text-title">1. Services</h2>
                <p className="mb-4 text-sm">HabitLink provides a habit and goal tracking platform. All services are delivered electronically via our website.</p>

                <h2 className="text-lg font-semibold mt-6 mb-2 text-title">2. Eligibility</h2>
                <p className="mb-4 text-sm">You must be at least 18 years old and legally capable of entering into binding contracts to use our services.</p>

                <h2 className="text-lg font-semibold mt-6 mb-2 text-title">3. Account Registration</h2>
                <ul className="list-disc list-inside mb-4 text-sm">
                <li>You must create an account to access the service.</li>
                <li>Keep your login credentials secure. You are responsible for all activity under your account.</li>
                </ul>

                <h2 className="text-lg font-semibold mt-6 mb-2 text-title">4. Subscriptions and Payment</h2>
                <p className="mb-4 text-sm">
                Payments are processed via LemonSqueezy. Subscription plans, pricing, and billing intervals are clearly displayed on our website. You authorize LemonSqueezy to charge your chosen payment method.
                </p>

                <h2 className="text-lg font-semibold mt-6 mb-2 text-title">5. Termination</h2>
                <p className="mb-4 text-sm">We reserve the right to suspend or terminate your account for violations of these terms, illegal activity, or non-payment.</p>

                <h2 className="text-lg font-semibold mt-6 mb-2 text-title">6. Limitation of Liability</h2>
                <p className="mb-4 text-sm">Our service is provided “as is.” We are not liable for indirect, incidental, or consequential damages.</p>

                <h2 className="text-lg font-semibold mt-6 mb-2 text-title">7. Modifications</h2>
                <p className="mb-4 text-sm">We may update these terms at any time. Updated terms will be posted on the website, and continued use constitutes acceptance.</p>

                <h2 className="text-lg font-semibold mt-6 mb-2 text-title">8. Governing Law</h2>
                <p className="mb-4 text-sm">These terms are governed by the laws of Australia.</p>

                <button className="text-sm font-medium bg-btn text-btn-text py-2 px-6 rounded-xl hover:cursor-pointer"
                onClick={() => window.history.back()}>
                    Done
                </button>
            </div>
        </div>

    )
}
