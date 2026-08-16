import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy | FluxiBiz",
  description: "Learn how FluxiBiz collects, uses, and protects your personal and business data.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#161D30] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-[#00932A] to-[#FEB90D] w-full" />
        
        <div className="p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last Updated: August 4, 2026
          </p>

          <div className="prose prose-emerald max-w-none dark:prose-invert space-y-8 text-gray-600 dark:text-gray-300">
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="h-5 w-1.5 bg-[#00932A] rounded-full inline-block"></span>
                1. Introduction
              </h2>
              <p className="leading-relaxed">
                Welcome to FluxiBiz. We are committed to protecting your privacy and ensuring the security of your business and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our point of sale, inventory, and online storefront platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="h-5 w-1.5 bg-[#00932A] rounded-full inline-block"></span>
                2. Information We Collect
              </h2>
              <p className="leading-relaxed">
                To provide you with our all-in-one business management service, we may collect the following types of information:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Account Information:</strong> Personal details such as your name, email address, telephone number, and password when you register.</li>
                <li><strong>Business and Store Data:</strong> Details about your shop, including store name, address, inventory details, product catalogs, and transaction/order history.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="h-5 w-1.5 bg-[#00932A] rounded-full inline-block"></span>
                3. How We Use Your Information
              </h2>
              <p className="leading-relaxed">
                We use the collected information for various purposes to run and improve our services:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To initialize, operate, and maintain the FluxiBiz point of sale and storefront tools.</li>
                <li>To process orders, generate receipts, and manage inventory operations.</li>
                <li>To personalize and optimize your store experience.</li>
                <li>To send updates, security alerts, and technical support messages.</li>
                <li>To analyze platform usage trends and improve overall user experience.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="h-5 w-1.5 bg-[#00932A] rounded-full inline-block"></span>
                4. Data Security
              </h2>
              <p className="leading-relaxed">
                We implement robust security measures designed to protect your store information from unauthorized access, alteration, disclosure, or destruction. We use industry-standard encryption, secure server environments, and regular data monitoring. However, no internet transmission is 100% secure, so we encourage you to protect your credentials.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="h-5 w-1.5 bg-[#00932A] rounded-full inline-block"></span>
                5. Third-Party Services
              </h2>
              <p className="leading-relaxed">
                FluxiBiz does not sell or rent your business or personal data. We may only share information with trusted third-party service providers (such as hosting partners or payment processors) to the extent necessary to perform their services for us, under strict confidentiality agreements.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="h-5 w-1.5 bg-[#00932A] rounded-full inline-block"></span>
                6. Your Choices and Rights
              </h2>
              <p className="leading-relaxed">
                You have control over your data. Depending on your configuration, you can update your account and store information directly from your dashboard. If you wish to delete your account or retrieve a copy of your records, you may submit a request to our support team.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="h-5 w-1.5 bg-[#00932A] rounded-full inline-block"></span>
                7. Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions or concerns regarding this Privacy Policy, please feel free to reach out to us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-2 text-sm">
                <p><strong>Email:</strong> <a href="mailto:ipos.istad@gmail.com" className="text-[#00932A] dark:text-[#00B83A] hover:underline">ipos.istad@gmail.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+85515338826" className="text-[#00932A] dark:text-[#00B83A] hover:underline">+855 15 33 88 26</a></p>
                <p><strong>Address:</strong> #40, Street 273, Sangkat Boeung Kak Ti Mouy, Khan Toul Kork, Phnom Penh</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
