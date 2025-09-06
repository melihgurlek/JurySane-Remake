import { Scale } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Scale className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-neutral-700">
              JurySane
            </span>
          </div>

          {/* Links */}
          <div className="flex space-x-4 text-xs text-neutral-600">
            <a
              href="/about"
              className="hover:text-neutral-900 transition-colors"
            >
              About
            </a>
            <a
              href="/privacy"
              className="hover:text-neutral-900 transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="hover:text-neutral-900 transition-colors"
            >
              Terms
            </a>
            <a
              href="https://github.com/melihgurlek/JurySane-Remake"
              className="hover:text-neutral-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} JurySane. Educational simulation only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
