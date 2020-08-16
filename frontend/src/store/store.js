import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		loggedIn: false,
		sessionDetails: {
			name: 'Aniruddha',
			username: 'ags',
			address: 'Kalabagan',
			contact: '+8801816394369',
			bank: 'BANK-001',
			bdtTokens: 1100
		},
		sessionToken: '',
		serverBaseURL: 'http://localhost:3001/api/',
	},
	getters: {
		getSessionToken: state => {
			return state.sessionToken;
		},
		getServerBaseURL: state => {
			return state.serverBaseURL;
		},
		getLoggedIn: state => {
			return state.loggedIn;
		},
		getSessionDetails: state => {
			return state.sessionDetails;
		}
	},
	mutations: {
		setSessionToken: (state, sessionToken) => {
			state.sessionToken = sessionToken;
		},
		resetSessionToken: state => {
			state.sessionToken = '';
		},
		setLoggedIn: state => {
			state.loggedIn = true;
		},
		resetLoggedIn: state => {
			state.loggedIn = false;
		},
		setSessionDetails: (state, sessionDetails) => {
			state.sessionDetails = sessionDetails;
		},
		resetSessionDetails: (state) => {
			state.sessionDetails = {
				name: '',
				username: '',
				address: '',
				contact: '',
				bank: '',
				bdtToken: '',
				_id: '0',
				userType: ''
			};
		}
	}
});
