
window._ = require('lodash');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.baseURL = 'http://charades.test/api/';
let user = JSON.parse(localStorage.getItem('user'));

if(user && user.token) {
    axios.defaults.headers.common['Authorization'] = "bearer " + user.token;
}

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    
    if(error.response.status === 401) {
        return axios.post('/users/refresh_token')
        .then(response => {
            if (response.status === 200) {
                let new_token = {
                    user_data: user.user_data,
                    token: response.data.token
                };
                localStorage.setItem('user', JSON.stringify(new_token));
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;

                return response;
            } else {
                localStorage.removeItem('user');
            }
        })
    }
    if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
});

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} 

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo'

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     encrypted: true
// });
