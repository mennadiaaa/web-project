console.log("Register JS loaded");

document.getElementById("myForm").addEventListener("submit", async function (e) {
    e.preventDefault();

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

    if (!nameRegex.test(fname)) { alert("First name must be at least 3 letters"); return; }
    if (!nameRegex.test(lname)) { alert("Last name must be at least 3 letters"); return; }
    if (!emailRegex.test(email)) { alert("Enter a valid email"); return; }
    if (!phoneRegex.test(phone)) { alert("Phone number must be 10 to 15 digits"); return; }
    if (!passwordRegex.test(password)) { alert("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { alert("Passwords do not match"); return; }

    let fullName = fname + " " + lname;

    try {
        const response = await fetch("https://web-project-production-5d78.up.railway.app/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: fullName, email: email, password: password })
        });

        const data = await response.json();
        if (!response.ok) { alert(data.message); return; }

        alert("Account created successfully ✅");
        window.location.href = "login.html";

    } catch (error) {
        alert("Cannot connect to backend. Make sure npm start is running.");
        console.log(error);
    }
});
