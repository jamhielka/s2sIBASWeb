import axios from 'axios';
import { API } from "../../../http-common";
export default {
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: '',
    role: '',
    partner: ''
  },

  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, payload) {
      console.log(payload.data.adminLogin.name);
      state.status = "success";
      state.token = payload.data.token;
      state.user = payload.data.adminLogin.name;
      state.role = payload.urole;
      state.partner = payload.partner;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
    },
  },

  actions: {
    login({ commit }, user) {
      //const _username = 'heeyRnrF)LZ%y#6XS{SS'
      //const _password = 'RK]j6=,4uV<G_zY$p6Ns'
      //var config = {
      // auth: {
      //   username: _username,
      //    password: _password
      //}
      //};
      return new Promise((resolve, reject) => {
       commit('auth_request')
       //console.log(user);
        axios.post('http://161.49.61.43:8085/api/admin-login', user)
          .then(resp => {
            if (resp.data.status == false) {
              // alert("Invalid username/password")
              // return false
              reject("Invalid username/password");
            }
            // const token = resp.data.message
            // const user = resp.data.statusCode
            // const role = resp.data.urole
            console.log(resp.data);
            
            let response = resp.data;
           //console.log(resp.data.data.token);
        
        
            localStorage.setItem('token', resp.data.data.token);
            //localStorage.setItem('userName', resp.data.data.adminLogin.name);
            response.username = user.UserName;
            // axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', response)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },

    logout({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          commit('logout')
          localStorage.removeItem('token')
          // delete axios.defaults.headers.common['Authorization']
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    session({ commit }) {
      return new Promise((resolve, reject) => {
        // commit("auth_request");
        API.get("/session")
          .then((response) => {
            const data = response.data;

            if (!data.status) {
              commit("logout");
              window.location = "/";
            }
            console.log("session", data.status);
            resolve(response);
          })
          .catch((error) => {
            commit("auth_error");
            reject(error);
          });
      });
    },
  },

  getters: {
    isLoggedIn: state => !!state.token,
    token: state => state.token,
    authStatus: state => state.status,
 // userRole: state => state.role,
   // userRole: state => {
  //    return state.role;
  //  },
    getUsername: state => {
      return state.user
    },
    //getPartner: state => {
    //  return state.partner
   //}
  },
};
