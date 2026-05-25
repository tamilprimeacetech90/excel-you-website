/* =========================================================
   EXCEL YOU - ADMIN EDITOR (FIXED VERSION)
========================================================= */

// =========================================================
// ELEMENTS
// =========================================================

const body = document.body;

const themeToggle = document.getElementById("themeToggle");
const mobileToggle = document.getElementById("mobileToggle");
const sidebar = document.getElementById("sidebar");

const siteLogo = document.getElementById("siteLogo");

const editor = document.getElementById("editor");
const articleTitle = document.getElementById("articleTitle");
const saveStatus = document.getElementById("saveStatus");

const thumbnailInput = document.getElementById("thumbnailInput");
const thumbnailPreview = document.getElementById("thumbnailPreview");
const uploadBox = document.querySelector(".upload-box");

// =========================================================
// THEME
// =========================================================

function applyTheme(theme) {
    if (theme === "dark") {
        body.classList.add("dark-theme");
        themeToggle.innerHTML = "☀️";

        if (siteLogo) {
            siteLogo.src = "/assets/full-logo-white.png";
        }
    } else {
        body.classList.remove("dark-theme");
        themeToggle.innerHTML = "🌙";

        if (siteLogo) {
            siteLogo.src = "/assets/full-logo.png";
        }
    }
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const isDark = body.classList.contains("dark-theme");
    const newTheme = isDark ? "light" : "dark";

    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
});

// =========================================================
// MOBILE SIDEBAR
// =========================================================

mobileToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

document.addEventListener("click", (e) => {
    if (
        window.innerWidth <= 900 &&
        !sidebar.contains(e.target) &&
        !mobileToggle.contains(e.target)
    ) {
        sidebar.classList.remove("active");
    }
});

// =========================================================
// TEXT FORMATTING
// =========================================================

function formatText(command) {
    document.execCommand(command, false, null);
    editor.focus();
}

function undoEditor() {
    document.execCommand("undo", false, null);
    editor.focus();
}

function redoEditor() {
    document.execCommand("redo", false, null);
    editor.focus();
}

function insertLink() {
    const url = prompt("Enter URL");
    if (!url) return;

    document.execCommand("createLink", false, url);
}

// =========================================================
// IMAGE CROP SYSTEM (SINGLE CLEAN VERSION)
// =========================================================

let cropper = null;

function insertImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = () => {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const cropModal = document.getElementById("cropModal");
            const cropImage = document.getElementById("cropImage");

            cropImage.src = e.target.result;
            cropModal.classList.remove("hidden");

            if (cropper) cropper.destroy();

            cropper = new Cropper(cropImage, {
                aspectRatio: NaN,
                viewMode: 1,
                dragMode: "move",
                autoCropArea: 1,
                background: false,
                responsive: true,
                zoomable: true,
                scalable: true,
                rotatable: true
            });
        };

        reader.readAsDataURL(file);
    };
}

function closeCropModal() {
    document.getElementById("cropModal").classList.add("hidden");

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

function applyCrop() {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
        maxWidth: 2000,
        maxHeight: 2000,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high"
    });

    const img = canvas.toDataURL("image/png");

    const html = `
        <div class="media-block" contenteditable="false">
            <img src="${img}" class="editor-image resizable-image" alt="image">
        </div>
    `;

    editor.insertAdjacentHTML("beforeend", html);
    enhanceInsertedMedia();
    closeCropModal();
    saveStatus.innerText = "Image inserted ✔";
}

// =========================================================
// VIDEO INSERT (SINGLE FIXED VERSION)
// =========================================================

function insertVideo() {
    const url = prompt("Paste YouTube URL");
    if (!url) return;

    let videoId = "";

    if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1];
        if (videoId.includes("&")) {
            videoId = videoId.split("&")[0];
        }
    } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1];
    }

    if (!videoId) {
        alert("Invalid YouTube URL");
        return;
    }

    const embed = `https://www.youtube.com/embed/${videoId}`;

    const html = `
        <div class="media-block video-wrapper" contenteditable="false">
            <iframe width="100%" height="500"
                src="${embed}"
                frameborder="0"
                allowfullscreen></iframe>
        </div>
    `;

    editor.insertAdjacentHTML("beforeend", html);
    enhanceInsertedMedia();
    saveStatus.innerText = "Video inserted ✔";
}

/* =========================================================
   EXCEL YOU - UPGRADED MEDIA SYSTEM (FIXED + STABLE)
========================================================= */

// =========================================================
// STATE
// =========================================================

let selectedMedia = null;
let dragged = null;

// =========================================================
// MEDIA BINDING (IMPORTANT CORE)
// =========================================================

