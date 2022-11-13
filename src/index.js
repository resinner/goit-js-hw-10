import './css/styles.css';
import fetchCountries from '../src/js/fetchCountries.js';
import Lodash from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', Lodash(onInputField, DEBOUNCE_DELAY));

function onInputField(e) {
  const countries = e.target.value.trim();

  if (countries === '') {
   countryInfo.innerHTML = '';
   countryList.innerHTML = '';
    return;
  }

  fetchCountries(countries)
    .then(renderCountriesInfo)
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function renderCountriesInfo(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
   countryList.innerHTML = '';
  }

  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<img src="${flags.svg}" alt="${name.official}" width="30px">
          <h1 class="official-name">${name.official}</h1>
          <p><b>Capital:</b> ${capital}</p>
          <p><b>Population:</b> ${population}</p>
          <p><b>Langueges:</b> ${Object.values(languages)}</p>`;
    })
    .join('');
 countryInfo.innerHTML = markup;

  if (countries.length > 1) {
   countryInfo.innerHTML = '';
  }

  renderCountriesList(countries);
}

function renderCountriesList(countries) {
  if (countries.length >= 2 && countries.length <= 10) {
    const markup = countries
      .map(({ name, flags }) => {
        return `<li class="country">
        <img class="flag" src="${flags.svg}" alt="${name.official}" width="30px">
        <p class="official-name"><b>${name.official}</b>
      </li>`;
      })
      .join('');
   countryList.innerHTML = markup;
  }

  if (countries.length === 1) {
   countryList.innerHTML = '';
  }
}