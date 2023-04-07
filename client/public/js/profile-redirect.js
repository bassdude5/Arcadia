/* eslint-disable no-unused-vars */
function redirectToProfileOrLogin() {
  fetch('http://localhost:3000/account/check-login')
    .then((response) => {
      if (response.ok) {
        window.location.href = 'profile.html';
      } else {
        window.location.href = 'login.html';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      window.location.href = 'login.html';
    });
}
