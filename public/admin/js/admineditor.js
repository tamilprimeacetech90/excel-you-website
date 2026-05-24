/* =========================================================
   EXCEL YOU - ADMIN EDITOR (PRODUCTION BLOCK SYSTEM)
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
    const isDark = theme === "dark";

    body.classList.toggle("dark-theme", isDark);
    themeToggle.innerHTML = isDark ? "☀️" : "🌙";

    if (siteLogo) {
        siteLogo.src = isDark
            ? "/assets/full-logo-white.png"
            : "/assets/full-logo.png";
    }
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const newTheme = body.classList.contains("dark-theme") ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
});

// =========================================================
// SIDEBAR
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
// BASIC TEXT COMMANDS
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
// BLOCK SYSTEM CORE
// =========================================================

let selectedBlock = null;
let draggedBlock = null;

// ALL MEDIA MUST BE BLOCK
function createBlock(html, type = "media") {
    const wrapper = document.createElement("div");
    wrapper.className = "media-block";
    wrapper.setAttribute("contenteditable", "false");
    wrapper.setAttribute("data-type", type);

    wrapper.innerHTML = html;

    bindBlock(wrapper);
    return wrapper;
}

// =========================================================
// BLOCK BINDING
// =========================================================

function bindBlock(block) {

    block.addEventListener("click", (e) => {
        e.stopPropagation();
        selectBlock(block);
    });

    block.setAttribute("draggable", true);

    block.addEventListener("dragstart", () => {
        draggedBlock = block;
        block.classList.add("dragging");
    });

    block.addEventListener("dragend", () => {
        block.classList.remove("dragging");
        draggedBlock = null;
    });
}

// =========================================================
// SELECT BLOCK
// =========================================================

function selectBlock(block) {

    document.querySelectorAll(".selected-media")
        .forEach(el => el.classList.remove("selected-media"));

    selectedBlock = block;
    block.classList.add("selected-media");
}

// clear selection
editor.addEventListener("click", () => {
    document.querySelectorAll(".selected-media")
        .forEach(el => el.classList.remove("selected-media"));

    selectedBlock = null;
});

// DELETE BLOCK
document.addEventListener("keydown", (e) => {
    if (e.key === "Delete" && selectedBlock) {
        selectedBlock.remove();
        selectedBlock = null;
        saveStatus.innerText = "Block deleted ✔";
    }
});

// =========================================================
// IMAGE INSERT (CROP + BLOCK)
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

            const modal = document.getElementById("cropModal");
            const img = document.getElementById("cropImage");

            img.src = e.target.result;
            modal.classList.remove("hidden");

            if (cropper) cropper.destroy();

            cropper = new Cropper(img, {
                aspectRatio: NaN,
                viewMode: 1,
                autoCropArea: 1
            });
        };

        reader.readAsDataURL(file);
    };
}

function applyCrop() {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas();
    const src = canvas.toDataURL("image/png");

    const block = createBlock(`
        <img src="${src}" class="editor-image">
    `);

    editor.appendChild(block);

    cropper.destroy();
    cropper = null;

    document.getElementById("cropModal").classList.add("hidden");

    saveStatus.innerText = "Image added ✔";
}

// =========================================================
// VIDEO INSERT
// =========================================================

function insertVideo() {

    const url = prompt("Paste YouTube URL");
    if (!url) return;

    let id = "";

    if (url.includes("watch?v=")) {
        id = url.split("watch?v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
        id = url.split("youtu.be/")[1];
    }

    if (!id) return alert("Invalid YouTube URL");

    const block = createBlock(`
        <iframe width="100%" height="420"
        src="https://www.youtube.com/embed/${id}"
        frameborder="0" allowfullscreen></iframe>
    `);

    editor.appendChild(block);

    saveStatus.innerText = "Video added ✔";
}

// =========================================================
// DRAG SORT SYSTEM (MODERN)
// =========================================================

editor.addEventListener("dragover", (e) => {
    e.preventDefault();

    const after = getAfterElement(editor, e.clientY);
    const dragging = document.querySelector(".dragging");

    if (!dragging) return;

    if (!after) {
        editor.appendChild(dragging);
    } else {
        editor.insertBefore(dragging, after);
    }
});

function getAfterElement(container, y) {

    const blocks = [...container.querySelectorAll(".media-block:not(.dragging)")];

    return blocks.reduce((closest, child) => {

        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        }

        return closest;

    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// =========================================================
// THUMBNAIL
// =========================================================

uploadBox.addEventListener("click", () => thumbnailInput.click());

thumbnailInput.addEventListener("change", () => {

    const file = thumbnailInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        thumbnailPreview.innerHTML = `
            <img src="${e.target.result}">
        `;

        saveStatus.innerText = "Thumbnail uploaded ✔";
    };

    reader.readAsDataURL(file);
});

// =========================================================
// HTML MODE
// =========================================================

let htmlMode = false;
let backupHTML = "";

function toggleHTMLMode() {

    if (!htmlMode) {
        backupHTML = editor.innerHTML;
        editor.textContent = backupHTML;
        htmlMode = true;
    } else {
        editor.innerHTML = editor.textContent;
        htmlMode = false;
    }
}

// =========================================================
// AUTO SAVE
// =========================================================

let timer;

function autoSave() {

    clearTimeout(timer);

    saveStatus.innerText = "Saving...";

    timer = setTimeout(() => {

        localStorage.setItem("draft", editor.innerHTML);
        localStorage.setItem("title", articleTitle.value);

        saveStatus.innerText = "Draft saved ✔";

    }, 800);
}

editor.addEventListener("input", autoSave);
articleTitle.addEventListener("input", autoSave);

// =========================================================
// INIT
// =========================================================

function init() {
    console.log("BLOCK EDITOR READY ✔");
}

init();