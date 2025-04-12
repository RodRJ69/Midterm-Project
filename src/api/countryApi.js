import axios from 'axios';

const API_URL = 'https://nationnode.vercel.app/api/countries';

export const fetchAllCountries = () => axios.get(API_URL);
export const fetchCountryByCode = (code) => axios.get(`${API_URL}/${code}`);
