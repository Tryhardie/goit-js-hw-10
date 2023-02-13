import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(event => {
    const trimmedInput = refs.input.value.trim();
    clearPage();
    if (trimmedInput !== '') {
      fetchCountries(trimmedInput).then(fetchedData => {
        if (fetchedData.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (fetchedData.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name.');
        } else if (fetchedData.length >= 2 && fetchedData.length <= 10) {
          renderCountries(fetchedData);
        } else if (fetchedData.length === 1) {
          renderCountry(fetchedData);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

function renderCountries(countries) {
  const countriesMarkup = countries
    .map(country => {
      const { name, flags } = country;
      return `<li style="display:flex; align-items: center; margin: 10px 0">
      <img src="${flags.svg}" 
      alt="Flag of ${name.official}" width="100" height="50">
        <p style="margin: 0 0 0 10px"><b>${name.official}</b></p>
        </li>`;
    })
    .join('');
  refs.countryList.innerHTML = countriesMarkup;
}

function renderCountry(countries) {
  const countryMarkup = countries
    .map(country => {
      const { name, flags, capital, population, languages } = country;
      return `<li>
      <img src="${flags.svg}" 
      alt="Flag of ${name.official}" width="150" height="75">
        <p><b>${name.official}</b></p>
        <p><b>Capital</b>: ${capital}</p>
        <p><b>Population</b>: ${population}</p>
        <p><b>Languages</b>: ${Object.values(languages).join(', ')}</p>
        </li>`;
    })
    .join('');
  refs.countryList.innerHTML = countryMarkup;
}

function clearPage() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
