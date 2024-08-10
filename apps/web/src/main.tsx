import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './assets/fonts/AlexBrush-Regular.ttf';
import Calendar from './pages/calendar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const authToken = localStorage.getItem('auth');
if (authToken === null) {
  let idToken = window.location.hash;
  if (idToken && idToken.includes('id_token=')) {
    idToken = idToken.split('id_token=')[1];
    idToken = idToken.split('&')[0];
    localStorage.setItem('auth', idToken);
    window.history.pushState("", document.title, window.location.pathname
      + window.location.search);
  }
}

root.render(
  <StrictMode>
    <Calendar />
  </StrictMode>
);
