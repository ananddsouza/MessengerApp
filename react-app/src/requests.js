import axios from 'axios';

// API root
const API_ROOT = process.env.REACT_APP_SERVER_URI

// base url
axios.defaults.baseURL = API_ROOT;

// export request 
export const fetchUsers = () => {
    return axios.get(`/users`)
    .then(res => res.data.data)
}