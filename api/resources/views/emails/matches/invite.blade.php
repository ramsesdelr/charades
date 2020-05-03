<div>
    <h2>You have been invite to join a Charades match!</h2>
    <p>Click the following link to join the match</p>
    <a href="{{ Request::root() }}/match/join/{{ base64_encode($match->id)}}/{{ base64_encode($match->email) }}"><h4>Join Match</h4></a>
</div>