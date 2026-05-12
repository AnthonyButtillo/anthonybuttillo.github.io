document.onload = onLoad();

function onLoad() {
    const token = getTokenCookie();
    document.getElementById("token_input").value = token;
}


function trySubmit(event) {
    const token = document.getElementById("token_input").value;
    setTokenCookie(token);
}