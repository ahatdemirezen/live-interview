import React from "react";

const Header = () => {
    return (
        <nav>
            <div className="responsive-nav">
                <div className="w-full sm:w-[720px] md:w-[960px] lg:w-[1124px] h-auto px-4 sm:px-6 py-2 sm:py-4 bg-[#353642] rounded-md flex justify-start items-center gap-2">
                    <h2 className="responsive-nav-heading text-white text-base sm:text-lg md:text-xl lg:text-2xl">Remote-tech Admin Page</h2>
                </div>
            </div>
        </nav>
    );
}

export default Header;
