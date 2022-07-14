import React from 'react';
import okIcon from '../images/ok.svg';
import errIcon from '../images/err.svg';

function InfoTooltip(props) {
    return (
        <div className={`popup ${props.isOpen ? "popup_opened" : ""}`}>
            <div className="popup__container">
                <button
                    aria-label="Закрыть окно"
                    className="popup__close-btn"
                    type="button"
                    onClick={props.onClose}
                />
                <form className="popup__form" name={props.name}>
                    <img
                        className="infotooltip__logo"
                        src={props.isSuccess ? okIcon : errIcon}
                    />
                    <h2 className="infotooltip__message">{props.isSuccess
                        ? 'Вы успешно зарегистрировались!'
                        : 'Что-то пошло не так! Попробуйте ещё раз.'}</h2>
                </form>
            </div>
        </div>
    );
};

export default InfoTooltip;