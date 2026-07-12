import React from "react";

export const HomeFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-left">
            <img
              src="/vocantara_logo.png"
              alt="Vocantara Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain flex-shrink-0"
            />
            <div>
              <p className="text-xl font-bold text-indigo-600 mt-2 md:mt-0">
                Vocantara
              </p>
              <p className="text-sm text-gray-500">
                Built by{" "}
                <span className="font-semibold text-gray-800">
                  Aira | Nadanta-dev
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 text-sm text-gray-600">
            <p>
              Support:{" "}
              <a
                href="mailto:aira.kusumadew@gmail.com"
                className="font-medium text-indigo-600 hover:underline"
              >
                nadanta.techdev@gmail.com
              </a>
            </p>
            <div className="flex items-center gap-1.5 text-gray-500">
              <span className="text-xs">Images from</span>
              <a
                href="https://www.freepik.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-medium text-gray-600 hover:underline"
              >
                <img
                  src="FREEPIK_logo.png"
                  alt="Freepik Logo"
                  className="h-4 object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Vocantara. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
