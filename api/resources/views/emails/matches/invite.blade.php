<div>
    <h2>You have been invite to join a Charades match!</h2>
    <p>Click the following link to join the match</p>
    <a href="{{ Request::root() }}/login/{{ base64_encode($match->id)}}"><h4>Join Match</h4></a>
</div>