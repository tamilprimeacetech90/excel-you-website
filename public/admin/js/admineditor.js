```javascript id="x2qk7m"
/* =========================================================
   EXCEL YOU - ADMIN EDITOR JS
========================================================= */

/* =========================================================
   ELEMENTS
========================================================= */

const body =
    document.body;

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("overlay");

const menuBtn =
    document.getElementById("menuBtn");

const themeToggle =
    document.getElementById("themeToggle");

const editorArea =
    document.querySelector(".editor-area");

const editorTitle =
    document.querySelector(".editor-title");

const previewBtn =
    document.querySelector(".preview-btn");

const publishBtn =
    document.querySelector(".publish-btn");

const saveBtn =
    document.querySelector(".save-btn");

const toolbarButtons =
    document.querySelectorAll(
        ".editor-toolbar button"
    );


/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {

    sidebar.classList.add("active");

    overlay.classList.add("show");
}

function closeSidebar() {

    sidebar.classList.remove("active");

    overlay.classList.remove("show");
}

menuBtn?.addEventListener(
    "click",
    openSidebar
);

overlay?.addEventListener(
    "click",
    closeSidebar
);


/* =========================================================
   THEME
========================================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "excel-theme"
        );

    if (savedTheme === "dark") {

        body.classList.add(
            "dark-theme"
        );

        themeToggle.innerHTML =
            "☀️ Light Mode";
    }
}

function toggleTheme() {

    body.classList.toggle(
        "dark-theme"
    );

    const isDark =
        body.classList.contains(
            "dark-theme"
        );

    if (isDark) {

        localStorage.setItem(
            "excel-theme",
            "dark"
        );

        themeToggle.innerHTML =
            "☀️ Light Mode";

    } else {

        localStorage.setItem(
            "excel-theme",
            "light"
        );

        themeToggle.innerHTML =
            "🌙 Dark Mode";
    }
}

themeToggle?.addEventListener(
    "click",
    toggleTheme
);


/* =========================================================
   TOOLBAR ACTIONS
========================================================= */

toolbarButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const icon =
                button.querySelector("i");

            if (!icon) return;

            /* =============================================
               TEXT STYLES
            ============================================= */

            if (
                icon.classList.contains(
                    "fa-bold"
                )
            ) {

                document.execCommand(
                    "bold"
                );
            }

            if (
                icon.classList.contains(
                    "fa-italic"
                )
            ) {

                document.execCommand(
                    "italic"
                );
            }

            if (
                icon.classList.contains(
                    "fa-underline"
                )
            ) {

                document.execCommand(
                    "underline"
                );
            }

            if (
                icon.classList.contains(
                    "fa-strikethrough"
                )
            ) {

                document.execCommand(
                    "strikeThrough"
                );
            }

            /* =============================================
               LISTS
            ============================================= */

            if (
                icon.classList.contains(
                    "fa-list-ul"
                )
            ) {

                document.execCommand(
                    "insertUnorderedList"
                );
            }

            if (
                icon.classList.contains(
                    "fa-list-ol"
                )
            ) {

                document.execCommand(
                    "insertOrderedList"
                );
            }

            /* =============================================
               ALIGNMENT
            ============================================= */

            if (
                icon.classList.contains(
                    "fa-align-left"
                )
            ) {

                document.execCommand(
                    "justifyLeft"
                );
            }

            if (
                icon.classList.contains(
                    "fa-align-center"
                )
            ) {

                document.execCommand(
                    "justifyCenter"
                );
            }

            if (
                icon.classList.contains(
                    "fa-align-right"
                )
            ) {

                document.execCommand(
                    "justifyRight"
                );
            }

            /* =============================================
               LINK
            ============================================= */

            if (
                icon.classList.contains(
                    "fa-link"
                )
            ) {

                const url =
                    prompt(
                        "Enter URL"
                    );

                if (url) {

                    document.execCommand(
                        "createLink",
                        false,
                        url
                    );
                }
            }

            /* =============================================
               IMAGE
            ============================================= */

            if (
                icon.classList.contains(
                    "fa-image"
                )
            ) {

                const imageUrl =
                    prompt(
                        "Enter Image URL"
                    );

                if (imageUrl) {

                    document.execCommand(
                        "insertImage",
                        false,
                        imageUrl
                    );
                }
            }

            /* =============================================
               VIDEO
            ============================================= */

            if (
                icon.classList.contains(
                    "fa-video"
                )
            ) {

                const videoUrl =
                    prompt(
                        "Enter YouTube Embed URL"
                    );

                if (videoUrl) {

                    const iframe = `

                        <iframe
                            width="100%"
                            height="400"
                            src="${videoUrl}"
                            frameborder="0"
                            allowfullscreen
                        ></iframe>
                    `;

                    document.execCommand(
                        "insertHTML",
                        false,
                        iframe
                    );
                }
            }

            editorArea.focus();
        }
    );
});


/* =========================================================
   HTML MODE
========================================================= */

let htmlMode = false;

const htmlBtn =
    document.querySelector(".html-btn");

htmlBtn?.addEventListener(
    "click",
    () => {

        if (!htmlMode) {

            editorArea.textContent =
                editorArea.innerHTML;

            htmlMode = true;

            htmlBtn.classList.add(
                "active"
            );

        } else {

            editorArea.innerHTML =
                editorArea.textContent;

            htmlMode = false;

            htmlBtn.classList.remove(
                "active"
            );
        }
    }
);


/* =========================================================
   SAVE DRAFT
========================================================= */

saveBtn?.addEventListener(
    "click",
    async () => {

        try {

            const articleData = {

                title:
                    editorTitle.value,

                content:
                    editorArea.innerHTML,

                status:
                    "draft"
            };

            const response =
                await fetch(
                    "/api/articles/save",
                    {
                        method:"POST",

                        headers:{
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                articleData
                            )
                    }
                );

            if (response.ok) {

                alert(
                    "Draft saved ✔"
                );

            } else {

                alert(
                    "Failed to save ❌"
                );
            }

        } catch (err) {

            console.error(err);

            alert(
                "Server error ❌"
            );
        }
    }
);


/* =========================================================
   PUBLISH
========================================================= */

publishBtn?.addEventListener(
    "click",
    async () => {

        try {

            const articleData = {

                title:
                    editorTitle.value,

                content:
                    editorArea.innerHTML,

                status:
                    "published"
            };

            const response =
                await fetch(
                    "/api/articles/publish",
                    {
                        method:"POST",

                        headers:{
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                articleData
                            )
                    }
                );

            if (response.ok) {

                alert(
                    "Article published ✔"
                );

            } else {

                alert(
                    "Publish failed ❌"
                );
            }

        } catch (err) {

            console.error(err);

            alert(
                "Server error ❌"
            );
        }
    }
);


/* =========================================================
   PREVIEW
========================================================= */

previewBtn?.addEventListener(
    "click",
    () => {

        const previewWindow =
            window.open();

        previewWindow.document.write(`

            <html>

            <head>

                <title>
                    Preview
                </title>

                <style>

                    body{
                        font-family:Inter,sans-serif;
                        padding:40px;
                        line-height:1.8;
                        max-width:900px;
                        margin:auto;
                    }

                    img{
                        max-width:100%;
                        border-radius:16px;
                    }

                    iframe{
                        width:100%;
                        border:none;
                        border-radius:16px;
                    }

                </style>

            </head>

            <body>

                <h1>
                    ${editorTitle.value}
                </h1>

                ${editorArea.innerHTML}

            </body>

            </html>
        `);
    }
);


/* =========================================================
   AUTO SAVE
========================================================= */

let autoSaveTimer;

function autoSave() {

    clearTimeout(
        autoSaveTimer
    );

    autoSaveTimer =
        setTimeout(
            () => {

                localStorage.setItem(
                    "excel-draft-title",
                    editorTitle.value
                );

                localStorage.setItem(
                    "excel-draft-content",
                    editorArea.innerHTML
                );

                console.log(
                    "Draft Auto Saved"
                );

            },
            2000
        );
}

editorArea?.addEventListener(
    "input",
    autoSave
);

editorTitle?.addEventListener(
    "input",
    autoSave
);


/* =========================================================
   RESTORE DRAFT
========================================================= */

function restoreDraft() {

    const savedTitle =
        localStorage.getItem(
            "excel-draft-title"
        );

    const savedContent =
        localStorage.getItem(
            "excel-draft-content"
        );

    if (savedTitle) {

        editorTitle.value =
            savedTitle;
    }

    if (savedContent) {

        editorArea.innerHTML =
            savedContent;
    }
}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTheme();

        restoreDraft();

        console.log(
            "Editor Loaded ✔"
        );
    }
);
```
