var user;

function loginWithCookies(state = undefined) {
    var str = document.cookie.split(";");
    console.log(str);
    if (str != null)
        loginUser(str[0].substring(9, str[0].length), str[1].substring(10, str[1].length), state);
}

function loginUser(email, password, state = undefined) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            user = userCredential.user;

            console.log(user.toJSON().uid);
            updateProfileTag();
            switch (state) {
                case undefined:
                    break;
                case "home":
                    generateHomeScreen();
                    displaySections();
                    break;
                case "user":
                    displayUserInfo();
            }
            if (callback != undefined) {
                callback();
            }
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(errorCode);
        });
}

function registerUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
}

function signout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}

function updateUserInfo(displayName, photoURL) {
    user.updateProfile({
        displayName: displayName,
        photoURL: photoURL
    }).then(() => {
        // Update successful
        // ...
        console.log(displayName);
    }).catch((error) => {
        console.error("Couldn't update user. Finished with error: " + error);
    });
}

function changeUserEmail(email) {
    user.updateEmail(email).then(() => {
        // Update successful
        // ...
    }).catch((error) => {
        console.error("Couldn't update user email. Finished with error: " + error);
    });
}

function changeUserPassword(password) {
    user.updatePassword(password).then(() => {
        // Update successful.
    }).catch((error) => {
        console.error("Couldn't update user password. Finished with error: " + error);
    });
}

function createUserFavorites() {
    const db = firebase.firestore();

    console.log(db.collection("users").doc(user.toJSON().uid));

    fetch("favorites.json")
        .then(response => response.json())
        .then(json => {
            db.collection("users").doc(user.toJSON().uid).set({
                favorites: json
            }, { merge: true })
                .then((docRef) => {
                    console.log("Created user profile.");
                })
                .catch((error) => {
                    console.error("Couldn't create profile, process ended with error: ", error);
                })

        });
}

//Doesnt work as expected
function getFavorites() {
    const db = firebase.firestore();

    db.collection("users").doc(user.toJSON().uid).get()
    .then((doc) => {
        if (doc.exists) {
            let data = [];
            doc.data().favorites.forEach(element => {
                el = { "id": element.id, "mediaid": element.mediaid, "name": element.name, "thumbformat": element.thumbformat};
                data.push(el);
            });
            console.log(data);
        }
    });
    return data;
}

function updateUserFavorites(id) {
    const db = firebase.firestore();

    db.collection("users").doc(user.toJSON().uid).update({
        favorites: firebase.firestore.FieldValue.arrayUnion({ id: id })
    })
        .then(() => {
            console.log("Added to favorites.");
        })
}

function createUserCategories() {
    const db = firebase.firestore();

    console.log(db.collection("users").doc(user.toJSON().uid));

    fetch("categories.json")
        .then(response => response.json())
        .then(json => {
            db.collection("users").doc(user.toJSON().uid).set({
                categories: json
            }, { merge: true })
                .then((docRef) => {
                    console.log("Created user profile.");
                })
                .catch((error) => {
                    console.error("Couldn't create profile, process ended with error: ", error);
                })
        });
}



function getUserData() {
    console.log(user.toJSON());
    return user.toJSON();
}

function updateProfileTag() {
    var data = getUserData();
    document.getElementById("user-profile").setAttribute("href", "/user");
    if (data.displayName != null) {
        document.getElementById("user-name").innerHTML = data.displayName;
    }
    else {
        let email = data.email;
        let at = email.indexOf("@");
        email = email.substring(0, 1) + "***" + email.substring(at - 1);
        document.getElementById("user-name").innerHTML = email;
    }
}


