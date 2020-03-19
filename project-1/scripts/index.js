const btnSignin = document.getElementById("signin");
const btnLogin = document.getElementById("login");
const body = document.getElementsByTagName("BODY")[0];
const storage = window.localStorage;
let nmrDataObjects;
let currentUserData = new Object();
let listsInfo = [ {date: "12/03/2020", title: "Shopping List", nmr: 5}, {date: "13/03/2020", title: "List of things I want to keep", nmr: 12}, {date: "13/03/2020", title: "List of things I want to keep", nmr: 12}, {date: "13/03/2020", title: "List of things I want to keep", nmr: 12}, {date: "13/03/2020", title: "List of things I want to keep", nmr: 12}, {date: "13/03/2020", title: "List of things I want to keep", nmr: 12}, {date: "13/03/2020", title: "List of things I want to keep", nmr: 12}, {date: "13/03/2020", title: "List of things I want to keep", nmr: 12}, {date: "13/03/2020", title: "List of things I want to keep", nmr: 12}, {date: "13/03/2020", title: "List of things I want to keep", nmr: 12}, {date: "13/03/2020", title: "List of things I want to keep", nmr: 12}, {date: "13/03/2020", title: "List of things I want to keep", nmr: 12} ];

const createPopUp = (width=450, height=550, backcolor="white") => {
    const mask = document.createElement("div");
    mask.className = "middle popup-mask";
    mask.id = "mask";
    body.appendChild(mask);

    const window = document.createElement("div");
    window.className = "middle";
    window.id = "popup";
    window.style.backgroundColor = backcolor;
    window.style.width = width + "px";
    window.style.height = height + "px";
    body.appendChild(window);
}

const leavePopUp = (e) => {
    if (e.target.classList.contains("popup-mask")) {
        body.removeChild(document.getElementById("mask"));
        body.removeChild(document.getElementById("popup"));
    }
}

const createTextInputBlock = (parent, text, type, placeholder, mandatory, classes) => {
    const label = document.createElement("label");
    label.innerHTML = mandatory ? text + "<span style='color: red;'>*</span>" : text;
    const input = document.createElement("input");
    input.type = type;
    input.name = type;
    if (placeholder)
        input.placeholder = placeholder;
    
    if (classes)
        input.className = classes;
        
    parent.appendChild(label);
    parent.appendChild(input);
}

const createSubmitButton = (parent, text, form, classes) => {
    const wrapper = document.createElement("div");
    const button = document.createElement("button");
    button.innerText = text;
    button.type = "submit";
    button.value = "submit";
    button.form = form;
    if (classes)
        button.className = classes;

    wrapper.appendChild(button);
    parent.appendChild(wrapper);
}

// FORMS DATA
let loginData;
let signinData;

// clicking out of the popup
document.addEventListener("click", leavePopUp);

// buttons click event
btnSignin.addEventListener("click", (e) => {
    createPopUp(450, 700);

    const container = document.createElement("div");
    container.style.position = "relative";
    container.id = "form-cont";

    const form = document.createElement("form");
    form.action = "#";
    form.id = "signinform";
    form.className = "middle form-container";

    const title = document.createElement("h3");
    title.className = "form-title";
    title.innerText = "Create an account!";

    const credentials = document.createElement("div");
    credentials.className = "credentials-wrapper";
    credentials.id = "credentials";

    createTextInputBlock(credentials, "First Name: ", "text", "your first name here...", true);
    createTextInputBlock(credentials, "Last Name: ", "text", "your last name here...", true);
    createTextInputBlock(credentials, "Email: ", "email", "example@example.com", true);
    createTextInputBlock(credentials, "Password: ", "password", "your password here...", true);

    const touWrapper = document.createElement("div");
    touWrapper.className = "tof-wrapper";
    touWrapper.style.paddingTop = "15px";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "tou";
    const touLabel = document.createElement("label");
    touLabel.className = "tou-label";
    touLabel.innerHTML = "I agree to the <a href='#'>Terms of Use</a>.";
    touWrapper.appendChild(checkbox);
    touWrapper.appendChild(touLabel);
    credentials.appendChild(touWrapper);
    
    createSubmitButton(credentials, "Sign in", "signinform", "btn-submit btn-signin button");

    form.appendChild(title);
    form.appendChild(credentials);

    container.appendChild(form);

    document.getElementById("popup").appendChild(container);
});

