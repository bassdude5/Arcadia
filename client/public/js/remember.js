/* eslint-disable no-unused-vars */
const emailInput = document.getElementById("email");
const rememberMeCheckbox = document.getElementById("remember-me");

// check if there is a cookie for the password and if so, set it as the value of the password input
function setcookie() {
    if(rememberMeCheckbox.checked === true){
        const email = emailInput.value;

        document.cookie="user="+email+";path=http://localhost:3001";
    }
}

function getCookieData() {
    console.log(document.cookie);
    const e = getCookie('user');

    emailInput.value = e;
}

function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while(c.charAt(0) === '') {
            c = c.substring(1);
        }
        if(c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}