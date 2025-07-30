import Link from "next/link";
import React from "react";

interface FooterProps {
    theme: {
        background: string;
        text: {
            primary: string;
            secondary: string;
            muted: string;
        };
    };
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
    return (
        <footer className={`mt-16 py-6 border-t z-10 relative ${theme.text.secondary}`}>
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm">
                <p className={`${theme.text.muted}`}>
                    © {new Date().getFullYear()} Responsihub. All rights reserved.
                </p>
                <div className="flex gap-4 mt-2 sm:mt-0 items-center">
                    <span className={`${theme.text.muted}`}>
                        Developed by{" "}
                        <Link
                            href="https://www.xrodev.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${theme.text.muted}  font-bold`}
                        >
                            Rayan Hossain
                        </Link>
                    </span>
                    <Link href="/privacypolicy" className={`hover:underline ${theme.text.muted}`}>
                        Privacy Policy
                    </Link>
                    <Link href="/terms&condition" target="_blank" className={`hover:underline ${theme.text.muted}`}>
                        Terms & Conditions
                    </Link>
                    <Link href="https://www.xrodev.com/" className={`hover:underline ${theme.text.muted}`}>
                        contact
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
