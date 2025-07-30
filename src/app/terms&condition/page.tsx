const TermsPage: React.FC = () => {
    return (
        <div className="bg-black">
            <div className="max-w-4xl mx-auto px-4 py-12 text-slate-700 dark:text-slate-300 ">
                <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
                <p className="text-sm mb-8">Last updated: July 30, 2025</p>

                <p className="mb-6">
                    Please read these terms and conditions carefully before using Our
                    Service.
                </p>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Interpretation and Definitions</h2>
                    <h3 className="text-xl font-medium mt-4 mb-2">Interpretation</h3>
                    <p className="mb-4">
                        The words of which the initial letter is capitalized have meanings
                        defined under the following conditions. The following definitions shall
                        have the same meaning regardless of whether they appear in singular or
                        in plural.
                    </p>
                    <h3 className="text-xl font-medium mt-4 mb-2">Definitions</h3>
                    <p className="mb-2">For the purposes of these Terms and Conditions:</p>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>
                            <strong>Affiliate</strong> means an entity that controls, is
                            controlled by or is under common control with a party, where
                            &quot;control&quot; means ownership of 50% or more of the shares, equity
                            interest or other securities entitled to vote for election of
                            directors or other managing authority.
                        </li>
                        <li>
                            <strong>Country</strong> refers to: Bangladesh
                        </li>
                        <li>
                            <strong>Company</strong> refers to Responsihub (&quot;We&quot;, &quot;Us&quot, or &quot;Our&quot;).
                        </li>
                        <li>
                            <strong>Device</strong> means any device that can access the Service
                            such as a computer, a cellphone or a digital tablet.
                        </li>
                        <li>
                            <strong>Service</strong> refers to the Website.
                        </li>
                        <li>
                            <strong>Terms and Conditions</strong> means this agreement between You
                            and the Company.
                        </li>
                        <li>
                            <strong>Third-party Social Media Service</strong> means any services
                            or content provided by a third party.
                        </li>
                        <li>
                            <strong>Website</strong> refers to Responsihub,
                            <a
                                href="https://www.responsihub.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline dark:text-blue-400"
                            >
                                https://www.responsihub.com/
                            </a>
                        </li>
                        <li>
                            <strong>You</strong> means the user or legal entity accessing the
                            Service.
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Acknowledgment</h2>
                    <p className="mb-4">
                        These are the Terms and Conditions governing the use of this Service
                        and the agreement between You and the Company. These Terms apply to all
                        users.
                    </p>
                    <p className="mb-4">
                        By using the Service, You agree to these Terms. If You disagree, do not
                        use the Service.
                    </p>
                    <p className="mb-4">
                        You represent that you are over the age of 18.
                    </p>
                </section>

                {/* Continue similarly for other sections like Links to Other Websites, Termination, Liability, etc. */}

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

export default TermsPage;
