import { Instagram, Linkedin, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer
      id="contact-us"
      className="relative overflow-hidden bg-gradient-to-b from-[#000a40] via-[#020617] to-black text-white pt-24 pb-16 w-full"
    >
      {/* Background Giant Text */}
      <h1 className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[18vw] font-extrabold tracking-tight text-blue-600/30 select-none pointer-events-none whitespace-nowrap">
        KJSSE-ACM
      </h1>

      {/* Main Content */}
      <div className="relative z-10 max-w-xl md:max-w-6xl mx-auto px-4">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src="logo_withoutbg.png" alt="Logo" className="h-24 md:h-40" />
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Contact Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 text-[#e6f2ff]">
              Contact Information
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <a
                  href="mailto:acm-kjsce@somaiya.edu"
                  className="hover:text-white transition"
                >
                  acm-kjsce@somaiya.edu
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>KJ Somaiya School of Engineering, B-413</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 text-[#e6f2ff]">
              Connect With Us
            </h2>
            <div className="flex gap-8">
              <a
                href="https://www.instagram.com/kjsse_acm/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                aria-label="Instagram"
              >
                <Instagram className="w-9 h-9 text-pink-500" />
              </a>
              <a
                href="https://in.linkedin.com/company/kjsce-acm-student-chapter"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-9 h-9 text-blue-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="relative z-10 border-t border-white/20 pt-8 text-center">
          <p className="text-base font-semibold text-[#e6f2ff] mb-1">
            Made with ❤️ by KJSSE-ACM
          </p>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} KJSSE-ACM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
