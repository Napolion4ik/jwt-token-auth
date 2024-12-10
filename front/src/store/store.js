import {makeAutoObservable} from 'mobx';
import AuthService from '../services/AuthService';
import axios from 'axios';
import { API_URL } from '../http';


export default class Store {

    user = {} 
    isAuth = false;
    isLoading = false;

    constructor () {
        makeAutoObservable(this)
    }


    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser(user) {
        this.user = user;
    }
    setLoading(boolean) {
        this.isLoading = boolean;
    }


    async  login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setUser(response.data.user)
            this.setAuth(true);
        } catch (error) {
            console.log(error.response?.data?.message);
            
        }
    }

    async  registration(email, password) {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setUser(response.data.user)
            this.setAuth(true);
        } catch (error) {
            console.log(error.response?.data?.message);
            
        }
    }
    async  logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token', response.data.accessToken);
            this.setUser({})
            this.setAuth(false);
            
        } catch (error) {
            console.log(error.response?.data?.message);
            
        }
    }

    async chechAuth ( ) {
        this.setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/refresh`,{withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setUser(response.data.user)
            this.setAuth(true);
        } catch (error) {
            console.log(error.response?.data?.message);
        }
        finally {
            this.setLoading(false)
        }
    }
}