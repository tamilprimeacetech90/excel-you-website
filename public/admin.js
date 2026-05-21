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
// TOOLBAR
// =========================
const toolbarOptions = [

    ["undo", "redo"],

    [{ font: [] }],

    [{
        size: [
            "small",
            false,
            "large",
            "huge"
        ]
    }],

    [{
        header: [
            1,
            2,
            3,
            false
        ]
    }],

    [
        "bold",
        "italic",
        "underline"
    ],

    [
        { color: [] },
        { background: [] }
    ],

    [
        { list: "ordered" },
        { list: "bullet" }
    ],

    [
        "link",
        "image"
    ],

    ["clean"]
];


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

    if (elements.menuBtn) {

        elements.menuBtn.addEventListener(
            "click",
            toggleSidebar
        );
    }

    if (elements.overlay) {

        elements.overlay.addEventListener(
            "click",
            closeSidebar
        );
    }
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

        if (sec) {

            sec.classList.add("hidden");
        }
    });

    if (sections[section]) {

        sections[section].classList.remove("hidden");
    }

    closeSidebar();
}


// =========================
// INIT EDITOR
// =========================
function initEditor() {

    if (typeof Quill === "undefined") {

        console.error("Quill missing");
        return;
    }

    const editor =
        document.getElementById("editor");

    if (!editor) {

        console.error("Editor not found");
        return;
    }

    quill = new Quill("#editor", {

        theme: "snow",

        placeholder:
            "Write your article here...",

        modules: {

            toolbar: toolbarOptions,

            history: {

                delay: 1000,
                maxStack: 500,
                userOnly: true
            }
        }
    });

    quill.on(
        "text-change",
        () => {

            updatePreview();
        }
    );

    console.log("Editor initialized");
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

            initEditor();

            showSection("dashboard");

            console.log("Admin loaded ✔");

        } catch (err) {

            console.error(err);

            alert(
                "Admin failed to load ❌"
            );
        }
    }
);

