<template>
	<div class="container mb-5">
		<div class="card my-card-border w-75 mx-auto">
			<div>
				<div class="row mt-3">
					<div class="col">
						<button
							@click="tabControl=true"
							class="btn px-5"
							:class="{'btn-info': tabControl}">
							<span class="h3 text-white"
								  :class="{'font-weight-bold': tabControl, 'text-secondary': !tabControl}">
								Login
							</span>
						</button>
					</div>
					<div class="col">
						<button
							@click="tabControl=false"
							class="btn px-5"
							:class="{'btn-info': !tabControl}">
							<span class="h3 text-white"
								  :class="{'font-weight-bold': !tabControl, 'text-secondary': tabControl}">
								Signup
							</span>
						</button>
					</div>
				</div>

				<hr class="my-4">

				<div v-if="tabControl">
					<div class="row my-3">
						<div class="col-4 my-auto mx-auto">
							<h5 class="pt-2 text-right">Username:</h5>
						</div>
						<div class="col-8 my-auto mx-auto">
							<b-form-input
								class="w-75"
								v-model="loginDetails.username">
							</b-form-input>
						</div>
					</div>

					<div class="row my-3">
						<div class="col-4 my-auto mx-auto">
							<h5 class="pt-2 text-right">Password:</h5>
						</div>
						<div class="col-8 my-auto mx-auto">
							<b-form-input
								class="w-75"
								type="password"
								v-model="loginDetails.password">
							</b-form-input>
						</div>
					</div>

					<div class="row my-3">
						<div class="col-12 my-auto text-middle">
							<button
								@click="login"
								class="btn btn-warning text-white px-5">
								Login
							</button>
						</div>

					</div>
				</div>

				<div v-if="!tabControl">

					<div class="row my-3">
						<div class="col-4 my-auto mx-auto">
							<h5 class="pt-2 text-right">Name:</h5>
						</div>
						<div class="col-8 my-auto mx-auto">
							<b-form-input
								class="w-75"
								type="text"
								v-model="signupDetails.name">
							</b-form-input>
						</div>
					</div>

					<div class="row my-3">
						<div class="col-4 my-auto mx-auto">
							<h5 class="pt-2 text-right">Address:</h5>
						</div>
						<div class="col-8 my-auto mx-auto">
							<b-form-input
								class="w-75"
								type="text"
								v-model="signupDetails.address">
							</b-form-input>
						</div>
					</div>

					<div class="row my-3">
						<div class="col-4 my-auto mx-auto">
							<h5 class="pt-2 text-right">Contact:</h5>
						</div>
						<div class="col-8 my-auto mx-auto">
							<b-form-input
								class="w-75"
								type="text"
								v-model="signupDetails.contact">
							</b-form-input>
						</div>
					</div>

					<div class="row my-3">
						<div class="col-4 my-auto mx-auto">
							<h5 class="pt-2 text-right">Bank:</h5>
						</div>
						<div class="col-8 my-auto mx-auto text-left">
							<b-form-select
								class="w-75"
								type="text"
								v-model="signupDetails.bank"
								:options="banks">
							</b-form-select>
						</div>
					</div>


					<div class="row my-3">
						<div class="col-4 my-auto mx-auto">
							<h5 class="pt-2 text-right">Username:</h5>
						</div>
						<div class="col-8 my-auto mx-auto">
							<b-form-input
								class="w-75"
								type="text"
								v-model="signupDetails.username">
							</b-form-input>
						</div>
					</div>

					<div class="row my-3">
						<div class="col-4 my-auto mx-auto">
							<h5 class="pt-2 text-right">Password:</h5>
						</div>
						<div class="col-8 my-auto mx-auto">
							<b-form-input
								class="w-75"
								type="password"
								v-model="signupDetails.password">
							</b-form-input>
						</div>
					</div>

					<div class="row my-3">
						<div class="col-12 my-auto text-middle">
							<button
								@click="signup"
								class="btn text-white btn-warning px-5">
								Signup
							</button>
						</div>

					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

import {mapGetters} from 'vuex';
import {mapMutations} from 'vuex';
import {Toast} from "../store/Toast";

export default {
	name: "LoginSignup",
	data() {
		return {
			loginDetails: {
				username: '',
				password: ''
			},
			signupDetails: {
				name: '',
				address: '',
				contact: '',
				bank: '',
				username: '',
				password: '',
				bdtTokens: 0
			},
			tabControl: true,
			banks: [
				'BANK-001',
				'BANK-002'
			],
			loginError: false,
			signupError: false
		}
	},
	methods: {
		...mapMutations([
			'setSessionToken',
			'setLoggedIn',
			'setSessionDetails'
		]),
		clearLoginDetails() {
			this.loginDetails = {
				username: '',
				password: ''
			};
		},
		clearSignupDetails() {
			this.signupDetails = {
				name: '',
				address: '',
				contact: '',
				bank: '',
				username: '',
				password: '',
				bdtTokens: 0
			};
		},
		checkLoginInputs() {
			if (this.loginDetails.username === '' || this.loginDetails.password === '') {
				this.loginError = true;
				return false;
			}
			return true;
		},
		checkSignupInputs() {
			if (this.signupDetails.name === '' ||
				this.signupDetails.bank === '' ||
				this.signupDetails.address === '' ||
				this.signupDetails.contact === '' ||
				this.signupDetails.username === '' ||
				this.signupDetails.password === '') {
				this.signupError = true;
				return false;
			}
		},
		login() {

			if (!this.checkLoginInputs()) return false;

			let baseUrl = this.getServerBaseURL;

			axios.post(baseUrl + 'login', {
				userObject: this.loginDetails
			}).then(res => {

				this.setSessionToken(res.data.token);
				this.setSessionToken(res.data.user);
				this.clearLoginDetails();
				this.clearSignupDetails();

				Toast.fire({
					icon: 'success',
					title: 'Logged in successfully'
				});

				this.$router.push('/');

			}).catch(err => {

				console.log(err);

				Toast.fire({
					icon: 'error',
					title: 'Login unsuccessful'
				});

			})
		},
		signup() {

			if (!this.checkSignupInputs()) return false;

			let baseUrl = this.getServerBaseURL;

			axios.post(baseUrl + '/signup', {
				userObject: this.signupDetails
			}).then(res => {
				Toast.fire({
					icon: 'success',
					title: 'Signed up successfully'
				});

				this.loginDetails.username = this.signupDetails.username;
				this.loginDetails.password = this.signupDetails.password;
				this.login();

			}).catch(err => {

				console.log(err);

				Toast.fire({
					icon: 'error',
					title: 'Signup unsuccessful'
				})
			})
		}
	},
	computed: {
		...mapGetters([
			'getSessionToken',
			'getServerBaseURL'
		])
	},
	mounted() {
	}
}
</script>

<style scoped>

</style>
