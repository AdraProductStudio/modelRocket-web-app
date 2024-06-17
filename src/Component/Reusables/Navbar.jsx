import React from 'react'
import Logo from "../assets/modelrocket_ai_logo.png";

export const Navbar = () => {
  return (
        <nav className="navbar nav-height overflow-hidden">
            <div className="container">
                <a className="navbar-brand" href="/">
                    <img src={Logo} alt="Logo" className='navLogo ' />
                </a>
            </div>
        </nav>
  )
}
