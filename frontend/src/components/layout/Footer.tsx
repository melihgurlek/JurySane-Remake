import { Scale } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary-50 border-t border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and description */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Scale className="h-6 w-6 text-primary-600" />
            <div>
              <span className="text-lg font-semibold text-secondary-900">
                JurySane
              </span>
              <p className="text-sm text-secondary-600">
                AI-Powered Legal Trial Simulation
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex space-x-6 text-sm text-secondary-600">
            <a
              href="/about"
              className="hover:text-secondary-900 transition-colors"
            >
              About
            </a>
            <a
              href="/privacy"
              className="hover:text-secondary-900 transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="hover:text-secondary-900 transition-colors"
            >
              Terms
            </a>
            <a
              href="https://github.com/yourname/jurysane"
              className="hover:text-secondary-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-200">
          <p className="text-center text-sm text-secondary-500">
            © {new Date().getFullYear()} JurySane. All rights reserved.
            <br />
            <span className="text-xs">
              This is a simulation for educational purposes only. Not real legal advice.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
