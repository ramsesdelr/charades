{{-- <div>
    <h2>You have been invite to join a Charades match!</h2>
    <p>Click the following link to join the match</p>
    <a href="{{ Request::root() }}/login/{{ base64_encode($match->id)}}"><h4>Join Match</h4></a>
</div> --}}

<meta data-rh="true" name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/>
<style>
    body {
        font-family: Roboto;
        color:#073b4c;
    }
</style>
<section style="text-align: center; max-width: 600px; margin:0 auto; border: 1px solid #CCC">  
    <header style="text-align: center;  ">
        <img src="https://ramsesdelr.com/temp/join-match.jpg" alt="join match" style="width:100%">
    </header>
    <div style="text-align: center;">
            <h1 style="font-size:2em; color:#073b4c; font-family: Roboto;">Wanna Play?</h1>
            <p style="color:#5d5b5b; margin-bottom: 50px; padding:0px 12px; line-height: 1.7; font-family: Roboto;">Hey there, looks like somebody wants to play some <b>Charades</b> with you. <br>Simply click the big blue button and start having fun!
            </p>
            <a href="https://charades.live/login/{{ base64_encode($match->id)}}" style="background: #073b4c; color: #FFF;padding: 10px 20px;font-size: 2em;text-decoration: none;border-radius: 6px; font-family: Roboto;">Join Match</a>
    </div>
    <div style="background-image: url('https://ramsesdelr.com/temp/logo-bg.png'); min-height: 184px; background-size: contain; margin-top: 2em;">
        <img alt="charades logo" src="https://ramsesdelr.com/temp/charades-logo.png" class="logo-bottom" style="margin-top: 70px;" height="50">
    </div>
</section>
