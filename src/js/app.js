import { interval, EMPTY } from 'rxjs';
import {
  take, catchError, map, switchMap,
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const conteiner = document.querySelector('.conteiner__wrapper');

const interval$ = interval(2000)
  .pipe(
    take(5),
    switchMap((event) => ajax.getJSON('https://rxjs-backend-hzuk.onrender.com/messages/unread')
      .pipe(
        map((v) => v.messages),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
      )),
  )
  .subscribe({
    next: (value) => {
      value.map((v) => {
        conteiner.insertAdjacentElement('afterbegin', getItem(v));
      });
    },
    error: (err) => console.log(err),
  });

function getItem(value) {
  const div = document.createElement('div');
  div.className = 'item';

  const email = document.createElement('span');
  email.className = 'item__email';
  email.textContent = value.from;

  const text = document.createElement('span');
  text.className = 'item__text';
  text.textContent = getCorrectText(value.subject);

  const date = document.createElement('span');
  date.className = 'item__date';
  date.textContent = getCorrectDate(value.received);

  div.appendChild(email);
  div.appendChild(text);
  div.appendChild(date);

  return div;
}

function getCorrectText(text) {
  const array = text.split('');

  if (array.length <= 15) return text;

  array.splice(15);
  array.push('...');
  const newText = array.join('');

  return newText;
}

function getCorrectDate(date) {
  const newDate = new Date(date);

  const min = newDate.getMinutes();
  const hourse = newDate.getHours();

  let mounth = newDate.getMonth();
  if (mounth <= 9) mounth = `0${mounth}`;

  let day = newDate.getDay();
  if (day <= 9) day = `0${day}`;

  const year = newDate.getFullYear();

  return `${hourse}:${min} ${day}:${mounth}:${year}`;
}
