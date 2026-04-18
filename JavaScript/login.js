

function togglePassword(){
    let pass = document.getElementById("password");

    if(pass.type === "password"){
        pass.type = "text";
    } else {
        pass.type = "password";
    }
}



function validateLogin(){

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let remember = document.getElementById("remember").checked;

    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");

    emailError.innerText = "";
    passwordError.innerText = "";

    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    let valid = true;

    
    if(!email.match(pattern)){
        emailError.innerText = "Invalid email format";
        valid = false;
    }

    
    if(password.length < 6){
        passwordError.innerText = "Password must be at least 6 characters";
        valid = false;
    }

    if(!valid){
        return false;
    }

  
    if(remember){
        localStorage.setItem("savedEmail", email);
    } else {
        localStorage.removeItem("savedEmail");
    }

    alert("Login Successful 🎉");

    
    window.location.href = "events.html";

    return false;
}


window.onload = function(){
    let saved = localStorage.getItem("savedEmail");

    if(saved){
        document.getElementById("email").value = saved;
        document.getElementById("remember").checked = true;
    }
}