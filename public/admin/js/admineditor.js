/* =========================================================
   EXCEL YOU - ADMIN EDITOR JS
========================================================= */
// =========================================================
// ELEMENTS
// =========================================================

const body =
document.body;

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

const saveStatus =
document.getElementById(
    "saveStatus"
);

// =========================================================
// THEME
// =========================================================

function applyTheme(theme){

    if(theme === "dark"){

        body.classList.add(
            "dark-theme"
        );

        themeToggle.innerHTML =
            "☀️";

        if(siteLogo){

            siteLogo.src =
            "/assets/full-logo-white.png";
        }

    } else {

        body.classList.remove(
            "dark-theme"
        );

        themeToggle.innerHTML =
            "🌙";

        if(siteLogo){

            siteLogo.src =
            "/assets/full-logo.png";
        }
    }
}

// Load saved theme

const savedTheme =
localStorage.getItem(
    "theme"
);

applyTheme(
    savedTheme || "light"
);

// Toggle theme

themeToggle.addEventListener(
    "click",
    () => {

        const isDark =
        body.classList.contains(
            "dark-theme"
        );

        const newTheme =
        isDark
        ? "light"
        : "dark";

        applyTheme(
            newTheme
        );

        localStorage.setItem(
            "theme",
            newTheme
        );
    }
);

// =========================================================
// MOBILE SIDEBAR
// =========================================================

mobileToggle.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "active"
        );
    }
);

// =========================================================
// CLOSE SIDEBAR MOBILE
// =========================================================

document.addEventListener(
    "click",
    (e) => {

        if(

            window.innerWidth <= 900 &&

            !sidebar.contains(
                e.target
            ) &&

            !mobileToggle.contains(
                e.target
            )

        ){

            sidebar.classList.remove(
                "active"
            );
        }
    }
);

// =========================================================
// EDITOR COMMANDS
// =========================================================

function formatText(command){

    document.execCommand(
        command,
        false,
        null
    );

    editor.focus();
}

// =========================================================
// INSERT LINK
// =========================================================

function insertLink(){

    const url =
    prompt(
        "Enter URL"
    );

    if(!url) return;

    document.execCommand(
        "createLink",
        false,
        url
    );
}

// =========================================================
// INSERT IMAGE
// =========================================================

function insertImage(){

    const url =
    prompt(
        "Enter image URL"
    );

    if(!url) return;

    document.execCommand(
        "insertImage",
        false,
        url
    );
}

// =========================================================
// INSERT VIDEO
// =========================================================

function insertVideo(){

    const url =
    prompt(
        "Paste YouTube embed URL"
    );

    if(!url) return;

    const iframe = `

        <div class="video-wrapper">

            <iframe
            width="100%"
            height="500"
            src="${url}"
            frameborder="0"
            allowfullscreen>
            </iframe>

        </div>

    `;

    editor.innerHTML += iframe;
}

// =========================================================
// HTML MODE
// =========================================================

let htmlMode = false;

function toggleHTMLMode(){

    if(!htmlMode){

        editor.textContent =
        editor.innerHTML;

        htmlMode = true;

        saveStatus.innerText =
        "HTML mode enabled";

    } else {

        editor.innerHTML =
        editor.textContent;

        htmlMode = false;

        saveStatus.innerText =
        "Visual mode enabled";
    }
}

// =========================================================
// AUTO SAVE DEMO
// =========================================================

let saveTimer;

function autoSave(){

    clearTimeout(
        saveTimer
    );

    saveStatus.innerText =
    "Saving...";

    saveTimer =
    setTimeout(() => {

        saveStatus.innerText =
        "Draft saved ✔";

    }, 1000);
}

// =========================================================
// EDITOR LISTENERS
// =========================================================

editor.addEventListener(
    "input",
    autoSave
);

articleTitle.addEventListener(
    "input",
    autoSave
);

// =========================================================
// LOGOUT
// =========================================================

function logout(){

    const confirmLogout =
    confirm(
        "Are you sure you want to logout?"
    );

    if(!confirmLogout){
        return;
    }

    // remove auth tokens if needed

    localStorage.removeItem(
        "adminToken"
    );

    sessionStorage.clear();

    // redirect

    window.location.href =
    "/login.html";
}

// =========================================================
// SHORTCUTS
// =========================================================

document.addEventListener(
    "keydown",
    (e) => {

        // CTRL + S

        if(
            e.ctrlKey &&
            e.key === "s"
        ){

            e.preventDefault();

            saveStatus.innerText =
            "Draft saved ✔";
        }

        // TAB support

        if(
            e.key === "Tab"
        ){

            document.execCommand(
                "insertHTML",
                false,
                "&nbsp;&nbsp;&nbsp;&nbsp;"
            );

            e.preventDefault();
        }
    }
);

// =========================================================
// INIT
// =========================================================

function init(){

    console.log(
        "Editor initialized ✔"
    );
}

init();
