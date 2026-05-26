/* =========================================================
   EXCEL YOU ADMIN EDITOR
========================================================= */


/* =========================================================
   GLOBAL
========================================================= */

let editor = null;

let isHTMLMode = false;

let currentTheme = "light";

let autoSaveTimer = null;

const AUTO_SAVE_DELAY = 2000;


/* =========================================================
   DOM
========================================================= */

const elements = {

    editor:
        document.getElementById(
            "editor"
        ),

    articleTitle:
        document.getElementById(
            "articleTitle"
        ),

    saveStatus:
        document.getElementById(
            "saveStatus"
        ),

    saveDraftBtn:
        document.getElementById(
            "saveDraftBtn"
        ),

    publishBtn:
        document.getElementById(
            "publishBtn"
        ),

    themeToggle:
        document.getElementById(
            "themeToggle"
        ),

    mobileToggle:
        document.getElementById(
            "mobileToggle"
        ),

    sidebar:
        document.getElementById(
            "sidebar"
        ),

    thumbnailInput:
        document.getElementById(
            "thumbnailInput"
        ),

    thumbnailPreview:
        document.getElementById(
            "thumbnailPreview"
        ),

    thumbnailUploadBox:
        document.getElementById(
            "thumbnailUploadBox"
        )
};


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initEditor
);

function initEditor(){

    setupTheme();

    setupToolbar();

    setupEditor();

    setupAutosave();

    setupThumbnailUpload();

    setupSidebar();

    setupKeyboardShortcuts();

    setupPublish();

    restoreDraft();

    setSaveStatus(
        "Ready ✔"
    );

    console.log(
        "EDITOR INITIALIZED ✔"
    );
}


/* =========================================================
   THEME
========================================================= */

function setupTheme(){

    const savedTheme =
        localStorage.getItem(
            "editor-theme"
        );

    if(savedTheme){

        currentTheme = savedTheme;
    }

    applyTheme();

    elements.themeToggle
    ?.addEventListener(
        "click",
        toggleTheme
    );
}

function toggleTheme(){

    currentTheme =
        currentTheme === "dark"
        ? "light"
        : "dark";

    applyTheme();

    localStorage.setItem(
        "editor-theme",
        currentTheme
    );
}

function applyTheme(){

    document.body.classList.toggle(
        "dark-theme",
        currentTheme === "dark"
    );

    elements.themeToggle.innerHTML =
        currentTheme === "dark"
        ? "☀️"
        : "🌙";
}


/* =========================================================
   SIDEBAR
========================================================= */

function setupSidebar(){

    elements.mobileToggle
    ?.addEventListener(
        "click",
        () => {

            elements.sidebar.classList.toggle(
                "active"
            );
        }
    );
}


/* =========================================================
   TOOLBAR
========================================================= */

function setupToolbar(){

    document
    .querySelectorAll(
        ".editor-toolbar button"
    )
    .forEach(button => {

        button.addEventListener(
            "mousedown",
            e => e.preventDefault()
        );
    });
}


/* =========================================================
   EDITOR
========================================================= */

function setupEditor(){

    editor = elements.editor;

    if(!editor){
        return;
    }

    editor.addEventListener(
        "input",
        handleEditorInput
    );

    editor.addEventListener(
        "paste",
        handlePaste
    );

    editor.addEventListener(
        "dragover",
        handleDragOver
    );

    editor.addEventListener(
        "drop",
        handleDrop
    );
}


/* =========================================================
   INPUT
========================================================= */

function handleEditorInput(){

    setSaveStatus(
        "Unsaved changes..."
    );

    scheduleAutosave();
}


/* =========================================================
   AUTOSAVE
========================================================= */

function setupAutosave(){

    elements.articleTitle
    ?.addEventListener(
        "input",
        scheduleAutosave
    );

    elements.saveDraftBtn
    ?.addEventListener(
        "click",
        saveDraft
    );
}

function scheduleAutosave(){

    clearTimeout(
        autoSaveTimer
    );

    autoSaveTimer =
        setTimeout(
            saveDraft,
            AUTO_SAVE_DELAY
        );
}

async function saveDraft(){

    try{

        setSaveStatus(
            "Saving..."
        );

        const payload = {

            title:
                elements.articleTitle.value,

            content:
                editor.innerHTML,

            updatedAt:
                new Date().toISOString()
        };

        localStorage.setItem(
            "editor-draft",
            JSON.stringify(payload)
        );

        setSaveStatus(
            `Saved ✔ ${new Date()
                .toLocaleTimeString()}`
        );

        console.log(
            "DRAFT SAVED ✔"
        );

    }catch(err){

        console.error(err);

        setSaveStatus(
            "Save failed ❌"
        );
    }
}

function restoreDraft(){

    const saved =
        localStorage.getItem(
            "editor-draft"
        );

    if(!saved){
        return;
    }

    try{

        const data =
            JSON.parse(saved);

        if(data.title){

            elements.articleTitle.value =
                data.title;
        }

        if(data.content){

            editor.innerHTML =
                data.content;
        }

        setSaveStatus(
            "Draft restored ✔"
        );

    }catch(err){

        console.error(err);
    }
}


