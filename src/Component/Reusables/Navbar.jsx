import React from 'react'
import Logo from "../assets/modelrocket_ai_logo.jpg";

export const Navbar = () => {
  return (
        <nav className="navbar nav-height overflow-hidden">
            <div className="container">
                <a className="navbar-brand" href="/">
                    <img src={Logo} alt="Logo" className='navLogo img-fluid' />
                </a>
            </div>
        </nav>
  )
}