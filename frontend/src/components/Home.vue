<template>
	<div class="container mb-5">
		<section class="text-left">
			<div id="profile" class="card my-card-border mt-5 text-left">

				<div class="row">
					<div class="col-7 text-left">
						<h3 class="mt-4 pl-5 font-weight-bold">Profile</h3>
					</div>
					<div class="col-2 ml-auto text-right">
						<button
							@click="refresh"
							class="mt-4 btn btn-info">
							Refresh
						</button>
					</div>
					<div class="col-2 mr-auto text-right">
						<button
							@click="logout"
							class="mt-4 btn btn-danger">
							Logout
						</button>
					</div>
				</div>

				<hr class="my-3">

				<div class="row mb-4" v-if="getSessionDetails.bank !== 'CENTRAL-BANK'">
					<div class="col-12 col-lg-6 text-left">
						<h5 class="px-5 my-2">
							<span class="font-weight-bold">
								Name:
							</span>
							{{ getSessionDetails.name }}
						</h5>

					</div>
					<div class="col-12 col-lg-6 text-left">
						<h5 class="px-5 my-2">
							<span class="font-weight-bold">
								Address:
							</span>
							{{ getSessionDetails.address }}
						</h5>
					</div>
					<div class="col-12 col-lg-6 text-left">
						<h5 class="px-5 my-2">
							<span class="font-weight-bold">
								Contact:
							</span>
							{{ getSessionDetails.contact }}
						</h5>

					</div>
					<div class="col-12 col-lg-6 text-left">
						<h5 class="px-5 my-2">
							<span class="font-weight-bold">
								Balance:
							</span>
							{{ getSessionDetails.bdtTokens }}
						</h5>
					</div>
				</div>
				<div class="row mb-4" v-if="getSessionDetails.bank === 'CENTRAL-BANK'">
					<div class="col-12">
						<h5 class="px-5 my-2">
							<span class="font-weight-bold">
								Name:
							</span>
							CENTRAL BANK
						</h5>

					</div>

				</div>

			</div>

			<div id="settlements"
				 class="card my-card-border mt-5 text-left"
				 v-if="getSessionDetails.bank !== 'CENTRAL-BANK'">

				<div class="row">
					<div class="col text-left">
						<h3 class="mt-4 px-5 font-weight-bold">Settlements</h3>
					</div>
					<div class="col text-right">
						<button
							@click="fetchSettlements"
							class="mt-4 px-4 mr-5 btn btn-info">
							Refresh
						</button>
					</div>
				</div>

				<hr class="my-3">

				<div v-for="(settlement, index) in settlements"
					 class="card my-card-border m-3 text-left py-3 px-5">
					<div class="row">

						<div class="col-6 col-lg-3 text-left pt-2">
							<h4>
								<span class="font-weight-bold">
									{{
										settlement.payer === getSessionDetails.username ? 'Payee: ' : 'Payer: '
									}}
								</span>
								{{
									settlement.payer === getSessionDetails.username ? settlement.payee : settlement.payer
								}}
							</h4>

						</div>

						<div class="col-6 col-lg-4 text-left pt-2">
							<h4>
								<span class="font-weight-bold">Date Issued: </span>{{
									getFormattedDate(settlement.issueTimestamp)
								}}
							</h4>
						</div>

						<div class="col-6 col-lg-3 text-left pt-2">
							<h4>
								<span class="font-weight-bold">Value: </span>{{ settlement.value }}
							</h4>
						</div>

						<div class="col-6 col-lg-2 text-right"
							 v-if="!settlement.isApproved && getSessionDetails.username === settlement.payee">
							<button @click="approveSettlement(index)" class="btn btn-info">
								Approve
							</button>
						</div>

						<div class="col-6 col-lg-2 text-left text-warning"
							 v-if="settlement.isApproved && !settlement.isFinalized">
							<h4 class="pt-2">
								<span class="font-weight-bold">Approved</span>
							</h4>
						</div>

						<div class="col-6 col-lg-2 text-left text-success"
							 v-if="settlement.isApproved && settlement.isFinalized">
							<h4 class="pt-2">
								<span class="font-weight-bold">Finalized</span>
							</h4>
						</div>
					</div>
				</div>

			</div>

			<div id="admin-settlements"
				 v-if="getSessionDetails.bank === 'CENTRAL-BANK'"
				 class="card my-card-border mt-5 text-left">

				<div class="row">
					<div class="col text-left">
						<h3 class="mt-4 px-5 font-weight-bold">Settlements</h3>
					</div>
					<div class="col text-right">
						<button
							@click="fetchSettlements"
							class="mt-4 px-4 mr-5 btn btn-info">
							Refresh
						</button>
					</div>
				</div>

				<hr class="my-3">

				<div v-for="(settlement, index) in settlements"
					 class="card my-card-border m-3 text-left py-3 px-3">
					<div class="row">
						<div class="col-6 text-left pt-2">
							<h4>
								<span class="font-weight-bold">
									Payer:
								</span> {{ settlement.payer }}
							</h4>

						</div>
						<div class="col-6 text-left pt-2">
							<h4>
								<span class="font-weight-bold">
									Payee:
								</span> {{ settlement.payee }}
							</h4>

						</div>

						<div class="col-6 text-left pt-2">
							<h4>
								<span class="font-weight-bold">Date: </span>{{
									getFormattedDate(settlement.issueTimestamp)
								}}
							</h4>
						</div>

						<div class="col-6 text-left pt-2">
							<h4>
								<span class="font-weight-bold">Value: </span>{{ settlement.value }}
							</h4>
						</div>

						<div class="col-12"
							 v-if="settlement.isApproved && !settlement.isFinalized && getSessionDetails.bank === 'CENTRAL-BANK'">
							<button @click="finalizeSettlement(index)" class="btn btn-info w-25">
								Finalize
							</button>
						</div>

						<div class="col-12 ext-left text-success"
							 v-if="settlement.isApproved && settlement.isFinalized">
							<h4 class="pt-2">
								<span class="font-weight-bold">Finalized</span>
							</h4>
						</div>
					</div>
				</div>

			</div>

			<div id="transactions"
				 v-if="getSessionDetails.bank !== 'CENTRAL-BANK'"
				 class="card my-card-border mt-5 text-left">
				<div class="row">
					<div class="col text-left">
						<h3 class="mt-4 px-5 font-weight-bold">Cash Transactions</h3>
					</div>
					<div class="col text-right">
						<button
							@click="fetchTransactions"
							class="mt-4 px-4 mr-5 btn btn-info">
							Refresh
						</button>
					</div>
				</div>

				<hr class="my-3">

				<div v-for="transaction in transactions" class="card my-card-border m-3 text-left py-3 px-5">
					<div class="row">
						<div class="col-6 col-lg-3 text-left pt-2">
							<h4>
								<span class="font-weight-bold">
									Type:
								</span>
								{{ transaction.type }}
							</h4>
						</div>
						<div class="col-6 col-lg-4 text-left pt-2">
							<h4>
								<span class="font-weight-bold">
									Date:
								</span>
								{{ getFormattedDate(transaction.timestamp) }}
							</h4>
						</div>
						<div class="col-6 col-lg-3 text-left pt-2">
							<h4>
								<span class="font-weight-bold">
									Value:
								</span>
								{{ transaction.value }}
							</h4>
						</div>
					</div>
				</div>
			</div>

			<div id="issue-settlement"
				 v-if="getSessionDetails.bank !== 'CENTRAL-BANK'"
				 class="card my-card-border mt-5 text-left">

				<h3 class="mt-4 px-5 font-weight-bold">Issue New Settlement</h3>
				<hr class="my-3">

				<div class="row my-3">
					<div class="col-4 pt-2 ml-auto">
						<h4 class="pl-5 font-weight-bold">Payee:</h4>
					</div>
					<div class="col-8 text-left mr-auto">
						<b-form-select
							class="w-75"
							:class="{'border-danger':errorFlags.settlementPayee}"
							v-model="settlementDetails.payee"
							:options="getUsernames">
						</b-form-select>
					</div>
					<div class="col-4 pt-2 ml-auto">
						<h4 class="pl-5 font-weight-bold">Amount:</h4>
					</div>
					<div class="col-8 text-left mr-auto">
						<b-form-input
							class="w-75"
							type="number"
							:class="{'border-danger':errorFlags.settlementAmount}"
							v-model="settlementDetails.value">
						</b-form-input>
					</div>
					<div class="col-12 mx-auto">
						<button
							@click="issueSettlement"
							class="btn btn-success px-4 mr-5">
							Issue
						</button>
					</div>
				</div>
				<div class="row">
					<div class="col-12 text-left"
						 v-if="errorFlags.settlementPayee">
						<p class="pl-5 text-danger">
							You need to select a payee.
						</p>
					</div>
					<div class="col-12 text-left"
						 v-if="errorFlags.settlementAmount">
						<p class="pl-5 text-danger">
							You need to enter amount you wish to transfer.
						</p>
					</div>
				</div>
			</div>

			<div id="issue-transaction"
				 v-if="getSessionDetails.bank !== 'CENTRAL-BANK'"
				 class="card my-card-border mt-5 text-left">

				<h3 class="mt-4 px-5 font-weight-bold">Issue New Cash Transaction</h3>
				<hr class="my-3">

				<div class="row my-3">
					<div class="col-4 pt-2 ml-auto">
						<h4 class="pl-5 font-weight-bold">Type:</h4>
					</div>
					<div class="col-8 text-left mr-auto">
						<b-form-select
							class="w-75"
							:class="{'border-danger':errorFlags.transactionType}"
							v-model="transactionDetails.transactionType"
							:options="['deposit','withdraw']">
						</b-form-select>
					</div>
					<div class="col-4 pt-2 ml-auto">
						<h4 class="pl-5 font-weight-bold">Amount:</h4>
					</div>
					<div class="col-8 text-left mr-auto">
						<b-form-input
							class="w-75"
							type="number"
							:class="{'border-danger':errorFlags.transactionAmount}"
							v-model="transactionDetails.value">
						</b-form-input>
					</div>
					<div class="col-12 mx-auto">
						<button
							@click="issueTransaction"
							class="btn btn-success px-4 mr-5">
							Issue
						</button>
					</div>
				</div>
				<div class="row">
					<div class="col-12 text-left"
						 v-if="errorFlags.settlementPayee">
						<p class="pl-5 text-danger">
							You need to select a payee.
						</p>
					</div>
					<div class="col-12 text-left"
						 v-if="errorFlags.settlementAmount">
						<p class="pl-5 text-danger">
							You need to enter amount you wish to transfer.
						</p>
					</div>
				</div>
			</div>

		</section>
	</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