/* =========================================================
   STATUS
========================================================= */

function setSaveStatus(text){

    if(elements.saveStatus){

        elements.saveStatus.innerText =
            text;
    }
}


/* =========================================================
   PUBLISH
========================================================= */

function setupPublish(){

    elements.publishBtn
    ?.addEventListener(
        "click",
        publishArticle
    );
}

async function publishArticle(){

    try{

        elements.publishBtn.disabled =
            true;

        elements.publishBtn.innerHTML =
            `
            <i class="fas fa-spinner fa-spin"></i>
            Publishing...
            `;

        await saveDraft();

        await fakePublishAPI();

        setSaveStatus(
            "Published ✔"
        );

        alert(
            "Article published successfully ✔"
        );

    }catch(err){

        console.error(err);

        alert(
            "Publish failed ❌"
        );

    }finally{

        elements.publishBtn.disabled =
            false;

        elements.publishBtn.innerHTML =
            `
            <i class="fas fa-paper-plane"></i>
            Publish
            `;
    }
}

async function fakePublishAPI(){

    return new Promise(resolve => {

        setTimeout(
            resolve,
            1500
        );
    });
}


/* =========================================================
   TEXT FORMAT
========================================================= */

function formatText(command){

    document.execCommand(
        command,
        false,
        null
    );

    editor.focus();
}


/* =========================================================
   UNDO / REDO
========================================================= */

function undoEditor(){

    document.execCommand(
        "undo"
    );
}

function redoEditor(){

    document.execCommand(
        "redo"
    );
}


/* =========================================================
   LINK
========================================================= */

function insertLink(){

    const url =
        prompt(
            "Enter URL"
        );

    if(!url){
        return;
    }

    document.execCommand(
        "createLink",
        false,
        url
    );
}


/* =========================================================
   IMAGE
========================================================= */

function insertImage(){

    const url =
        prompt(
            "Enter image URL"
        );

    if(!url){
        return;
    }

    document.execCommand(
        "insertImage",
        false,
        url
    );
}


/* =========================================================
   VIDEO
========================================================= */

function insertVideo(){

    const url =
        prompt(
            "Paste YouTube Embed URL"
        );

    if(!url){
        return;
    }

    const iframe = `
    <div class="video-block">
        <iframe
        src="${url}"
        frameborder="0"
        allowfullscreen>
        </iframe>
    </div>
    `;

    insertHTML(iframe);
}


/* =========================================================
   HTML MODE
========================================================= */

function toggleHTMLMode(){

    isHTMLMode = !isHTMLMode;

    if(isHTMLMode){

        editor.textContent =
            editor.innerHTML;

        editor.setAttribute(
            "contenteditable",
            "false"
        );

    }else{

        editor.innerHTML =
            editor.textContent;

        editor.setAttribute(
            "contenteditable",
            "true"
        );
    }
}


/* =========================================================
   INSERT HTML
========================================================= */

function insertHTML(html){

    document.execCommand(
        "insertHTML",
        false,
        html
    );
}


/* =========================================================
   THUMBNAIL
========================================================= */

function setupThumbnailUpload(){

    elements.thumbnailUploadBox
    ?.addEventListener(
        "click",
        () => {

            elements.thumbnailInput.click();
        }
    );

    elements.thumbnailInput
    ?.addEventListener(
        "change",
        handleThumbnail
    );
}

function handleThumbnail(e){

    const file =
        e.target.files[0];

    if(!file){
        return;
    }

    const reader =
        new FileReader();

    reader.onload = function(ev){

        elements.thumbnailPreview.innerHTML =
            `
            <img
            src="${ev.target.result}">
            `;
    };

    reader.readAsDataURL(file);
}


/* =========================================================
   PASTE
========================================================= */

function handlePaste(e){

    console.log(
        "PASTE DETECTED"
    );
}


/* =========================================================
   DRAG
========================================================= */

function handleDragOver(e){

    e.preventDefault();
}


/* =========================================================
   DROP
========================================================= */

function handleDrop(e){

    e.preventDefault();

    console.log(
        "DROP DETECTED"
    );
}


/* =========================================================
   SHORTCUTS
========================================================= */

function setupKeyboardShortcuts(){

    document.addEventListener(
        "keydown",
        e => {

            // SAVE

            if(
                (e.ctrlKey || e.metaKey)
                &&
                e.key === "s"
            ){

                e.preventDefault();

                saveDraft();
            }

            // BOLD

            if(
                (e.ctrlKey || e.metaKey)
                &&
                e.key === "b"
            ){

                e.preventDefault();

                formatText("bold");
            }

            // ITALIC

            if(
                (e.ctrlKey || e.metaKey)
                &&
                e.key === "i"
            ){

                e.preventDefault();

                formatText("italic");
            }
        }
    );
}


/* =========================================================
   LOGOUT
========================================================= */

function logout(){

    const confirmLogout =
        confirm(
            "Logout?"
        );

    if(!confirmLogout){
        return;
    }

    window.location.href =
        "/admin/login.html";
}
