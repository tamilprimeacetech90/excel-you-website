// =========================
// GLOBAL
// =========================
let quill;
let saveTimer;


// =========================
// SECTION NAVIGATION
// =========================
function showSection(section) {

    const sections = [
        "dashboard",
        "subject",
        "topic",
        "posts",
        "block"
    ];

    sections.forEach(sec => {

        const el =
            document.getElementById(sec + "Section");

        if (el) {
            el.classList.add("hidden");
        }
    });

    const active =
        document.getElementById(section + "Section");

    if (active) {
        active.classList.remove("hidden");
    }
}


// =========================
// SAFE HTML
// =========================
function escapeHTML(str = "") {

    return str.replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[m]));
}


// =========================
// SUBJECT
// =========================
async function addSubject() {

    const name =
        document.getElementById("subjectName")
            .value.trim();

    const description =
        document.getElementById("subjectDesc")
            .value.trim();

    const language =
        document.getElementById("subjectLang")
            .value;

    if (!name) {

        alert("Subject name required ❌");

        return;
    }

    try {

        await fetch("/api/admin/subject", {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },

            body: new URLSearchParams({
                name,
                description,
                language
            })
        });

        alert("Subject Created ✔");

        document.getElementById("subjectName")
            .value = "";

        document.getElementById("subjectDesc")
            .value = "";

        loadSubjects();
        loadSubjectFilter();

    } catch (err) {

        console.error(err);

        alert("Failed to create subject ❌");
    }
}


function selectSubject(id) {

    document.getElementById("subjectId").value = id;

    showSection("topic");
}


// =========================
// LOAD SUBJECT FILTER
// =========================
async function loadSubjectFilter() {

    try {

        const res =
            await fetch("/api/admin/subjects");

        const subjects = await res.json();

        const select =
            document.getElementById("filterSubject");

        if (!select) return;

        select.innerHTML = `
            <option value="">
                All Subjects
            </option>
        `;

        subjects.forEach(sub => {

            select.innerHTML += `
                <option value="${sub._id}">
                    ${escapeHTML(sub.name)}
                </option>
            `;
        });

    } catch (err) {

        console.error(err);
    }
}


// =========================
// LOAD POSTS
// =========================
async function loadPosts() {

    try {

        const subjectId =
            document.getElementById("filterSubject")
                ?.value || "";

        const visibility =
            document.getElementById("filterVisibility")
                ?.value || "";

        const query =
            new URLSearchParams({
                subjectId,
                visibility
            });

        const res =
            await fetch(`/api/admin/posts?${query}`);

        const posts = await res.json();

        const container =
            document.getElementById("postsList");

        if (!container) return;

        container.innerHTML = "";

        if (!posts.length) {

            container.innerHTML = `
                <p>No posts found.</p>
            `;

            return;
        }

        posts.forEach(post => {

            const status =
                post.visibility === "public"
                    ? "Published"
                    : "Draft";

            const badgeClass =
                post.visibility === "public"
                    ? "published"
                    : "draft";

            container.innerHTML += `

                <div class="post-card">

                    <div class="post-top">

                        <div>

                            <div class="post-title">
                                ${escapeHTML(post.title)}
                            </div>

                            <div class="post-subject">
                                📘 ${escapeHTML(post.subjectId?.name || "Unknown")}
                            </div>

                        </div>

                        <span class="badge ${badgeClass}">
                            ${status}
                        </span>

                    </div>

                    <div class="post-actions">

                        <button
                            class="edit-btn"
                            onclick="editPost('${post._id}')">

                            ✏️ Edit

                        </button>

                        <button
                            class="delete-btn"
                            onclick="deletePost('${post._id}')">

                            🗑 Delete

                        </button>

                    </div>

                </div>
            `;
        });

    } catch (err) {

        console.error(err);
    }
}


// =========================
// EDIT POST
// =========================
function editPost(id) {

    document.getElementById("topicId").value = id;

    showSection("block");

    loadPreview(id);
}


// =========================
// DELETE POST
// =========================
async function deletePost(id) {

    const confirmDelete =
        confirm("Delete this post?");

    if (!confirmDelete) return;

    try {

        await fetch(`/api/admin/topic/${id}`, {
            method: "DELETE"
        });

        loadPosts();
        loadStats();
        loadSubjects();

    } catch (err) {

        console.error(err);

        alert("Delete failed ❌");
    }
}


