import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-outline-variant/20 bg-surface-container-highest px-margin-mobile py-lg font-body-sm text-body-sm md:px-margin-desktop">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-md md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-col gap-xs">
          <span className="font-label-md text-label-md font-black text-on-surface">Lumina Commerce</span>
          <span className="text-on-secondary-fixed-variant">© 2026 Lumina Commerce. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap gap-md md:justify-end">
          <Link className="text-on-secondary-fixed-variant transition hover:text-primary" to="#">Privacy Policy</Link>
          <Link className="text-on-secondary-fixed-variant transition hover:text-primary" to="#">Terms of Service</Link>
          <Link className="text-on-secondary-fixed-variant transition hover:text-primary" to="#">Contact Us</Link>
          <Link className="text-on-secondary-fixed-variant transition hover:text-primary" to="#">Returns</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
