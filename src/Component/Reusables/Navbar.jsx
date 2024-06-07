import React from 'react'
import Logo from "../assets/modelrocket_ai_logo.jpg";

export const Navbar = () => {
  return (
        <nav className="navbar nav-height">
            <div className="container">
                <a className="navbar-brand" href="/">
                    <img src={Logo} alt="Logo" height={80} width={100} />
                </a>
            </div>
        </nav>
  )
}