// =========================
// SUBJECT LIST
// =========================
async function loadSubjects() {

    try {

        const res =
            await fetch("/api/admin/subjects");

        const subjects = await res.json();

        const container =
            document.getElementById("subjectList");

        if (!container) return;

        container.innerHTML = "";

        subjects.forEach(sub => {

            container.innerHTML += `

                <div class="subject-node">

                    <div
                        class="subject-header"
                        onclick="toggleTopics('${sub._id}')">

                        📘 ${escapeHTML(sub.name)}

                    </div>

                    <div
                        id="topics-${sub._id}"
                        class="topic-container hidden">
                    </div>

                </div>
            `;
        });

    } catch (err) {

        console.error(err);
    }
}


// =========================
// TOGGLE TOPICS
// =========================
async function toggleTopics(subjectId) {

    const container =
        document.getElementById(`topics-${subjectId}`);

    if (!container) return;

    if (!container.classList.contains("hidden")) {

        container.classList.add("hidden");

        container.innerHTML = "";

        return;
    }

    try {

        const res =
            await fetch(`/api/admin/topics/${subjectId}`);

        const topics = await res.json();

        container.innerHTML = "";

        topics.forEach(topic => {

            const badge =
                topic.visibility === "public"
                    ? "🟢"
                    : "🟡";

            container.innerHTML += `

                <div
                    class="topic-node"
                    onclick="selectTopic('${topic._id}')">

                    ${badge} 📖 ${escapeHTML(topic.title)}

                </div>
            `;
        });

        container.classList.remove("hidden");

    } catch (err) {

        console.error(err);
    }
}


// =========================
// CREATE TOPIC
// =========================
async function addTopic() {

    const title =
        document.getElementById("topicTitle")
            .value.trim();

    const subjectId =
        document.getElementById("subjectId")
            .value;

    const language =
        document.getElementById("topicLang")
            .value;

    if (!title || !subjectId) {

        alert("Title & Subject required ❌");

        return;
    }

    try {

        const res =
            await fetch("/api/admin/topic", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body: new URLSearchParams({
                    title,
                    subjectId,
                    language
                })
            });

        const topic = await res.json();

        alert("Topic Created ✔");

        document.getElementById("topicTitle")
            .value = "";

        loadSubjects();
        loadPosts();
        loadStats();

        if (topic?._id) {

            selectTopic(topic._id);
        }

    } catch (err) {

        console.error(err);

        alert("Failed to create topic ❌");
    }
}


function selectTopic(id) {

    document.getElementById("topicId").value = id;

    showSection("block");

    loadPreview(id);
}


// =========================
// LOAD PREVIEW
// =========================
async function loadPreview(topicId) {

    try {

        const res =
            await fetch(`/api/admin/topic/${topicId}`);

        const topic = await res.json();

        if (!topic) return;

        // TITLE
        const titleInput =
            document.getElementById("topicTitle");

        if (titleInput) {

            titleInput.value =
                topic.title || "";
        }

        // ✅ FIXED HTML SYSTEM
        if (quill) {

            const content =
                topic.contentHTML || "";

            quill.root.innerHTML = content;
        }

        // STATUS
        const badge =
            document.getElementById("statusBadge");

        const btn =
            document.getElementById("publishBtn");

        if (badge && btn) {

            if (topic.visibility === "public") {

                badge.innerText = "Published";

                badge.className =
                    "badge published";

                btn.innerText =
                    "🔒 Unpublish";

            } else {

                badge.innerText = "Draft";

                badge.className =
                    "badge draft";

                btn.innerText =
                    "🚀 Publish";
            }
        }

    } catch (err) {

        console.error(err);
    }
}


// =========================
// AUTO SAVE
// =========================
function setupAutoSave() {

    if (!quill) return;

    quill.on("text-change", () => {

        clearTimeout(saveTimer);

        const status =
            document.getElementById("saveStatus");

        if (status) {

            status.innerText = "Saving...";
        }

        saveTimer =
            setTimeout(autoSaveDraft, 1000);
    });
}


