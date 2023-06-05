async function generateHomeScreen() {
    // fetch("favorites.json")
    //     .then(response => response.json())
    //     .then(json => {
    //         json.forEach(element => {
    //             console.log(element);
    //             let item = makeGalleryDisplay(element);
    //             document.getElementById("main").appendChild(item);
    //         });

    //     });

    const db = firebase.firestore();

    db.collection("users").doc(user.toJSON().uid).get()
        .then((doc) => {
            if (doc.exists) {
                doc.data().favorites.forEach(element => {
                    let item = makeGalleryDisplay(element);
                    document.getElementById("main").appendChild(item);
                });
            }
        });

}

function displaySections() {
    const db = firebase.firestore();

    db.collection("users").doc(user.toJSON().uid).get()
        .then((doc) => {
            if (doc.exists) {
                doc.data().categories.forEach(element => {
                    const section = document.createElement("div");
                    section.id = element.id;
                    section.className = "section";

                    const title = document.createElement("h2");
                    title.innerHTML = element.name;
                    section.appendChild(title);

                    const remove = document.createElement("a");
                    remove.id = element.id;
                    remove.setAttribute("onclick", "removeSection(this.id)");
                    remove.innerHTML = "🗑";
                    title.appendChild(remove);

                    const extender = document.createElement("a");
                    extender.setAttribute("onclick", "reduce(this)");
                    extender.innerHTML = "▲";
                    title.appendChild(extender);


                    const content = document.createElement("div");
                    content.id = element.name;
                    content.className = "wrapper";
                    section.appendChild(content);

                    element.content.forEach(gallery => {
                        db.collection("users").doc(user.toJSON().uid).get()
                            .then((doc) => {
                                if (doc.exists) {
                                    doc.data().favorites.forEach(gElement => {
                                        if (gElement.id === gallery.id) {
                                            let item = makeGalleryDisplay(gElement);
                                            document.getElementById(element.name).appendChild(item);
                                        }
                                    });
                                }
                            });
                    });
                    document.getElementById("sections").appendChild(section);
                });
            }
        });
}

function hideSections() {
    document.getElementById("sections").replaceChildren();
}

function refreshSections() {
    hideSections();
    displaySections();
}

function makeGalleryDisplay(data) {
    let item = document.createElement("div");
    item.setAttribute("class", "items");
    item.id = data.id;
    if (data.read) {
        item.setAttribute("class", "items read");
    }
    if (data.award) {
        item.setAttribute("class", "items award")
    }
    //item.setAttribute("onclick", "href('https://nhentai.net/g/" + data.id + "')");
    //item.setAttribute("onmouseover", "onHover(this)");
    //item.setAttribute("onmouseout", "onHoverEnd(this)");

    let thumbnail = document.createElement("img");
    thumbnail.setAttribute("referrerpolicy", "no-referrer");
    thumbnail.src = "https://t3.nhentai.net/galleries/" + data.mediaid + "/thumb." + data.thumbformat;
    thumbnail.setAttribute("onclick", "href('https://nhentai.net/g/" + data.id + "')");
    thumbnail.setAttribute("class", "image");

    let title = document.createElement("span");
    title.innerHTML = data.name;

    let read = document.createElement("img");
    read.setAttribute("onclick", "markRead(this)");
    read.id = data.id;
    read.setAttribute("alt", "✔");

    let move = document.createElement("img");
    move.setAttribute("onclick", "moveGallery(this)");
    move.id = data.id;
    move.setAttribute("alt", "⇔");

    let award = document.createElement("img");
    award.setAttribute("onclick", "awardGallery(this)");
    award.id = data.id;
    award.setAttribute("alt", "★");

    item.appendChild(thumbnail);
    item.appendChild(title);
    item.appendChild(read);
    item.appendChild(move);
    item.appendChild(award);
    return item;
}

function markRead(element) {
    const db = firebase.firestore();

    db.collection("users").doc(user.toJSON().uid).get()
        .then((doc) => {
            if (doc.exists) {
                favorites = doc.data().favorites;
                favorites.find(el => el.id === element.id).read = true;
                db.collection("users").doc(user.toJSON().uid).set({
                    favorites: favorites
                }, { merge: true })
                    .then((docRef) => {
                        console.log("Updated user profile.");
                        refreshSections();
                    })
                    .catch((error) => {
                        console.error("Couldn't update profile, process ended with error: ", error);
                    })
            }
        });
}

function moveGallery(element) {
    var move = prompt("Move gallery to:\nLeave blank to remove from section.");
    if (move.includes("copy:")) {
        console.log("copy");
        return;
    }
    if (move === "") {
        console.log("remove");
        if (element.parentNode.parentNode.id != "main") {
            if (confirm("Are you sure?" + element.id)) {
                removeFromSection(element.id, element.parentNode.parentNode.id);
            }
        }
        return;
    }
    console.log("move");
    addToSection(element.id, move);
}

