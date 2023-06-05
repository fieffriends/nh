function logUserIn() {
    document.cookie = "username=" + document.getElementById("name").value + "; expires=Wed, 1 Jan 2025 0:00:00 UTC; path=/";
    document.cookie = "password=" + document.getElementById("pass").value + "; expires=Wed, 1 Jan 2025 0:00:00 UTC; path=/";
    window.location.href = "/";
}