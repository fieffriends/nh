function displayUserInfo() {
    const cUser = firebase.auth().currentUser;
    if(user != null) {
        const main = document.getElementById("user-name-group");
        let displayName = document.getElementById("displayName");
        if(cUser.displayName != null)
            displayName.innerHTML = cUser.displayName;
        else
            displayName.innerHTML = "Add an username to your account →";
        let email = document.getElementById("email");
        email.innerHTML = cUser.email;
    }
    else {
        console.log("forrt")
    }
}

function initDisplayNameEdit() {
    document.getElementById("displayName").remove();
    document.getElementById("displayNameEdit").remove();

    var editfield = document.createElement("input");
    editfield.setAttribute("type", "text");
    editfield.id = "user-name-new";
    document.getElementById("user-name-group").appendChild(editfield);

    var editconfirm = document.createElement("span");
    editconfirm.setAttribute("class", "user-name-edit");
    editconfirm.setAttribute("onclick", "finishDisplayNameEdit()");
    editconfirm.id = "user-name-confirm";
    editconfirm.innerHTML = "&#10004;";
    document.getElementById("user-name-group").appendChild(editconfirm);
}

function finishDisplayNameEdit() {
    updateUserInfo(document.getElementById("user-name-new").value, null);
    setTimeout(function() {location.reload()}, 1500);
}

function initPasswordEdit() {
    document.getElementById("password-edit").remove();

    var editfield = document.createElement("input");
    editfield.setAttribute("type", "text");
    editfield.id = "user-password-new";
    document.getElementById("user-password-group").appendChild(editfield);

    var editconfirm = document.createElement("span");
    editconfirm.setAttribute("class", "user-name-edit");
    editconfirm.setAttribute("onclick", "finishPasswordEdit()");
    editconfirm.id = "user-name-confirm";
    editconfirm.innerHTML = "&#10004;";
    document.getElementById("user-password-group").appendChild(editconfirm);
}

function finishPasswordEdit() {
    try {
        changeUserPassword(document.getElementById("user-password-new").value);
    } catch (error) {
        alert("Error occured while changing password.")
        console.error(error);
        return;
    }
    document.cookie = "password=" + document.getElementById("user-password-new").value + "; expires=Wed, 1 Jan 2025 0:00:00 UTC; path=/";
    alert("Password has been changed.");
    setTimeout(function() {location.reload()}, 1500); 
}

function showDisplayName() {
    document.getElementById("user-name-new").remove;
    document.getElementById("user-name-confirm").remove;
    
    var displayName = document.createElement("span");
    
}