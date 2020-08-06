@component('mail::message')
# Your Password has changed.

You have requested a password reset, your new password is <b>{{$user_data['password']}}</b> <br>
Please log in and update your password to a safer one.

@component('mail::button', ['url' =>  Request::root() . '/login'])
Sign In
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
