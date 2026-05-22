// =========================
// GLOBAL
// =========================

let quill = null;

let saveTimer = null;

let isSaving = false;

let hasUnsavedChanges = false;

const AUTO_SAVE_DELAY = 2000;

const elements = {};


// =========================
// SAFE QUILL CHECK
// =========================

if (typeof Quill === "undefined") {

    console.error("Quill failed to load");

    alert("Quill Editor not loaded");

} else {

    // =========================
    // QUILL ICONS
    // =========================

    const icons = Quill.import("ui/icons");

    icons["undo"] = `
    <svg viewBox="0 0 18 18">
        <polygon
            class="ql-fill ql-stroke"
            points="6 10 4 12 2 10 6 10">
        </polygon>

        <path
            class="ql-stroke"
            d="M4,12 C4,7 6,5 10,5 C12,5 14,6 15,8">
        </path>
    </svg>
    `;

    icons["redo"] = `
    <svg viewBox="0 0 18 18">
        <polygon
            class="ql-fill ql-stroke"
            points="12 10 14 12 16 10 12 10">
        </polygon>

        <path
            class="ql-stroke"
            d="M14,12 C14,7 12,5 8,5 C6,5 4,6 3,8">
        </path>
    </svg>
    `;

    // =========================
    // CUSTOM FONTS
    // =========================

    const Font = Quill.import("formats/font");

    Font.whitelist = [
        "sans-serif",
        "serif",
        "monospace",
        "arial",
        "times-new-roman",
        "courier-new",
        "georgia",
        "tahoma",
        "verdana"
    ];

    Quill.register(Font, true);

    // =========================
    // IMAGE RESIZE
    // =========================

    if (window.ImageResize) {

        Quill.register(
            "modules/imageResize",
            window.ImageResize
        );
    }

    // =========================
    // IMAGE UPLOADER
    // =========================

    if (typeof ImageUploader !== "undefined") {

        Quill.register(
            "modules/imageUploader",
            ImageUploader
        );
    }
}




// =========================
// IMAGE RESIZE
// =========================

if (window.ImageResize) {

    Quill.register(
        "modules/imageResize",
        window.ImageResize
    );
}


// =========================
// INIT ELEMENTS
// =========================

function initElements() {

    elements.sidebar =
        document.getElementById("sidebar");

    elements.overlay =
        document.getElementById("overlay");

    elements.menuBtn =
        document.querySelector(".menu-btn");

    elements.postsList =
        document.getElementById("postsList");

    elements.previewBox =
        document.getElementById("previewBox");

    elements.subjectList =
        document.getElementById("subjectList");

    elements.statsBox =
        document.getElementById("statsBox");

    elements.topicId =
        document.getElementById("topicId");

    elements.editorTitle =
        document.getElementById("editorTitle");

    elements.publishBtn =
        document.getElementById("publishBtn");

    elements.statusBadge =
        document.getElementById("statusBadge");

    elements.saveStatus =
        document.getElementById("saveStatus");

    elements.imageUpload =
        document.getElementById("imageUpload");

    elements.themeToggle =
        document.getElementById("themeToggle");
}


// =========================
// SAFE HTML
// =========================

function renderHTML(html = "") {

    if (typeof DOMPurify !== "undefined") {

        return DOMPurify.sanitize(html);
    }

    return html;
}


// =========================
// SIDEBAR
// =========================

function toggleSidebar() {

    elements.sidebar?.classList.toggle("active");

    elements.overlay?.classList.toggle("show");
}

function closeSidebar() {

    elements.sidebar?.classList.remove("active");

    elements.overlay?.classList.remove("show");
}

function setupSidebar() {

    elements.menuBtn?.addEventListener(
        "click",
        toggleSidebar
    );

    elements.overlay?.addEventListener(
        "click",
        closeSidebar
    );
}


// =========================
// SECTION SWITCH
// =========================

function showSection(section) {

    const sections = {

        dashboard:
            document.getElementById("dashboardSection"),

        subject:
            document.getElementById("subjectSection"),

        topic:
            document.getElementById("topicSection"),

        posts:
            document.getElementById("postsSection"),

        block:
            document.getElementById("blockSection")
    };

    Object.values(sections).forEach(sec => {

        sec?.classList.add("hidden");
    });

    sections[section]?.classList.remove("hidden");

    closeSidebar();
}


// =========================
// INIT EDITOR
// =========================

