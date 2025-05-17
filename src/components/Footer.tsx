
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container mx-auto px-4 md:flex md:h-24 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Elite Builder AI. All rights reserved.
          </p>
        </div>
        <div className="flex items-center justify-center md:justify-end gap-4 mt-4 md:mt-0">
          <Link to="/terms" className="text-sm text-muted-foreground hover:underline">
            Terms
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
