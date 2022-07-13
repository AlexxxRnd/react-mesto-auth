import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import Header from './Header'
import Footer from './Footer'
import Main from './Main'
import Register from './Register'
import Login from './Login'
import EditProfilePopup from './EditProfilePopup'
import PopupAddCard from './PopupAddCard'
import PopupEditAvatar from './PopupEditAvatar'
import ImagePopup from './ImagePopup'
import ApiRequest from '../utils/Api.js'
import * as Auth from './Auth.js'
import { UserContext } from '../contexts/CurrentUserContext';


function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLogged, setIsLogged] = React.useState(false);
  const history = useHistory();

  React.useEffect(() => {
    Promise.all([ApiRequest.getUserInfo(), ApiRequest.getInitialCards()])
      .then(([userData, initialCards]) => {
        setCurrentUser(userData)
        setCards(initialCards)
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    if (!isLiked) {
      ApiRequest.likeCard(card._id).then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
        .catch((error) => {
          console.log(`Ошибка: ${error}`);
        });
    } else {
      ApiRequest.unlikeCard(card._id).then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
        .catch((error) => {
          console.log(`Ошибка: ${error}`);
        });
    }
  }

  function handleCardDelete(card) {
    ApiRequest.deleteCard(card._id).then(() => {
      setCards((cards) => cards.filter((c) => c._id !== card._id));
    })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  };

  function handleCardClick(card) {
    setSelectedCard(card);
  };

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
  }

  function handleRegister(email, password) {
    return Auth
      .register(email, password)
      .catch((err) => {
        console.log(err);
      });
  };

  function handleLogin(email, password) {
    return Auth
      .login(email, password)
      .then((data) => {
        setIsLogged(true);
        localStorage.setItem('jwt', data.token);
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
        setIsLogged(false);
      });
  };

  const handleTokenCheck = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return;
    }
    Auth
      .checkTokenValid(jwt)
      .then((data) => {
        setIsLogged(true);
        history.push('/');
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    handleTokenCheck();
  }, []);

  React.useEffect(() => {
    if (isLogged) {
      history.push('/');
    }
  }, [isLogged]);

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.link

  React.useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])

  function handleUpdateUser(name, about) {
    ApiRequest.setUserInfo(name, about)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  }

  function handleAddCard(data) {
    ApiRequest.addCard(data)
      .then((data) => {
        setCards([data, ...cards]);
        closeAllPopups()
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  }

  function handleUpdateAvatar(avatarLink) {
    ApiRequest.setUserAvatar(avatarLink)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  }

  return (
    <UserContext.Provider value={currentUser}>
      <div className="page">
        <Header />

        <Switch>
          <Route path="/sign-up">
            <Register
              onRegister={handleRegister}
            />
          </Route>

          <Route path="/sign-in">
            <Login
              onLogin={handleLogin}
            />
          </Route>

          <ProtectedRoute
            path="/"
            loggedIn={isLogged}
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onClose={closeAllPopups}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
        </Switch>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <PopupAddCard
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddCard={handleAddCard}
        />

        <PopupEditAvatar
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

      </div>
    </UserContext.Provider>
  );
};

export default App;