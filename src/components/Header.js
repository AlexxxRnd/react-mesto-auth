import React from 'react';
import { NavLink } from 'react-router-dom'; 
import logo from '../images/logo.svg';

function Header() {
    return (
        <header className="header">
            <img
                className="header__logo"
                src={logo}
                alt="логотип"
            />
            <NavLink to="/sign-in" className="header__login-btn">Войти</NavLink> 
        </header>
    );
}

export default Header;