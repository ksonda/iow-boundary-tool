import axios from 'axios';

axios.defaults.baseURL = '/';
// Used to make authenticated HTTP requests to Django
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';
export const API = axios.create({
    headers: {
        credentials: 'same-origin',
    },
});