btnLogin.addEventListener("click", (e) => {
    createPopUp(450, 480);
    
    const container = document.createElement("div");
    container.style.position = "relative";
    container.id = "form-cont";

    const form = document.createElement("form");
    form.action = "#";
    form.id = "loginform";
    form.className = "middle form-container";

    const title = document.createElement("h3");
    title.className = "form-title";
    title.innerText = "Log in to your account!";


    const credentials = document.createElement("div");
    credentials.className = "credentials-wrapper";
    credentials.id = "credentials";

    createTextInputBlock(credentials, "Email: ", "email", "example@example.com", true);
    createTextInputBlock(credentials, "Password: ", "password", "your password here...", true);
    createSubmitButton(credentials, "Login", "loginform", "btn-submit btn-login button");

    form.appendChild(title);
    form.appendChild(credentials);

    container.appendChild(form);

    document.getElementById("popup").appendChild(container);
});

const container = document.getElementById("container");

const clearAfterIn = () => {
    // remove popup and mask
    body.removeChild(body.children[3]);
    body.removeChild(body.children[2]);

    // remove login and signin buttons
    container.removeChild(container.children[2]);
}

const createNavBar = (name = currentUserData.firstName) => {
    const wrapper = document.createElement("div");
    wrapper.id = "navbar-wrapper";

    const ul = document.createElement("ul");
    ul.id = "navbar";

    const li1 = document.createElement("li");
    const li2 = document.createElement("li");
    const li3 = document.createElement("li");

    li1.id = "greetings-msg";
    li1.innerText = "Hello, " + name + "!";
    li2.id = "nbar-settings";
    li2.innerText = "Settings";
    li3.id = "nbar-logout";
    li3.innerText = "Logout";

    container.appendChild(wrapper);

    wrapper.appendChild(ul);

    ul.appendChild(li1);
    ul.appendChild(document.createElement("div"));
    ul.appendChild(li2);
    ul.appendChild(document.createElement("div"));
    ul.appendChild(li3);
}

const setupPageLogedIn = () => {
    clearAfterIn();
    createNavBar();

    // add arrow in bottom
    var arrowWrapper = document.createElement("div");
    arrowWrapper.id="arrow-wrapper";

    var arrow = document.createElement("i");
    arrow.id = "homepage-arrow";
    arrow.className = "down";

    arrowWrapper.appendChild(arrow);
    body.appendChild(arrowWrapper);
}

const retreiveData = (e) => {
    let dataList, vals, dataObject, userData, params, storedUserInputs, filteredUserData, param, i;
    if (e.target.value === "submit") {
        e.preventDefault();
        const formElem = e.target.parentNode.parentNode.parentNode;
        switch (formElem.id.split("form")[0]) {
            case "signin":
                signinData = new FormData(document.getElementById("signinform"));
                dataList = new Array();
                if (signinData.has("tou")) {
                    for (vals of signinData) {
                        if (vals[1])
                            dataList.push(vals);
                    }
                    if (dataList.length === 5) {
                        let emailExists = false;
                        for (i = 0; i < nmrDataObjects; i++) {
                            userData = storage.getItem("user"+i);
                            params = userData.split(",");
                            //console.log("");
                            //console.log(params)
                            storedUserInputs = new Array();
                            for (param of params) {
                                filteredUserData = param.split(":");
                                storedUserInputs.push(removeExtraCharsFromJSONstringify(filteredUserData[1]));
                                
                            }

                            // if the email from the current input is the same as an email from storage
                            if (dataList[2][1] === storedUserInputs[2])
                                emailExists = true;
                        }
                        if (!emailExists) {
                            dataObject = {
                                firstName : dataList[0][1],
                                lastName : dataList[1][1],
                                email : dataList[2][1],
                                pass : dataList[3][1]
                            }
                            currentUserData.firstName = dataObject.firstName;
                            currentUserData.lastName = dataObject.lastName;
                            currentUserData.email = dataObject.email;
                            currentUserData.pass = dataObject.pass;
                            console.log(dataObject);
                            storage.setItem("user"+nmrDataObjects, JSON.stringify(dataObject));
                            storage.setItem("nmrDataObjects", ++nmrDataObjects);
                            
                            setupPageLogedIn();

                        }
                        else {
                            alert("There is already an account registered with that email!");
                        }
                    }
                    else {
                        alert("You have to fill in all mandatory fields marked with *!");
                    }
                }
                else {
                    alert("You need to agree to the Terms of Use!");
                }
                break;
            case "login":
                loginData = new FormData(document.getElementById("loginform"));
                dataList = new Array();
                for (vals of loginData) {
                    if (vals[1])
                        dataList.push(vals);
                }
                if (dataList.length === 2) {
                    dataObject = {
                        email : dataList[0][1],
                        pass : dataList[1][1]
                    }
                    let foundEmail = false;
                    let correctPass = false;
                    for (i = 0; i < nmrDataObjects; i++) {
                        userData = storage.getItem("user"+i);
                        params = userData.split(",");
                        //console.log("");
                        //console.log(params)
                        storedUserInputs = new Array();
                        for (param of params) {
                            filteredUserData = param.split(":");
                            storedUserInputs.push(removeExtraCharsFromJSONstringify(filteredUserData[1]));
                        }
                        //console.log(userInputs);
                        if (dataObject.email === storedUserInputs[2]) {
                            foundEmail = true;
                            if (dataObject.pass === storedUserInputs[3]) {
                                correctPass = true;
                                currentUserData.firstName = storedUserInputs[0];
                                currentUserData.lastName = storedUserInputs[1];
                                currentUserData.email = storedUserInputs[2];
                                currentUserData.pass = storedUserInputs[3];
                                //console.log("current user data");
                                //console.log(currentUserData);
                                
                                setupPageLogedIn();

                                return;
                            }
                        }
                    }
                    if (!foundEmail) {
                        alert("There is no account with that email!");
                    }
                    else if (!correctPass) {
                        alert("Wrong password!");
                    }
                    
                }
                else {
                    alert("You have to fill in all mandatory fields marked with *!");
                }
                break;
        }
    }
}

