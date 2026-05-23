// =========================
// GLOBAL VARIABLES
// =========================
let saveTimer = null;
let isSaving = false;
let hasUnsavedChanges = false;
const AUTO_SAVE_DELAY = 2000;

const elements = {};

// =========================
// INIT ELEMENTS
// =========================
function initElements() {
    elements.sidebar = document.getElementById("sidebar");
    elements.overlay = document.getElementById("overlay");
    elements.menuBtn = document.querySelector(".menu-btn");
    elements.postsList = document.getElementById("postsList");
    elements.previewBox = document.getElementById("previewBox");
    elements.subjectList = document.getElementById("subjectList");
    elements.statsBox = document.getElementById("statsBox");
    elements.topicId = document.getElementById("topicId");
    elements.editorTitle = document.getElementById("editorTitle");
    elements.publishBtn = document.getElementById("publishBtn");
    elements.statusBadge = document.getElementById("statusBadge");
    elements.saveStatus = document.getElementById("saveStatus");
    elements.imageUpload = document.getElementById("imageUpload");
    elements.themeToggle = document.getElementById("themeToggle");
    elements.editor = document.getElementById("editor");   // ← New Editor
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
    elements.menuBtn?.addEventListener("click", toggleSidebar);
    elements.overlay?.addEventListener("click", closeSidebar);
}

// =========================
// SECTION SWITCH
// =========================
function showSection(section) {
    const sections = {
        dashboard: document.getElementById("dashboardSection"),
        subject: document.getElementById("subjectSection"),
        topic: document.getElementById("topicSection"),
        posts: document.getElementById("postsSection"),
        block: document.getElementById("blockSection")
    };

    Object.values(sections).forEach(sec => sec?.classList.add("hidden"));
    sections[section]?.classList.remove("hidden");
    closeSidebar();
}

// =========================
// MODERN EDITOR FUNCTIONS
// =========================
function execCmd(command, value = null) {
    if (elements.editor) {
        document.execCommand(command, false, value);
        elements.editor.focus();
        hasUnsavedChanges = true;
        startAutoSave();
    }
}

function insertImage() {
    const url = prompt("Enter image URL:");
    if (url && elements.editor) {
        document.execCommand('insertImage', false, url);
        hasUnsavedChanges = true;
        startAutoSave();
    }
}

function insertLink() {
    const url = prompt("Enter link URL:");
    if (url && elements.editor) {
        document.execCommand('createLink', false, url);
        hasUnsavedChanges = true;
        startAutoSave();
    }
}

function toggleHTML() {
    if (!elements.editor) return;
    
    if (elements.editor.contentEditable === "true") {
        elements.editor.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit;">${elements.editor.innerHTML}</pre>`;
        elements.editor.contentEditable = "false";
    } else {
        elements.editor.innerHTML = elements.editor.textContent;
        elements.editor.contentEditable = "true";
    }
}

// =========================
// AUTO SAVE
// =========================
function startAutoSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, AUTO_SAVE_DELAY);
}

async function saveDraft() {
    if (isSaving || !hasUnsavedChanges) return;
    
    isSaving = true;
    if (elements.saveStatus) elements.saveStatus.textContent = "Saving...";

    try {
        const articleData = {
            title: elements.editorTitle ? elements.editorTitle.value : "",
            content: elements.editor ? elements.editor.innerHTML : "",
            subject: document.getElementById("editorSubject")?.value,
            topic: document.getElementById("editorTopic")?.value,
            tags: document.getElementById("tags")?.value.split(',').map(t => t.trim()) || [],
            status: "draft"
        };

        const response = await fetch('/api/articles/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articleData)
        });

        if (response.ok) {
            hasUnsavedChanges = false;
            if (elements.saveStatus) elements.saveStatus.textContent = "Saved ✔";
        }
    } catch (err) {
        console.error(err);
        if (elements.saveStatus) elements.saveStatus.textContent = "Save failed";
    } finally {
        isSaving = false;
    }
}

// =========================
// PUBLISH
// =========================
function publishPost() {
    if (confirm("Are you sure you want to publish this article?")) {
        // You can modify status to "published" here
        alert("🎉 Article Published Successfully!");
        // saveDraft() with published status
    }
}

// =========================
// THEME
// =========================
function setupTheme() {
    const savedTheme = localStorage.getItem("adminTheme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        if (elements.themeToggle) elements.themeToggle.innerHTML = "☀️";
    }

    elements.themeToggle?.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        const isDark = document.body.classList.contains("dark-theme");
        elements.themeToggle.innerHTML = isDark ? "☀️" : "🌙";
        localStorage.setItem("adminTheme", isDark ? "dark" : "light");
    });
}

// =========================
// PLACEHOLDER FUNCTIONS
// =========================
function addSubject() { alert("Subject added!"); }
function addTopic() { alert("Topic added!"); }
function loadPosts() { console.log("Loading posts..."); }
function openSelectedTopic() { console.log("Opening topic..."); }
function createNewArticle() { alert("New article created!"); }
function logout() { alert("Logged out!"); }

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
    try {
        initElements();
        setupSidebar();
        setupTheme();

        // Auto save on typing
        if (elements.editor) {
            elements.editor.addEventListener('keyup', () => {
                hasUnsavedChanges = true;
                startAutoSave();
            });
            elements.editor.addEventListener('paste', () => {
                hasUnsavedChanges = true;
                startAutoSave();
            });
        }

        if (elements.editorTitle) {
            elements.editorTitle.addEventListener('input', () => {
                hasUnsavedChanges = true;
                startAutoSave();
            });
        }

        showSection("dashboard");
        console.log("✅ EXCEL YOU Admin Panel Loaded Successfully");
        
    } catch (err) {
        console.error("Admin initialization failed:", err);
    }
});