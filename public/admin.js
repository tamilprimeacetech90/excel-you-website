// =========================
// GLOBAL
// =========================
let quill;
let saveTimer;

let isSaving = false;
let hasUnsavedChanges = false;

const AUTO_SAVE_DELAY = 2000;

const elements = {};

// =========================
// QUILL CUSTOM ICONS
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
// TOOLBAR OPTIONS
// =========================
const toolbarOptions = [

    ["undo", "redo"],

    [{ font: Font.whitelist }],

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
            4,
            5,
            6,
            false
        ]
    }],

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
// API HELPER
// =========================
async function api(url, options = {}) {

    const response =
        await fetch(url, options);

    let data = null;

    try {

        data = await response.json();

    } catch {

        data = null;
    }

    if (!response.ok) {

        throw new Error(
            data?.message ||
            "Request Failed"
        );
    }

    return data;
}



// =========================
// SAFE HTML RENDER
// =========================
function renderHTML(html = "") {

    if (
        typeof DOMPurify !== "undefined"
    ) {

        return DOMPurify.sanitize(html);
    }

    return html;
}


// =========================
// SIDEBAR TOGGLE
// =========================
function setupSidebar() {

    if (
        !elements.sidebar ||
        !elements.menuBtn ||
        !elements.overlay
    ) {
        return;
    }

    elements.menuBtn.addEventListener(
        "click",
        () => {

            elements.sidebar.classList.toggle(
                "active"
            );

            elements.overlay.classList.toggle(
                "show"
            );
        }
    );

    elements.overlay.addEventListener(
        "click",
        closeSidebar
    );
}


function closeSidebar() {

    elements.sidebar?.classList.remove(
        "active"
    );

    elements.overlay?.classList.remove(
        "show"
    );
}

// =========================
// MOBILE AUTO CLOSE SIDEBAR
// =========================
function setupResponsiveSidebar() {

    const menuButtons =
        document.querySelectorAll(
            ".sidebar button"
        );

    menuButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <= 768
                ) {

                    closeSidebar();
                }
            }
        );
    });
}
// =========================
// SAVE STATUS
// =========================
function setSaveStatus(text) {

    if (!elements.saveStatus) return;

    elements.saveStatus.innerText = text;
}


// =========================
// LIVE PREVIEW
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
// INIT EDITOR
// =========================