function awardGallery(element) {
    const db = firebase.firestore();

    db.collection("users").doc(user.toJSON().uid).get()
        .then((doc) => {
            if (doc.exists) {
                favorites = doc.data().favorites;
                favorites.find(el => el.id === element.id).award = true;
                db.collection("users").doc(user.toJSON().uid).set({
                    favorites: favorites
                }, { merge: true })
                    .then((docRef) => {
                        console.log("Updated user profile.");
                        refreshSections();
                    })
                    .catch((error) => {
                        console.error("Couldn't update profile, process ended with error: ", error);
                    })
            }
        });
}

function addToSection(id, name) {
    const db = firebase.firestore();

    db.collection("users").doc(user.toJSON().uid).get()
        .then((doc) => {
            if (doc.exists) {
                sections = doc.data().categories;
                sections.find(el => el.name === name).content.push({ "id": id });
                db.collection("users").doc(user.toJSON().uid).set({
                    categories: sections
                }, { merge: true })
                    .then((docRef) => {
                        console.log("Updated user profile.");
                        refreshSections();
                    })
                    .catch((error) => {
                        console.error("Couldn't update profile, process ended with error: ", error);
                    })
            }
        });
}

function removeFromSection(id, name) {
    const db = firebase.firestore();

    db.collection("users").doc(user.toJSON().uid).get()
        .then((doc) => {
            if (doc.exists) {
                sections = doc.data().categories;
                seccon = sections.find(el => el.name === name).content;
                console.log(seccon.find(con => con.id === id));
                index = seccon.indexOf(seccon.find(con => con.id === id));
                console.log(seccon);
                console.log(index);
                seccon = removeFromArr(seccon, index);
                console.log(seccon);
                db.collection("users").doc(user.toJSON().uid).set({
                    categories: sections
                }, { merge: true })
                    .then((docRef) => {
                        console.log("Updated user profile.");
                        refreshSections();
                    })
                    .catch((error) => {
                        console.error("Couldn't update profile, process ended with error: ", error);
                    })
            }
        });
}

function removeFromArr(arr, index) {
    return arr.splice(index, 1);
}

function newSection() {
    var name = prompt("Enter name:");
    const db = firebase.firestore();

    db.collection("users").doc(user.toJSON().uid).get()
        .then((doc) => {
            if (doc.exists) {
                sections = doc.data().categories;
                sections.push({ "id": sections.length, "name": name, "content": [] });
                db.collection("users").doc(user.toJSON().uid).set({
                    categories: sections
                }, { merge: true })
                    .then((docRef) => {
                        console.log("Updated user profile.");
                    })
                    .catch((error) => {
                        console.error("Couldn't update profile, process ended with error: ", error);
                    })
            }
        });
}

function removeSection(id) {
    if (!confirm("Are you sure?"))
        return;

    const db = firebase.firestore();

    db.collection("users").doc(user.toJSON().uid).get()
        .then((doc) => {
            if (doc.exists) {
                sections = doc.data().categories;
                sections.pop(sections.find(el => el.id === id));
                db.collection("users").doc(user.toJSON().uid).set({
                    categories: sections
                }, { merge: true })
                    .then((docRef) => {
                        console.log("Updated user profile.");
                    })
                    .catch((error) => {
                        console.error("Couldn't update profile, process ended with error: ", error);
                    })
            }
        });
}

function reduce(element) {
    element.parentNode.parentNode.getElementsByTagName("div")[0].style.display = "none";
    element.setAttribute("onclick", "extend(this)");
    element.innerHTML = "▼";
}

function extend(element) {
    element.parentNode.parentNode.getElementsByTagName("div")[0].style.display = "grid";
    element.setAttribute("onclick", "reduce(this)");
    element.innerHTML = "▲";
}

function reduceall() {
    elements = document.getElementsByClassName("wrapper");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
        let index = 0;
        if (elements[i].id != "main")
            index = 1;
        else
            index = 0;
        var a = elements[i].parentNode.getElementsByTagName("a")[index];
        a.setAttribute("onclick", "extend(this)");
        a.innerHTML = "▼";
    }
}

function extendall() {
    elements = document.getElementsByClassName("wrapper");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "grid";
        let index = 0;
        if (elements[i].id != "main")
            index = 1;
        else
            index = 0;
        var a = elements[i].parentNode.getElementsByTagName("a")[index];
        a.setAttribute("onclick", "reduce(this)");
        a.innerHTML = "▲";
    }
}

function href(web) {
    window.location.href = web;
}