async function autoSaveDraft() {

    const topicId =
        document.getElementById("topicId")
            .value;

    if (!topicId) return;

    const content =
        quill.root.innerHTML;

    try {

        await fetch(`/api/admin/topic/${topicId}`, {

            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                contentHTML: content
            })
        });

        const status =
            document.getElementById("saveStatus");

        if (status) {

            const time =
                new Date().toLocaleTimeString();

            status.innerText =
                `Saved at ${time} ✔`;
        }

    } catch (err) {

        console.error(err);

        const status =
            document.getElementById("saveStatus");

        if (status) {

            status.innerText =
                "Save failed ❌";
        }
    }
}


// =========================
// TOGGLE PUBLISH
// =========================
async function togglePublish() {

    const topicId =
        document.getElementById("topicId")
            .value;

    if (!topicId) {

        alert("No topic selected ❌");

        return;
    }

    const btn =
        document.getElementById("publishBtn");

    try {

        if (btn.innerText.includes("Publish")) {

            await fetch(
                `/api/admin/topic/publish/${topicId}`,
                {
                    method: "POST"
                }
            );

        } else {

            await fetch(
                `/api/admin/topic/unpublish/${topicId}`,
                {
                    method: "POST"
                }
            );
        }

        loadPreview(topicId);
        loadPosts();
        loadSubjects();

    } catch (err) {

        console.error(err);
    }
}


// =========================
// DASHBOARD
// =========================
async function loadStats() {

    try {

        const res =
            await fetch("/api/admin/stats");

        const data = await res.json();

        const box =
            document.getElementById("statsBox");

        if (!box) return;

        box.innerHTML = `
            <div class="stats-grid">

                <div class="stat-card">
                    <div class="icon">📘</div>
                    <h3>Subjects</h3>
                    <h1 id="subjectsCount">0</h1>
                </div>

                <div class="stat-card">
                    <div class="icon">📖</div>
                    <h3>Topics</h3>
                    <h1 id="topicsCount">0</h1>
                </div>

            </div>
        `;

        animateCount(
            "subjectsCount",
            data.subjects
        );

        animateCount(
            "topicsCount",
            data.topics
        );

    } catch (err) {

        console.error(err);
    }
}


function animateCount(id, target) {

    let current = 0;

    const step =
        Math.ceil(target / 40);

    const interval =
        setInterval(() => {

            current += step;

            if (current >= target) {

                current = target;

                clearInterval(interval);
            }

            const el =
                document.getElementById(id);

            if (el) {

                el.innerText = current;
            }

        }, 20);
}


// =========================
// SIDEBAR
// =========================
function toggleSidebar() {

    document.querySelector(".sidebar")
        ?.classList.toggle("active");

    document.querySelector(".overlay")
        ?.classList.toggle("show");
}


function closeSidebar() {

    document.querySelector(".sidebar")
        ?.classList.remove("active");

    document.querySelector(".overlay")
        ?.classList.remove("show");
}


// =========================
// ACTIVE MENU
// =========================
function initSidebarActiveState() {

    document.querySelectorAll(".sidebar button")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                document.querySelectorAll(".sidebar button")
                    .forEach(b =>
                        b.classList.remove("active")
                    );

                btn.classList.add("active");
            });
        });
}


// =========================
// LOGOUT
// =========================
function logout() {

    window.location.href = "/logout";
}


// =========================
// INIT
// =========================
window.onload = () => {

    // QUILL
    Quill.register(
        "modules/imageUploader",
        ImageUploader
    );

    quill = new Quill("#editor", {

        theme: "snow",

        placeholder:
            "Start writing...",

        modules: {

            toolbar: [
                ["bold", "italic", "underline"],
                [{ header: [1, 2, 3, false] }],
                [{ list: "ordered" },
                 { list: "bullet" }],
                ["link", "image"],
                ["clean"]
            ],

            imageUploader: {

                upload: async (file) => {

                    const formData =
                        new FormData();

                    formData.append(
                        "image",
                        file
                    );

                    const res =
                        await fetch(
                            "/api/upload/image",
                            {
                                method: "POST",
                                body: formData
                            }
                        );

                    const data =
                        await res.json();

                    return data.url;
                }
            }
        }
    });

    showSection("subject");

    document.querySelector(".sidebar")
        ?.classList.remove("active");

    document.querySelector(".overlay")
        ?.classList.remove("show");

    loadSubjectFilter();
    loadPosts();
    loadSubjects();
    loadStats();

    initSidebarActiveState();

    setupAutoSave();
};