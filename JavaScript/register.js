console.log("JS loaded");
document.getElementById("myForm").addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted"); 

    
    let fname = document.getElementById("Fname").value.trim();
    let lname = document.getElementById("Lname").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let phone = document.getElementById("phone").value.trim();

   
    let nameRegex = /^[A-Za-z\s]{3,}$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let passwordRegex = /^.{8,}$/;
    let phoneRegex = /^[0-9]{10,15}$/;

    
    if (!nameRegex.test(fname)) {
        alert("First name must be at least 3 letters");
        return;
    }

    if (!nameRegex.test(lname)) {
        alert("Last name must be at least 3 letters");
        return;
    }

    if (!emailRegex.test(email)) {
        alert("Enter a valid email");
        return;
    }

    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    if (!phoneRegex.test(phone)) {
        alert("Phone number must be 10 to 15 digits");
        return;
    }

     alert("Form is valid ✅");

});