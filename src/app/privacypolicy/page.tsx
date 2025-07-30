import React from "react";

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="bg-black">
            <div className="max-w-4xl mx-auto px-4 py-12 text-slate-700 dark:text-slate-300">
                <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-sm mb-8">Last updated: July 30, 2025</p>

                <p className="mb-6">
                    This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                </p>

                <p className="mb-6">
                    We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
                </p>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Interpretation and Definitions</h2>
                    <h3 className="text-xl font-medium mt-4 mb-2">Interpretation</h3>
                    <p className="mb-4">
                        The words of which the initial letter is capitalized have meanings defined under the following conditions. These definitions shall have the same meaning regardless of whether they appear in singular or plural.
                    </p>
                    <h3 className="text-xl font-medium mt-4 mb-2">Definitions</h3>
                    <p className="mb-2">For the purposes of this Privacy Policy:</p>
                    <ul className="list-disc ml-6 space-y-2">
                        <li><strong>Account</strong> means a unique account created for You to access our Service.</li>
                        <li><strong>Affiliate</strong> refers to an entity that controls, is controlled by, or is under common control with a party.</li>
                        <li><strong>Company</strong> refers to Responsihub ("We", "Us", "Our").</li>
                        <li><strong>Cookies</strong> are small files placed on Your device by a website, containing details of Your browsing history.</li>
                        <li><strong>Country</strong> refers to: Bangladesh</li>
                        <li><strong>Device</strong> means any device that can access the Service.</li>
                        <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
                        <li><strong>Service</strong> refers to the Website.</li>
                        <li><strong>Service Provider</strong> means third-party companies or individuals employed by the Company to assist in providing the Service.</li>
                        <li><strong>Usage Data</strong> refers to data collected automatically, like IP address, browser type, pages visited, etc.</li>
                        <li><strong>Website</strong> refers to Responsihub,
                            <a
                                href="https://www.responsihub.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline dark:text-blue-400"
                            >
                                https://www.responsihub.com/
                            </a>
                        </li>
                        <li><strong>You</strong> means the individual accessing the Service, or a company or legal entity they represent.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Collecting and Using Your Personal Data</h2>
                    <h3 className="text-xl font-medium mt-4 mb-2">Types of Data Collected</h3>
                    <h4 className="text-lg font-semibold mt-3 mb-1">Personal Data</h4>
                    <p className="mb-4">We may ask You to provide personally identifiable information such as your email or name.</p>

                    <h4 className="text-lg font-semibold mt-3 mb-1">Usage Data</h4>
                    <p className="mb-4">Usage Data is collected automatically and may include IP address, browser type, time spent on pages, etc.</p>

                    <h4 className="text-lg font-semibold mt-3 mb-1">Tracking Technologies and Cookies</h4>
                    <p className="mb-4">We use cookies and similar tracking technologies to monitor activity and store preferences.</p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Use of Your Personal Data</h2>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>To provide and maintain the Service</li>
                        <li>To manage Your Account</li>
                        <li>To perform contracts</li>
                        <li>To contact You</li>
                        <li>To provide You with offers and news</li>
                        <li>To manage Your requests</li>
                        <li>For business transfers</li>
                        <li>For analytics and improvements</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Retention, Transfer, and Deletion</h2>
                    <p className="mb-4">Your Personal Data is retained as long as necessary, may be transferred securely, and You may request its deletion.</p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Children’s Privacy</h2>
                    <p className="mb-4">We do not knowingly collect information from anyone under the age of 13. Contact us if you believe your child has provided us data.</p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Changes to This Privacy Policy</h2>
                    <p className="mb-4">We may update this Privacy Policy and notify You via email or a prominent notice. Please review this page periodically.</p>
                </section>

                <section className="mt-16 border-t pt-6 text-sm text-slate-500 dark:text-slate-400">
                    <p>
                        For any questions, contact us at:
                        <br />
                        <a
                            href="mailto:contact@xrodev.com"
                            className="text-blue-600 underline dark:text-blue-400"
                        >
                            contact@xrodev.com
                        </a>
                        <br />
                        <a
                            href="https://xrodev.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline dark:text-blue-400"
                        >
                            https://xrodev.com/
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
