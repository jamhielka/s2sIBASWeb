import axios from 'axios';

//const _username = 'heeyRnrF)LZ%y#6XS{SS'
//const _password = 'RK]j6=,4uV<G_zY$p6Ns'
export const API = axios.create({
  baseURL: `http://161.49.61.43:8085/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  //auth: {
   // username: _username,
  //  password: _password
 // }
});
export const API2 = axios.create({
  baseURL: `http://161.49.63.45:8087/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  //auth: {
   // username: _username,
  //  password: _password
 // }
});