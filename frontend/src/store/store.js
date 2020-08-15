import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		loggedIn: false,
		sessionDetails: {
			name: {
				firstName: '',
				lastName: ''
			},
			image: '',
			_id: '0',
			userType: ''
		},
		sessionToken: '',
		signupDetails: {
			username: '',
			password: '',
			type: ''
		},
		// serverBaseURL: 'http://localhost:3000/api/',
		serverBaseURL: 'https://protected-forest-95822.herokuapp.com/api/',
		amenities: [
			'Workspace',
			'Shampoo',
			'Wifi',
			'Air Conditioning',
			'Heat',
			'Iron',
			'Breakfast',
			'Carbon Monoxide Detector'
		],
	},
	getters: {
		getSessionToken: state => {
			return state.sessionToken;
		},
		getSignupDetails: state => {
			return state.signupDetails;
		},
		getServerBaseURL: state => {
			return state.serverBaseURL;
		},
		getAmenitiesArray: state => {
			return state.amenities;
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
		setSignupDetails: (state, signupDetails) => {
			state.signupDetails.username = signupDetails.username;
			state.signupDetails.password = signupDetails.password;
			state.signupDetails.type = signupDetails.type;
		},
		setAmenitiesArray: (state, amenities) => {
			state.amenities =  amenities;
		},
		setLoggedIn: state => {
			state.loggedIn = true;
		},
		resetLoggedIn: state => {
			state.loggedIn = false;
		},
		resetSessionDetails: (state) => {
			state.sessionDetails = {
				name: {

				},
				image: '',
				_id: '',
				userType: ''
			};
		},
		resetSessionToken: state => {
			state.sessionToken = '';
		},
		setSessionDetails: (state, sessionDetails) => {
			state.sessionDetails = sessionDetails;
		}
	}
});
