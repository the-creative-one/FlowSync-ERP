import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import PageSEO from "../seo/PageSEO";

function NotFound() {
  return (
    <>
      <PageSEO
        title="Page Not Found | FlowSync"
        description="The page you are looking for could not be found. Return to FlowSync and continue browsing."
        keywords="FlowSync, page not found, 404"
      />
      <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-2xl text-center animate-fade-in">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center">
              {/* Pulse Ring */}
              <div className="absolute h-20 w-20 rounded-full bg-red-300 opacity-40 animate-ping"></div>
              {/* Icon */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-100 shadow-lg">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>
          </div>
          {/* 404 */}
          <h1 className="text-7xl md:text-8xl font-extrabold text-[#0C2B4E] mb-4">
            404
          </h1>
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed mb-10">
            The page you're trying to access doesn't exist, may have been moved,
            or the URL might be incorrect.
          </p>
          {/* Button */}
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded bg-[#0C2B4E] px-8 py-4 text-white font-semibold hover:bg-[#16406d] transition-all duration-300 hover:-translate-y-1 hover:scale-101 shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}

export default NotFound;
