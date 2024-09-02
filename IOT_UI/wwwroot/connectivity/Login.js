function Login() {
    const email = document.getElementById("txt_email").value;
    const password = document.getElementById("txt_password").value;

    var loginData = {
        email: email,
        password: password
    };

    var url = "User/Login";
    ajaxRequest('POST', url, loginData).then(function (response) {
        if (response.success)
        {
            successAlert(response.message);
            localStorage.setItem("JWTToken", response.data.token.token);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("role", response.data.role);
            window.location.href = "/Admin/Dashboard";
        } else {
            warningAlert(response.message);
        }
    }).catch(function (error) {
        warningAlert("An error occurred during login. Please try again.");
        console.error("Login error:", error);
    });
}

function signOut() {
    // Clear local storage
    localStorage.removeItem("JWTToken");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.trim().replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT");
    });

    // Redirect to login page
    window.location.href = "/Login/Index";
}
