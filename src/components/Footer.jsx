import { Mail, Phone, MapPin, Globe, Terminal, MessageCircle, Briefcase } from 'lucide-react';
import logo from '../assets/saylani-logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img className="h-10 w-auto" src={logo} alt="Saylani connect Logo" />
              <span className="font-bold text-xl tracking-tight text-white">Connect Portal</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-8">
              Saylani Mass IT Training (SMIT) is dedicated to providing free, high-quality technology education to the youth of Pakistan. Build your future today.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-slate-800 hover:bg-smit-blue rounded-lg transition-all" title="Social"><MessageCircle size={20} /></a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-smit-blue rounded-lg transition-all" title="Professional"><Briefcase size={20} /></a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-smit-blue rounded-lg transition-all" title="Website"><Globe size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8 text-smit-green">Popular Courses</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Web & Mobile Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Artificial Intelligence</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Graphic Designing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blockchain</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cloud Computing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8 text-smit-green">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Saylani</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Campuses</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Check Result</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8 text-smit-green">Contact Info</h4>
            <ul className="space-y-5 text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="text-smit-green shrink-0 mt-1" size={20} />
                <span>Head Office: A-25, Bahadurabad Chowrangi, Karachi</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-smit-green shrink-0" size={20} />
                <span>UAN: 111-729-5264</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-smit-green shrink-0" size={20} />
                <span>support@saylanimit.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Saylani Mass IT Training. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
