import Link from "next/link";

interface FooterProps {
  isDark: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDark }) => {
  return (
    <footer className={`relative mt-16 border-t ${isDark ? 'border-white/[0.05]' : 'border-black/[0.06]'}`}>
      {/* Gradient line accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-8
        flex flex-col sm:flex-row items-center justify-between gap-4 text-sm`}>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
          <span className={`font-display font-bold text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Responsihub
          </span>
          <span className={`hidden sm:block w-px h-4 ${isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'}`} />
          <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            Built by{' '}
            <Link
              href="https://www.linkedin.com/in/rayan2228/"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold transition-colors ${isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'}`}
            >
              Rayan Hossain
            </Link>
          </span>
          <span className={`w-px h-4 ${isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'}`} />
          <div className="flex items-center gap-3">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-xs transition-colors ${isDark ? 'text-slate-600 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
