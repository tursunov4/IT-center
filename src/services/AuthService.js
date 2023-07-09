import fetch from 'auth/FetchInterceptor'

const AuthService = {}


AuthService.login = function (data) {
	return fetch({
		url: '/admin/login',
		method: 'post',
		data: data
	})
}
AuthService.login2 = function (data) {
	return fetch({
		url: '/assistant/login',
		method: 'post',
		data: data
	})
}






export default AuthService;