import {mapGetters} from 'vuex';
import {mapMutations} from 'vuex';
import {Toast} from "../store/Toast";

export default {
	name: "Home",
	data() {
		return {
			settlements: [],
			transactions: [],
			users: [],
			settlementDetails: {
				payee: '',
				value: 0
			},
			transactionDetails: {
				transactionType: '',
				value: 0
			},
			errorFlags: {
				settlementPayee: false,
				settlementAmount: false,
				transactionType: false,
				transactionAmount: false
			}
		}
	},
	computed: {
		...mapGetters([
			'getSessionToken',
			'getServerBaseURL',
			'getLoggedIn',
			'getSessionDetails'
		]),
		getUsernames() {
			let usernames = [];
			for (const user of this.users) {
				usernames.push(user.username);
			}
			return usernames;
		}
	},
	methods: {
		...mapMutations([
			'setSessionDetails',
			'resetSessionDetails',
			'resetSessionToken',
			'resetLoggedIn'
		]),
		logout() {
			let sessionToken = this.getSessionToken;
			let baseURL = this.getServerBaseURL;
			axios.post(baseURL + 'logout', {}, {
				headers: {
					'x-auth': sessionToken
				}
			}).then(res => {
				this.resetSessionToken();
				this.resetSessionDetails();
				this.resetLoggedIn();
				Toast.fire({
					icon: 'success',
					title: 'Logged out successfully'
				});
				this.$router.push('/authenticate');

			}).catch(err => {
				Toast.fire({
					icon: 'error',
					title: 'Logout unsuccessful'
				});
			})
		},
		refresh() {
			this.fetchSessionDetails();
			this.fetchUserList();
		},
		fetchSessionDetails() {
			let sessionToken = this.getSessionToken;
			let baseURL = this.getServerBaseURL;

			axios.post(baseURL + 'sessiondetails', {}, {
				headers: {
					'x-auth': sessionToken
				}
			}).then(res => {
				this.setSessionDetails(res.data.sessionDetails);
			}).catch(err => {
				console.log(err);
			})
		},
		issueSettlement() {
			if (this.settlementDetails.payee === '') {
				this.errorFlags.settlementPayee = true;
				return;
			}
			if (this.settlementDetails.value === 0) {
				this.errorFlags.settlementAmount = true;
				return;
			}

			let sessionToken = this.getSessionToken;
			let baseURL = this.getServerBaseURL;

			axios.post(baseURL + 'issuesettlement', {
				settlementObject: this.settlementDetails
			}, {
				headers: {
					'x-auth': sessionToken
				}
			}).then(res => {
				Toast.fire({
					icon: 'success',
					title: 'Settlement issued successfully'
				});
				this.errorFlags.settlementAmount = false;
				this.errorFlags.settlementPayee = false;
				this.fetchSettlements();
			}).catch(res => {
				Toast.fire({
					icon: 'error',
					title: 'Settlement issuing unsuccessful'
				});
			})
		},
		issueTransaction() {
			if (this.transactionDetails.transactionType === '') {
				this.errorFlags.transactionType = true;
				return;
			}
			if (this.transactionDetails.value === 0) {
				this.errorFlags.transactionAmount = true;
				return;
			}

			let sessionToken = this.getSessionToken;
			let baseURL = this.getServerBaseURL;

			axios.post(baseURL + 'cashtransaction', {
				transactionObject: this.transactionDetails
			}, {
				headers: {
					'x-auth': sessionToken
				}
			}).then(res => {
				Toast.fire({
					icon: 'success',
					title: 'Cash transaction issued successfully'
				});
				this.errorFlags.transactionAmount = false;
				this.errorFlags.transactionType = false;
				this.fetchSessionDetails();
				this.fetchTransactions();
			}).catch(res => {
				Toast.fire({
					icon: 'error',
					title: 'Cash transaction issuing unsuccessful'
				});
			})
		},
		approveSettlement(index) {
			let baseURL = this.getServerBaseURL;
			let sessionToken = this.getSessionToken;
			console.log(this.settlements[index]);
			axios.post(baseURL + 'approvesettlement', {
				settlementObject: {
					payer: this.settlements[index].payer,
					timestamp: this.settlements[index].issueTimestamp
				}
			}, {
				headers: {
					'x-auth': sessionToken
				}
			}).then(res => {
				Toast.fire({
					icon: 'success',
					title: 'Settlement approved successfully'
				});
				this.settlements[index].isApproved = true;
			}).catch(err => {
				console.log(err);
			});
		},
		finalizeSettlement(index) {
			let baseURL = this.getServerBaseURL;
			let sessionToken = this.getSessionToken;

			axios.post(baseURL + 'finalizesettlement', {
				settlementObject: {
					payer: this.settlements[index].payer,
					payee: this.settlements[index].payee,
					timestamp: this.settlements[index].issueTimestamp
				}
			}, {
				headers: {
					'x-auth': sessionToken
				}
			}).then(res => {
				Toast.fire({
					icon: 'success',
					title: 'Settlement finalized successfully'
				});
				this.fetchSessionDetails();
				this.settlements[index].isFinalized = true;
			}).catch(err => {
				console.log(err);
			});
		},
		getFormattedDate(date) {
			let newDate = moment(date);
			return newDate.format('YYYY-MM-DD');
		},
		fetchSettlements() {
			let baseURL = this.getServerBaseURL;
			let sessionToken = this.getSessionToken;

			axios.post(baseURL + 'viewallsettlements', {}, {
				headers: {
					'x-auth': sessionToken
				}
			}).then(res => {
				console.log(res.data.settlements);
				this.settlements = res.data.settlements;
			}).catch(err => {
				console.log(err);
			});
		},
		fetchTransactions() {
			let baseURL = this.getServerBaseURL;
			let sessionToken = this.getSessionToken;

			axios.post(baseURL + 'viewallcashtransactions', {}, {
				headers: {
					'x-auth': sessionToken
				}
			}).then(res => {
				console.log(this.transactions);
				console.log(res.data.cashTransactions);
				this.transactions = res.data.cashTransactions;
			}).catch(err => {
				console.log(err);
			});
		},
		fetchUserList() {
			let baseURL = this.getServerBaseURL;
			let sessionToken = this.getSessionToken;

			axios.post(baseURL + 'viewallusers', {}, {
				headers: {
					'x-auth': sessionToken
				}
			}).then(res => {
				let responseData = res.data.users;
				console.log(responseData);
				this.users = [];
				for (let i = 0; i < responseData.length; i++) {
					if (this.getSessionDetails.username !== responseData[i].username && responseData[i].bank !== 'CENTRAL-BANK') {
						this.users.push(responseData[i]);
					}
				}
			}).catch(err => {
				console.log(err);
			})
		}
	},
	mounted() {
		this.fetchUserList();
		this.fetchSettlements();
		if (!this.getLoggedIn) {
			this.$router.push('/authenticate');
		}
	}
}
</script>

<style scoped>

</style>
