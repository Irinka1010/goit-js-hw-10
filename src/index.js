import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
function onSearch(ev) {
  refs.list.innerHTML = '';
  refs.div.innerHTML = '';
  const name = ev.target.value.trim();
  if (!name) {
    return;
  }
  fetchCountries(name)
    .then(countriesArray => {
      if (countriesArray.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (countriesArray.length > 1 && countriesArray.length < 10) {
        showCreateListItem(countriesArray);
        return;
      } else if (countriesArray.length === 1) {
        showCreateCountryInfom(countriesArray);
        return;
      } else {
        Notify.failure('Unknown error');
      }
    })
    .catch(er => {
      if (er.code === '404') {
        Notify.failure('Oops, there is no country with that name');

        return;
      } else {
        Notify.failure('Unknown error');
      }
    });
}
const showCreateListItem = countriesArray => {
  const result = genreateContentListItem(countriesArray);
  refs.list.insertAdjacentHTML('beforeend', result);
};
const showCreateCountryInfom = countriesArray => {
  refs.div.insertAdjacentHTML('beforeend', createCountryInfo(countriesArray));
};

const createListItem = item =>
  `<li class="country-item">${
    item.flags.png
      ? `<img src="${item.flags.png}"`
      : `<img src="${item.flags.svg}"`
  } alt ="Flag of ${item.name.official}"width=30px class = "country-flag"}>
  <p class="country-name-official">${item.name.official}</p></li>`;
const genreateContentListItem = countriesArray =>
  countriesArray.reduce((acc, item) => acc + createListItem(item), '');

function createCountryInfo(countriesArray) {
  const { name, flags, capital, population, languages } = countriesArray[0];
  const сountryCardMarkup = `<div class = "pic-wraper">
            ${flags.png ? `<img src="${flags.png}"` : `<img src="${flags.svg}"`}
                alt ="Flag of ${name.official}"
                class = "country-pic"}>
            <p class="country-name">${name.official}</p>
        </div>
            <p class="country-description">
                Capital:
                <span class = "span-text">${capital}</span>
            </p>
            <p class="country-description">
                Population:
                <span class = "span-text">${population}</span>
            </p>
            <p class="country-description">
                Languages:
                <span class = "span-text">${Object.values(languages)}</span>
            </p>`;
  return сountryCardMarkup;
}
