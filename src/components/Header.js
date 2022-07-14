import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../images/logo.svg';

function Header({ loggedIn, onSignOut, userEmail }) {
    const location = useLocation();
    return (
        <header className="header">
            <img
                className="header__logo"
                src={logo}
                alt="логотип"
            />
            {location.pathname === '/sign-in' && (
                <NavLink to="/sign-up" className="header__login-btn">
                    Регистрация
                </NavLink>
            )}
            {location.pathname === '/sign-up' && (
                <NavLink to="/sign-in" className="header__login-btn">
                    Войти
                </NavLink>
            )}
            {loggedIn && (
                <div className="header__user-email">
                    {userEmail}
                    <button
                        className="header__signout-btn"
                        onClick={onSignOut}>
                        Выйти
                    </button>
                </div>
            )}
        </header>
    );
}

export default Header;