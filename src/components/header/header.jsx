import Logo from "./logo/Logo";
import Nav from "./nav/nav";
import SearchBar from "./searchbar/SearchBar";
import { LuMenu } from "react-icons/lu";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="flex p-.2  w-full bg-white  border justify-between  items-center">
      <Logo />
      <div className={`${isMenuOpen?'opacity-100 visible duration-300' : 'opacity-0 invisible'} md:opacity-100  md:visible absolute h-full mt-40 md:relative md:mt-0`}>
        <Nav />
      </div>
     
      <div className="">
        <SearchBar />
      </div>
      <div className="text-2xl md:hidden">
        <button onClick={()=>setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <IoClose /> : <LuMenu />}
        </button>
      </div>
    </div>
  );
}