function removeExtraCharsFromJSONstringify(s) {
    if (s) {
        let newString = "";
        for (let i = 0; i < s.length; i++) {
            const c = s.charAt(i);
            if (c !== "\"" && c !== "{" && c !== "}")
                newString += c;
        }
        return newString;
    }
    return s;
}

document.getElementById("buttons-wrapper").addEventListener("click", (e) => {
    if (e.target.classList.contains("button")) {
        const formContainer = document.getElementById("form-cont"); 
        formContainer.addEventListener("click", retreiveData);
    }
});

const setup = () => {
    if (!storage.getItem("nmrDataObjects")) {
        storage.setItem("nmrDataObjects", "0");
    }
    nmrDataObjects = parseInt(storage.getItem("nmrDataObjects"));
}

const createListContainer = (date, title, nmrItems) => {
    const wrapper = document.createElement("div");
    wrapper.className = "list-container-wrapper";

    const listContainer = document.createElement("ul");
    listContainer.className = "list-container";

    const l1 = document.createElement("li");
    l1.className = "list-date";
    l1.innerText = date;
    const l2 = document.createElement("li");
    l2.className = "list-title";
    l2.innerText = title;
    const l3 = document.createElement("li");
    l3.className = "list-nmr-items";
    l3.innerText = nmrItems;

    wrapper.appendChild(listContainer);
    listContainer.appendChild(l1);
    listContainer.appendChild(l2);
    listContainer.appendChild(l3);

    return wrapper;
}

let dashboardActive = false;

const setupDashBoard = () => {
    const dashbContainer = document.createElement("div");
    dashbContainer.id = "dashb-container";
    body.appendChild(dashbContainer);

    // Navbar
    const navbWrapper = document.createElement("div");
    navbWrapper.id = "dashb-navbar-wrapper";
    const navbar = document.createElement("ul");
    navbar.id = "dashb-navbar";
    const l1 = document.createElement("li");
    l1.innerText = "Account Settings";
    const l2 = document.createElement("li");
    l2.innerText = "Logout";

    dashbContainer.appendChild(navbWrapper);
    navbWrapper.appendChild(navbar);
    navbar.appendChild(l1);
    navbar.appendChild(l2);

    // Lists
    for (let list of listsInfo) {
        dashbContainer.appendChild(createListContainer(list.date, list.title, list.nmr));
    }
}

const activateHomePageArrow = (e) => {
    if (e.target.id === "homepage-arrow") {
        setupDashBoard();
        window.scroll({
            top: 875,
            behavior: 'smooth'
        });
        setTimeout( () => { dashboardActive = true; }, 700);
    }
}

document.addEventListener("click", activateHomePageArrow);

window.onscroll= (e) => {
    if (dashboardActive) {
        console.log(document.documentElement.scrollTop);
        console.log(document.getElementById("dashb-navbar-wrapper").offsetTop);
        if (document.documentElement.scrollTop < document.getElementById("dashb-navbar-wrapper").offsetTop+5) {
            dashboardActive = false;
            window.scroll({
                top: 0,
                behavior: 'smooth'
            }); 
        }
    }
};