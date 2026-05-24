/* =========================================================
   EXCEL YOU - ADMIN EDITOR JS
========================================================= */
/* =========================================================
   ELEMENTS
========================================================= */

const themeToggle =
document.getElementById(
    "themeToggle"
);

const mobileToggle =
document.getElementById(
    "mobileToggle"
);

const sidebar =
document.getElementById(
    "sidebar"
);

const siteLogo =
document.getElementById(
    "siteLogo"
);

const editor =
document.getElementById(
    "editor"
);

const articleTitle =
document.getElementById(
    "articleTitle"
);

/* =========================================================
   THEME SYSTEM
========================================================= */

function loadTheme(){

    const savedTheme =
    localStorage.getItem(
        "theme"
    );

    if(savedTheme === "dark"){

        document.body.classList.add(
            "dark-theme"
        );

        themeToggle.innerHTML =
        "☀️";

        siteLogo.src =
        "/assets/full-logo-white.png";

    }else{

        document.body.classList.remove(
            "dark-theme"
        );

        themeToggle.innerHTML =
        "🌙";

        siteLogo.src =
        "/assets/full-logo.png";
    }
}

/* =========================================================
   TOGGLE THEME
========================================================= */

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-theme"
        );

        const dark =
        document.body.classList.contains(
            "dark-theme"
        );

        if(dark){

            themeToggle.innerHTML =
            "☀️";

            siteLogo.src =
            "/assets/full-logo-white.png";

        }else{

            themeToggle.innerHTML =
            "🌙";

            siteLogo.src =
            "/assets/full-logo.png";
        }

        localStorage.setItem(
            "theme",
            dark ? "dark" : "light"
        );
    }
);

/* =========================================================
   MOBILE SIDEBAR
========================================================= */

mobileToggle.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "active"
        );
    }
);

/* =========================================================
   LOGOUT
========================================================= */

function logout(){

    const confirmLogout =
    confirm(
        "Logout from admin panel?"
    );

    if(!confirmLogout){
        return;
    }

    localStorage.clear();

    window.location.href =
    "/login.html";
}

/* =========================================================
   TOOLBAR FUNCTIONS
========================================================= */

function formatText(command, value = null){

    document.execCommand(
        command,
        false,
        value
    );

    editor.focus();
}

/* =========================================================
   TOOLBAR BUTTON EVENTS
========================================================= */

document.querySelectorAll(
    ".toolbar button"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const icon =
            button.innerText.trim();

            switch(icon){

                case "HTML":

                    toggleHTMLMode();

                    break;
            }
        }
    );
});

/* =========================================================
   HTML MODE
========================================================= */

let htmlMode = false;

function toggleHTMLMode(){

    if(!htmlMode){

        editor.innerText =
        editor.innerHTML;

        htmlMode = true;

    }else{

        editor.innerHTML =
        editor.innerText;

        htmlMode = false;
    }
}

/* =========================================================
   AUTO SAVE
========================================================= */

let saveTimer;

function autoSave(){

    clearTimeout(saveTimer);

    saveTimer = setTimeout(
        () => {

            console.log(
                "Draft auto-saved"
            );

        },
        2000
    );
}

editor.addEventListener(
    "input",
    autoSave
);

articleTitle.addEventListener(
    "input",
    autoSave
);

/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    (e) => {

        // CTRL + B

        if(
            e.ctrlKey &&
            e.key === "b"
        ){

            e.preventDefault();

            formatText("bold");
        }

        // CTRL + I

        if(
            e.ctrlKey &&
            e.key === "i"
        ){

            e.preventDefault();

            formatText("italic");
        }

        // CTRL + U

        if(
            e.ctrlKey &&
            e.key === "u"
        ){

            e.preventDefault();

            formatText("underline");
        }
    }
);

/* =========================================================
   INIT
========================================================= */

loadTheme();

console.log(
    "EXCEL YOU Editor Loaded"
);
