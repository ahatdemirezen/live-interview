import React from "react";

const Header = () => {
  return (
    <nav>
      <div className="responsive-nav">
        <div className="w-full max-w-full h-auto px-4 sm:px-6 py-2 sm:py-4 bg-[#92C7CF] rounded-md flex justify-between items-center gap-2">
          <h2 className="responsive-nav-heading text-neutral-500 text-base sm:text-lg md:text-xl lg:text-2xl">
            Remote-tech Admin Page
          </h2>
          {/* Sağ tarafa doğru uzama için boş bir alan veya ekstra öğe ekleyebiliriz */}
          <div className="flex-grow"></div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