function initEditor() {

    const editor =
        document.getElementById("editor");

    if (!editor) {

        console.error(
            "Editor element not found"
        );

        return;
    }

    quill = new Quill("#editor", {

        theme: "snow",

        placeholder:
            "Write your article here...",

        modules: {

            toolbar: {

                container: [

                    ["undo", "redo"],

                    [
                        {
                            font: [
                                "sans-serif",
                                "serif",
                                "monospace",
                                "arial",
                                "times-new-roman",
                                "courier-new",
                                "georgia",
                                "tahoma",
                                "verdana"
                            ]
                        }
                    ],

                    [
                        {
                            size: [
                                "small",
                                false,
                                "large",
                                "huge"
                            ]
                        }
                    ],

                    [
                        {
                            header: [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                false
                            ]
                        }
                    ],

                    [
                        "bold",
                        "italic",
                        "underline",
                        "strike"
                    ],

                    [
                        { color: [] },
                        { background: [] }
                    ],

                    [
                        { align: [] }
                    ],

                    [
                        { list: "ordered" },
                        { list: "bullet" }
                    ],

                    [
                        { indent: "-1" },
                        { indent: "+1" }
                    ],

                    [
                        "blockquote",
                        "code-block"
                    ],

                    [
                        "link",
                        "image",
                        "video"
                    ],

                    ["clean"]
                ],

                handlers: {

                    undo() {

                        quill.history.undo();
                    },

                    redo() {

                        quill.history.redo();
                    },

                    video() {

                        const url = prompt(
                            "Paste YouTube Video URL"
                        );

                        if (!url) return;

                        const range =
                            quill.getSelection(true);

                        quill.insertEmbed(
                            range ? range.index : 0,
                            "video",
                            url
                        );
                    }
                }
            },

            history: {

                delay: 1000,

                maxStack: 500,

                userOnly: true
            },

            imageResize: {

                parchment:
                    Quill.import("parchment"),

                modules: [
                    "Resize",
                    "DisplaySize",
                    "Toolbar"
                ]
            },

            imageUploader: {

                upload: async file => {

                    try {

                        if (
                            !file.type.startsWith(
                                "image/"
                            )
                        ) {

                            alert(
                                "Only image files allowed"
                            );

                            return "";
                        }

                        if (
                            file.size >
                            5 * 1024 * 1024
                        ) {

                            alert(
                                "Max image size 5MB"
                            );

                            return "";
                        }

                        const formData =
                            new FormData();

                        formData.append(
                            "image",
                            file
                        );

                        const response =
                            await fetch(
                                "/api/upload",
                                {
                                    method: "POST",
                                    body: formData
                                }
                            );

                        if (!response.ok) {

                            throw new Error(
                                "Upload failed"
                            );
                        }

                        const data =
                            await response.json();

                        return data.url;

                    } catch (err) {

                        console.error(err);

                        alert(
                            "Image upload failed ❌"
                        );

                        return "";
                    }
                }
            }
        }
    });

    // =========================
    // LIVE PREVIEW
    // =========================

    quill.on(
        "text-change",
        () => {

            updatePreview();

            hasUnsavedChanges = true;

            startAutoSave();
        }
    );

    console.log(
        "Advanced Quill editor initialized ✔"
    );
}


// =========================
// PREVIEW
// =========================

function updatePreview() {

    if (
        !quill ||
        !elements.previewBox
    ) {
        return;
    }

    elements.previewBox.innerHTML =
        renderHTML(
            quill.root.innerHTML
        );
}


// =========================
// AUTO SAVE
// =========================

function startAutoSave() {

    clearTimeout(saveTimer);

    saveTimer = setTimeout(
        saveDraft,
        AUTO_SAVE_DELAY
    );
}

function saveDraft() {

    if (isSaving || !hasUnsavedChanges) {
        return;
    }

    isSaving = true;

    elements.saveStatus.textContent =
        "Saving...";

    setTimeout(() => {

        isSaving = false;

        hasUnsavedChanges = false;

        elements.saveStatus.textContent =
            "Saved ✔";

    }, 1000);
}


// =========================
// THEME
// =========================

function setupTheme() {

    const savedTheme =
        localStorage.getItem("adminTheme");

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

        if (elements.themeToggle) {

            elements.themeToggle.innerHTML =
                "☀️";
        }
    }

    elements.themeToggle?.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-theme"
            );

            const dark =
                document.body.classList.contains(
                    "dark-theme"
                );

            elements.themeToggle.innerHTML =
                dark ? "☀️" : "🌙";

            localStorage.setItem(
                "adminTheme",
                dark ? "dark" : "light"
            );
        }
    );
}


// =========================
// PLACEHOLDER FUNCTIONS
// =========================

function addSubject() {

    alert("Add Subject Working ✔");
}

function addTopic() {

    alert("Add Topic Working ✔");
}

function loadPosts() {

    console.log("Load Posts");
}

function togglePublish() {

    alert("Publish clicked ✔");
}

function openSelectedTopic() {

    console.log("Open Topic");
}

function createNewArticle() {

    alert("Create Article ✔");
}

function logout() {

    alert("Logout clicked");
}


// =========================
// INIT
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        try {

            initElements();

            setupSidebar();

            setupTheme();

            initEditor();

            showSection("dashboard");

            updatePreview();

            console.log("Admin loaded ✔");

        } catch (err) {

            console.error(err);

            alert(
                "Admin failed to load ❌"
            );
        }
    }
);