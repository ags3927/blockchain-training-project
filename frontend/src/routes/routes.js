import Home from "../components/Home";
import LoginSignup from "../components/LoginSignup";

export const routes = [
	{
		path: '/', component: Home
	},
	{
		path: '/authenticate', component: LoginSignup
	}
]
