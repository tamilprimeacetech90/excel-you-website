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

const savedTheme =
localStorage.getItem(
    "theme"
);

applyTheme(
    savedTheme || "light"
);

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
// CLOSE SIDEBAR
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
// FORMAT TEXT
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
// UNDO
// =========================================================

function undoEditor(){

    document.execCommand(
        "undo",
        false,
        null
    );

    editor.focus();
}

// =========================================================
// REDO
// =========================================================

function redoEditor(){

    document.execCommand(
        "redo",
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
// IMAGE UPLOAD FROM LOCAL FILE
// =========================================================

function insertImage(){

    const input =
    document.createElement(
        "input"
    );

    input.type = "file";

    input.accept =
    "image/*";

    input.click();

    input.onchange = () => {

        const file =
        input.files[0];

        if(!file) return;

        const reader =
        new FileReader();

        reader.onload = (e) => {

            const imageHTML = `

                <img
                src="${e.target.result}"
                class="editor-image"
                alt="Uploaded Image">

            `;

            editor.innerHTML +=
            imageHTML;

            saveStatus.innerText =
            "Image inserted ✔";
        };

        reader.readAsDataURL(
            file
        );
    };
}

// =========================================================
// YOUTUBE VIDEO EMBED
// =========================================================

function insertVideo(){

    const url =
    prompt(
        "Paste YouTube URL"
    );

    if(!url) return;

    let videoId = "";

    // youtube.com/watch?v=

    if(
        url.includes(
            "watch?v="
        )
    ){

        videoId =
        url.split(
            "watch?v="
        )[1];

        if(videoId.includes("&")){

            videoId =
            videoId.split("&")[0];
        }
    }

    // youtu.be/

    else if(
        url.includes(
            "youtu.be/"
        )
    ){

        videoId =
        url.split(
            "youtu.be/"
        )[1];
    }

    if(!videoId){

        alert(
            "Invalid YouTube URL"
        );

        return;
    }

    const embedURL =
    `https://www.youtube.com/embed/${videoId}`;

    const iframe = `

        <div class="video-wrapper">

            <iframe
            width="100%"
            height="500"
            src="${embedURL}"
            frameborder="0"
            allowfullscreen>
            </iframe>

        </div>

    `;

    editor.innerHTML +=
    iframe;

    saveStatus.innerText =
    "Video inserted ✔";
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
// AUTO SAVE
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
// LISTENERS
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

    localStorage.removeItem(
        "adminToken"
    );

    sessionStorage.clear();

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

        // TAB

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