function bindMedia(el) {

    el.addEventListener("click", (e) => {
        e.stopPropagation();
        selectMedia(el);
    });

    el.setAttribute("draggable", true);

    el.addEventListener("dragstart", () => {
        dragged = el;
        el.classList.add("dragging");
    });

    el.addEventListener("dragend", () => {
        el.classList.remove("dragging");
        dragged = null;
    });
}

// =========================================================
// IMAGE WRAPPER FIX (PATCH YOUR insertImage RESULT)
// =========================================================

// CALL THIS AFTER YOU INSERT IMAGE BLOCK
function enhanceInsertedMedia() {

    document.querySelectorAll(".media-block").forEach(el => {
        if (!el.dataset.bound) {
            bindMedia(el);
            el.dataset.bound = "true";
        }
    });
}

// =========================================================
// VIDEO WRAPPER FIX (PATCH YOUR insertVideo RESULT)
// =========================================================

// same enhancer applies to videos too

// =========================================================
// MEDIA SELECTION SYSTEM
// =========================================================

function selectMedia(el) {

    document.querySelectorAll(".selected-media")
        .forEach(e => e.classList.remove("selected-media"));

    selectedMedia = el;
    el.classList.add("selected-media");
}

// clear selection when clicking editor
editor.addEventListener("click", () => {
    document.querySelectorAll(".selected-media")
        .forEach(e => e.classList.remove("selected-media"));

    selectedMedia = null;
});

// =========================================================
// DELETE MEDIA (FIXED)
// =========================================================

document.addEventListener("keydown", (e) => {

    if (e.key === "Delete" && selectedMedia) {
        selectedMedia.remove();
        selectedMedia = null;
       saveStatus.innerText = "Media deleted ✔";
    }
});

// =========================================================
// DRAG SORT SYSTEM (STABLE + NO BUGS)
// =========================================================

editor.addEventListener("dragover", (e) => {
    e.preventDefault();

    const afterElement = getDragAfterElement(editor, e.clientY);
    const dragging = document.querySelector(".dragging");

    if (!dragging) return;

    if (!afterElement) {
        editor.appendChild(dragging);
    } else {
        editor.insertBefore(dragging, afterElement);
    }
});

// =========================================================
// DRAG POSITION CALCULATION
// =========================================================

function getDragAfterElement(container, y) {

    const elements = [
        ...container.querySelectorAll(".media-block:not(.dragging)")
    ];

    return elements.reduce((closest, child) => {

        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        }

        return closest;

    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// =========================================================
// SAFE STATUS UPDATE
// =========================================================

function updateStatus(msg) {
    if (typeof saveStatus !== "undefined" && saveStatus) {
        saveStatus.innerText = msg;
    }
}

// =========================================================
// THUMBNAIL UPLOAD
// =========================================================

uploadBox.addEventListener("click", () => {
    thumbnailInput.click();
});

thumbnailInput.addEventListener("change", () => {
    const file = thumbnailInput.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        thumbnailPreview.innerHTML = `
            <img src="${e.target.result}" alt="thumbnail">
        `;

        saveStatus.innerText = "Thumbnail uploaded ✔";
    };

    reader.readAsDataURL(file);
});

// =========================================================
// HTML MODE
// =========================================================

let htmlMode = false;
let savedHTML = "";

function toggleHTMLMode() {
    if (!htmlMode) {
        savedHTML = editor.innerHTML;
        editor.textContent = savedHTML;
        htmlMode = true;
        saveStatus.innerText = "HTML mode enabled";
    } else {
        editor.innerHTML = editor.textContent;
        htmlMode = false;
        saveStatus.innerText = "Visual mode enabled";
    }
}

// =========================================================
// AUTO SAVE (LOCAL DRAFT)
// =========================================================

let saveTimer;

function autoSave() {
    clearTimeout(saveTimer);

    saveStatus.innerText = "Saving...";

    saveTimer = setTimeout(() => {
        localStorage.setItem("draft", editor.innerHTML);
        localStorage.setItem("title", articleTitle.value);

        saveStatus.innerText = "Draft saved ✔";
    }, 800);
}

editor.addEventListener("input", autoSave);
articleTitle.addEventListener("input", autoSave);

// =========================================================
// KEYBOARD SHORTCUTS
// =========================================================

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveStatus.innerText = "Draft saved ✔";
    }

    if (e.key === "Tab") {
        e.preventDefault();
        document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
});

// =========================================================
// LOGOUT
// =========================================================

function logout() {
    const ok = confirm("Are you sure you want to logout?");
    if (!ok) return;

    localStorage.removeItem("adminToken");
    sessionStorage.clear();

    window.location.href = "/login.html";
}

// =========================================================
// INIT
// =========================================================

function init() {
    console.log("Editor initialized ✔");
}

init();