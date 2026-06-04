
console.log("Login JS loaded");

// Show / Hide Password
function togglePassword() {
    let pass = document.getElementById("password");

    if (pass.type === "password") {
        pass.type = "text";
    } else {
        pass.type = "password";
    }
}

// Load saved email
window.onload = function () {
    let saved = localStorage.getItem("savedEmail");

    if (saved) {
        document.getElementById("email").value = saved;
        document.getElementById("remember").checked = true;
    }
};

// Login form submit
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    console.log("Login button clicked");

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let remember = document.getElementById("remember").checked;

    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");

    emailError.innerText = "";
    passwordError.innerText = "";

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        emailError.innerText = "Invalid email format";
        alert("Invalid email format");
        return;
    }

    if (password.length < 8) {
        passwordError.innerText = "Password must be at least 8 characters";
        alert("Password must be at least 8 characters");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        console.log("Backend response:", data);

        // If email is not registered OR password is wrong
        if (!response.ok) {
            passwordError.innerText = data.message || "Invalid email or password";
            alert(data.message || "Invalid email or password");
            return;
        }

        // Login success only if backend says OK
        if (remember) {
            localStorage.setItem("savedEmail", email);
        } else {
            localStorage.removeItem("savedEmail");
        }

        localStorage.setItem("loggedUser", JSON.stringify(data.user));

        alert("Login Successful 🎉");

        window.location.href = "../index.html";

    } catch (error) {
        console.log("Login error:", error);
        alert("Cannot connect to backend. Make sure npm start is running.");
    }
});