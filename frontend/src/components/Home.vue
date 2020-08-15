<template>
	<div class="container mb-5">
		<section class="text-left">
			<div id="profile" class="card my-card-border mt-5 text-left">

				<div class="row">
					<div class="col text-left">
						<h3 class="mt-4 px-5 font-weight-bold">Profile</h3>
					</div>
					<div class="col text-right">
						<button class="mt-4 px-4 mr-5 btn btn-danger">
							Logout
						</button>
					</div>
				</div>

				<hr class="my-3">

				<div class="row mb-4">
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

			</div>

			<div id="settlements" class="card my-card-border mt-5 text-left">

				<h3 class="mt-4 px-5 font-weight-bold">Settlements</h3>
				<hr class="my-3">

				<div v-for="settlement in settlements"
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
								<span class="font-weight-bold">Date Issued: </span>{{ getFormattedDate(settlement.issueTimestamp) }}
							</h4>
						</div>

						<div class="col-6 col-lg-3 text-left pt-2">
							<h4>
								<span class="font-weight-bold">Value: </span>{{ settlement.value }}
							</h4>
						</div>

						<div class="col-6 col-lg-2 text-right" v-if="!settlement.isApproved">
							<button @click="approveSettlement" class="btn btn-info">
								Approve
							</button>
						</div>

						<div class="col-6 col-lg-2 text-right" v-if="settlement.isApproved && !settlement.isFinalized">
							<button @click="finalizeSettlement" class="btn btn-info">
								Finalize
							</button>
						</div>
					</div>
				</div>

			</div>

			<div id="transactions" class="card my-card-border mt-5 text-left">

				<h3 class="mt-4 px-5 font-weight-bold">Transactions</h3>
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

			<div id="issue-settlement" class="card my-card-border mt-5 text-left">

				<h3 class="mt-4 px-5 font-weight-bold">Issue New Settlement</h3>
				<hr class="my-3">

				<div class="row my-3">
					<div class="col-6 col-lg-2 pt-2 text-left">
						<h4 class="pl-5 font-weight-bold">Payee:</h4>
					</div>
					<div class="col-6 col-lg-2 text-left">
						<b-form-select
							:class="{'border-danger':errorFlags.settlementPayee}"
							v-model="settlementDetails.payee"
							:options="getUsernames">
						</b-form-select>
					</div>
					<div class="col-6 col-lg-2 pt-2 text-left">
						<h4 class="pl-5 font-weight-bold">Amount:</h4>
					</div>
					<div class="col-6 col-lg-2 text-left">
						<b-form-input
							:class="{'border-danger':errorFlags.settlementAmount}"
							v-model="settlementDetails.value">
						</b-form-input>
					</div>
					<div class="col-12 col-lg-4 text-right">
						<button class="btn btn-success px-4 mr-5">
							Issue
						</button>
					</div>
				</div>
				<div class="row" >
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

			<div id="transaction" class="card my-card-border mt-5 text-left">

				<h3 class="mt-4 px-5 font-weight-bold">Issue New Cash Transaction</h3>
				<hr class="my-3">

				<div class="row my-3">
					<div class="col-6 col-lg-2 pt-2 text-left">
						<h4 class="pl-5 font-weight-bold">Type:</h4>
					</div>
					<div class="col-6 col-lg-2 text-left">
						<b-form-select
							:class="{'border-danger':errorFlags.transactionType}"
							v-model="transactionDetails.type"
							:options="['deposit','withdraw']">
						</b-form-select>
					</div>
					<div class="col-6 col-lg-2 pt-2 text-left">
						<h4 class="pl-5 font-weight-bold">Amount:</h4>
					</div>
					<div class="col-6 col-lg-2 text-left">
						<b-form-input
							:class="{'border-danger':errorFlags.transactionAmount}"
							v-model="transactionDetails.value"
						></b-form-input>
					</div>
					<div class="col-12 col-lg-4 text-right">
						<button class="btn btn-success px-4 mr-5">
							Issue
						</button>
					</div>
				</div>
				<div class="row" >
					<div class="col-12 text-left"
						 v-if="errorFlags.transactionType">
						<p class="pl-5 text-danger">
							You need to select a transaction type.
						</p>
					</div>
					<div class="col-12 text-left"
						 v-if="errorFlags.transactionAmount">
						<p class="pl-5 text-danger">
							You need to enter amount you wish to deposit or withdraw.
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

export default {
	name: "Home",
	data() {
		return {
			settlements: [
				{
					payer: 'ags',
					payee: 'tasin',
					value: 1000,
					issueTimestamp: new Date(),
					approvalTimestamp: null,
					finalizationTimestamp: null,
					isApproved: false,
					isFinalized: false
				},
				{
					payee: 'ags',
					payer: 'tasin',
					value: 2000,
					issueTimestamp: new Date(),
					approvalTimestamp: null,
					finalizationTimestamp: null,
					isApproved: false,
					isFinalized: false
				},
			],
			transactions: [
				{
					transactor: 'ags',
					value: 100,
					timestamp: new Date(),
					type: 'deposit'
				}
			],
			users: [
				{
					name: 'Tasin Ishmam',
					username: 'tasin',
					bank: 'BANK-001'
				}
			],
			settlementDetails: {
				payee: '',
				value: 0
			},
			transactionDetails: {
				type: '',
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
				this.settlements = res.data.settlements;
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
				this.users = res.data.users;
			}).catch(err => {
				console.log(err);
			})
		}
	},
	mounted() {
		//this.fetchSettlements();
		if (!this.getLoggedIn) {
			this.$router.push('/authenticate');
		}
	}
}
</script>

<style scoped>

</style>
