import React from 'react';
import { useHistory } from 'react-router-dom';

function Login({ onLogin, loggedIn }) {
    const history = useHistory();
    function handleSubmit(e) {
        e.preventDefault();
        onLogin({ email, password });
    }
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    function handleChangeEmail(e) {
        setEmail(e.target.value);
    }
    function handleChangePassword(e) {
        setPassword(e.target.value);
    }
    if (loggedIn) {
        history.push('/');
    }
    return (
        <main className="content">
            <form className="account__form">
                <h2 className="account__title">Вход</h2>
                <input
                    className="account__input"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required=""
                    value={email || ""}
                    onChange={handleChangeEmail}
                />
                <input
                    className="account__input"
                    name="password"
                    type="text"
                    placeholder="Пароль"
                    required=""
                    value={password || ""}
                    onChange={handleChangePassword}
                />
                <button
                    className="account__submit-btn"
                    type="button"
                    onClick={handleSubmit}
                >
                    Войти
                </button>
            </form>
        </main>
    );
};

export default Login;