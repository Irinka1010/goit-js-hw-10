function fetchCountries(name) {
  const URL = 'https://restcountries.com/v3.1';
  const FILTER_RESPONSE = 'name,capital,population,flags,languages';

  return fetch(`${URL}/name/${name}?fields=${FILTER_RESPONSE}`).then(
    response => {
      if (!response.ok) {
        const er = new Error();
        er.code = response.status;
        throw er;
      }
      return response.json();
    }
  );
}
export { fetchCountries };
