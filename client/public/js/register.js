/* eslint-disable no-unused-vars */

// Checking the password
async function checkPass(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  let password = document.getElementById("pass").value;
  let confirm = document.getElementById("verify").value;
  let display_name = document.getElementById("display_name").value;
  let email = document.getElementById("email").value;
  let message = document.getElementById("output");
  let button = document.getElementById("register-button")

  if (password.length !== 0) {
    if (password === confirm) {
      try {
        const response = await checkUser(email, display_name);
        if (response.status === "exists") {
          message.textContent = "Email or username already exists";
          message.style.color = "#ff4d4d";
          button.setAttribute('type', 'button');
        } else if (response.status === "empty") {
          message.textContent = "Username or email cannot be empty";
          message.style.color = "#ff4d4d";
          button.setAttribute('type', 'button');
        } else {
          message.textContent = "";
          
          // Show an alert and redirect to login page after successful registration
          alert("Account created successfully!");
          window.location.href = "./login.html";
          
          // Submit the form
          event.target.submit(); 
        }
      } catch (error) {
        message.textContent = "Error: " + error.message;
        message.style.color = "#ff4d4d";
        button.setAttribute('type', 'button');
      }
    } else {
      message.textContent = "Passwords don't match";
      message.style.color = "#ff4d4d";
      button.setAttribute('type', 'button');
    }
  } else {
    message.textContent = "Password can't be empty";
    message.style.color = "#ff4d4d";
    button.setAttribute('type', 'button');
  }
}


// Check username and email
async function checkUser(email, displayName) {
  const data = { email, display_name: displayName };

  const response = await fetch('http://localhost:3000/pages/check-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  return result;
}

// Show/hide the password
function showPass(pass, icon){
  let password = document.getElementById(pass);
  let eye = document.getElementById(icon);

  if(password.type === "password"){
    password.type = "text"
    eye.name = "eye-off-outline"
  } else {
    password.type = "password"
    eye.name = "eye-outline"
  }
}

// Get the form element
const form = document.querySelector('form');

// Add an event listener to the submit event of the form element
form.addEventListener('submit', checkPass);