Quill.register(
    "modules/imageUploader",
    ImageUploader
);


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

                container:
                    toolbarOptions,

                handlers: {

                    undo: function () {

                        quill.history.undo();
                    },

                    redo: function () {

                        quill.history.redo();
                    }
                }
            },

            history: {

                delay: 1000,

                maxStack: 500,

                userOnly: true
            },

            imageUploader: {

                upload: async file => {

                    try {

                        // =========================
                        // FILE TYPE CHECK
                        // =========================
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

                        // =========================
                        // 5MB LIMIT
                        // =========================
                        if (
                            file.size >
                            5 * 1024 * 1024
                        ) {

                            alert(
                                "Image too large (Max 5MB)"
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

                        if (!data.url) {

                            throw new Error(
                                "Invalid image URL"
                            );
                        }

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

    console.log(
        "Quill editor initialized ✔"
    );
}

// =========================
// AUTO SAVE
// =========================
function setupAutoSave() {

    if (!quill) return;

    quill.on(
        "text-change",
        () => {

            hasUnsavedChanges = true;

            clearTimeout(saveTimer);

            setSaveStatus(
                "Saving..."
            );

            updatePreview();

            saveTimer = setTimeout(
                autoSaveDraft,
                AUTO_SAVE_DELAY
            );
        }
    );

    elements.editorTitle
        ?.addEventListener(
            "input",
            () => {

                hasUnsavedChanges = true;

                clearTimeout(saveTimer);

                setSaveStatus(
                    "Saving..."
                );

                saveTimer =
                    setTimeout(
                        autoSaveDraft,
                        AUTO_SAVE_DELAY
                    );
            }
        );
}

// =========================
// SAVE DRAFT
// =========================
async function autoSaveDraft(retryCount = 0) {

    // Prevent duplicate save requests
    if (isSaving) {
        return false;
    }

    if (
        !quill ||
        !elements.topicId
    ) {
        return false;
    }

    const topicId =
        elements.topicId.value;

    if (!topicId) {
        return false;
    }

    // =========================
    // OFFLINE CHECK
    // =========================
    if (!navigator.onLine) {

        saveLocalBackup();

        setSaveStatus(
            "Offline ⚠ Changes stored locally"
        );

        return false;
    }

    try {

        isSaving = true;

        setSaveStatus(
            "Saving..."
        );

        // =========================
        // PREPARE PAYLOAD
        // =========================
        const payload = {

            title:
                elements.editorTitle
                    ?.value
                    ?.trim() || "",

            contentHTML:
                quill.root.innerHTML
        };

        // =========================
        // API REQUEST
        // =========================
        await api(
            `/api/admin/topic/${topicId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(
                    payload
                )
            }
        );

        // =========================
        // SAVE SUCCESS
        // =========================
        hasUnsavedChanges = false;

        updatePreview();

        // Remove local backup after success
        localStorage.removeItem(
            "editorBackup"
        );

        setSaveStatus(
            `Saved ✔ ${new Date()
                .toLocaleTimeString()}`
        );

        return true;

    } catch (err) {

        console.error(
            "Save failed:",
            err
        );

        saveLocalBackup();

        // =========================
        // RETRY SYSTEM
        // =========================
        if (
            navigator.onLine &&
            retryCount < 3
        ) {

            setSaveStatus(
                `Retrying... (${retryCount + 1}/3)`
            );

            // Wait before retry
            await new Promise(resolve =>
                setTimeout(resolve, 2000)
            );

            isSaving = false;

            return await autoSaveDraft(
                retryCount + 1
            );
        }

        setSaveStatus(
            "Save failed ❌"
        );

        return false;

    } finally {

        isSaving = false;
    }
}

// =========================
// PUBLISH POST
// =========================
async function publishPost() {

    if (
        !quill ||
        !elements.topicId
    ) {
        return;
    }

    const topicId =
        elements.topicId.value;

    const title =
        elements.editorTitle
            ?.value
            ?.trim();

    const content =
        quill.getText().trim();

    if (!topicId) {

        alert(
            "Topic ID missing"
        );

        return;
    }

    if (!title) {

        alert(
            "Title is required"
        );

        return;
    }

    if (!content) {

        alert(
            "Content cannot be empty"
        );

        return;
    }

    // =========================
    // OFFLINE CHECK
    // =========================
    if (!navigator.onLine) {

        alert(
            "Cannot publish while offline ⚠"
        );

        return;
    }

    try {

        elements.publishBtn.disabled =
            true;

        elements.publishBtn.innerText =
            "Saving...";

        // Save before publish
        const saved =
            await autoSaveDraft();

        if (!saved) {

            throw new Error(
                "Save failed before publish"
            );
        }

        elements.publishBtn.innerText =
            "Publishing...";

        await api(
            `/api/admin/topic/${topicId}/publish`,
            {
                method: "POST"
            }
        );

        hasUnsavedChanges = false;

        if (
            elements.statusBadge
        ) {

            elements.statusBadge.innerText =
                "Published";
        }

        setSaveStatus(
            "Published ✔"
        );

        alert(
            "Post published ✔"
        );

    } catch (err) {

        console.error(err);

        alert(
            "Publish failed ❌"
        );

    } finally {

        elements.publishBtn.disabled =
            false;

        elements.publishBtn.innerText =
            "Publish";
    }
}

// =========================
// IMAGE INPUT PREVIEW
// =========================
function setupImagePreview() {

    if (
        !elements.imageUpload ||
        !elements.previewBox
    ) {
        return;
    }

    elements.imageUpload.addEventListener(
        "change",
        event => {

            const file =
                event.target.files?.[0];

            if (!file) return;

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Invalid image file"
                );

                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                e => {

                    elements.previewBox.innerHTML = `
                        <img
                            src="${e.target.result}"
                            alt="Preview"
                            style="
                                margin-top:20px;
                                border-radius:16px;
                            "
                        />
                    `;
                };

            reader.readAsDataURL(
                file
            );
        }
    );
}


// =========================
// SHORTCUTS
// =========================
function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            // CTRL + S
            if (
                (
                    event.ctrlKey ||
                    event.metaKey
                ) &&
                event.key.toLowerCase() ===
                    "s"
            ) {

                event.preventDefault();

                autoSaveDraft();
            }
        }
    );
}



// =========================
// NETWORK STATUS
// =========================
function setupNetworkStatus() {

    window.addEventListener(
        "offline",
        () => {

            setSaveStatus(
                "Offline ⚠"
            );
        }
    );

    window.addEventListener(
        "online",
        () => {

            setSaveStatus(
                "Back Online ✔"
            );

            if (
                hasUnsavedChanges
            ) {

                autoSaveDraft();
            }
        }
    );
}


// =========================
// LOCAL BACKUP
// =========================
function saveLocalBackup() {

    if (!quill) return;

    const backup = {

        title:
            elements.editorTitle
                ?.value || "",

        content:
            quill.root.innerHTML,

        time:
            Date.now()
    };

    localStorage.setItem(
        "editorBackup",
        JSON.stringify(backup)
    );
}



// =========================
// RESTORE BACKUP
// =========================
function restoreLocalBackup() {

    const backup =
        localStorage.getItem(
            "editorBackup"
        );

    if (!backup) return;

    try {

        const parsed =
            JSON.parse(backup);

        if (
            elements.editorTitle
        ) {

            elements.editorTitle.value =
                parsed.title || "";
        }

        if (
            quill &&
            parsed.content
        ) {

            // Safer restore
           quill.root.innerHTML =
    renderHTML(parsed.content);
        }

        updatePreview();

        setSaveStatus(
            "Backup restored ✔"
        );

        console.log(
            "Backup restored ✔"
        );

    } catch (err) {

        console.error(
            "Backup restore failed",
            err
        );
    }
}
// =========================
// AUTO LOCAL BACKUP
// =========================
function setupLocalBackup() {

    if (!quill) return;

    quill.on(
        "text-change",
        saveLocalBackup
    );

    elements.editorTitle
        ?.addEventListener(
            "input",
            saveLocalBackup
        );
}


// =========================
// BEFORE CLOSE WARNING
// =========================
window.addEventListener(
    "beforeunload",
    event => {

        if (!hasUnsavedChanges) {
            return;
        }

        event.preventDefault();

        event.returnValue = "";
    }
);

// =========================
// WINDOW INIT
// =========================
document.addEventListener(
    "DOMContentLoaded",
    async () => {

    try {

        initElements();

        initEditor();

        restoreLocalBackup();

        setupAutoSave();

        setupSidebar();

        setupResponsiveSidebar();

        setupImagePreview();

        setupKeyboardShortcuts();

        setupLocalBackup();

        setupNetworkStatus();

        elements.publishBtn
            ?.addEventListener(
                "click",
                publishPost
            );

        console.log(
            "Admin loaded ✔"
        );

    } catch (err) {

        console.error(err);

        alert(
            "Admin failed to load ❌"
        );
    }
});

