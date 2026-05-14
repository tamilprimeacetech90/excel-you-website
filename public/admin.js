// =========================
// GLOBAL
// =========================
let quill;
let saveTimer;
let mainChart = null;

// =========================
// SECTION NAVIGATION
// =========================
function showSection(section) {

```
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

closeSidebar();
```

}

// =========================
// SAFE HTML
// =========================
function escapeHTML(str = "") {

```
return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}[m]));
```

}

// =========================
// SUBJECT
// =========================
async function addSubject() {

```
const name =
    document.getElementById("subjectName")
        ?.value.trim();

const description =
    document.getElementById("subjectDesc")
        ?.value.trim();

const language =
    document.getElementById("subjectLang")
        ?.value || "en";

if (!name) {

    alert("Subject name required ❌");
    return;
}

try {

    const res =
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

    if (!res.ok) {
        throw new Error("Failed");
    }

    alert("Subject Created ✔");

    document.getElementById("subjectName").value = "";
    document.getElementById("subjectDesc").value = "";

    await loadSubjects();
    await loadSubjectFilter();
    await loadStats();

} catch (err) {

    console.error(err);
    alert("Failed to create subject ❌");
}
```

}

function selectSubject(id) {

```
const subjectInput =
    document.getElementById("subjectId");

if (subjectInput) {
    subjectInput.value = id;
}

showSection("topic");
```

}

// =========================
// LOAD SUBJECT DROPDOWNS
// =========================
async function loadSubjectFilter() {

```
try {

    const res =
        await fetch("/api/admin/subjects");

    const subjects =
        await res.json();

    const filterSelect =
        document.getElementById("filterSubject");

    const subjectSelect =
        document.getElementById("subjectId");

    const editorSubject =
        document.getElementById("editorSubject");

    if (filterSelect) {

        filterSelect.innerHTML = `
            <option value="">
                All Subjects
            </option>
        `;
    }

    if (subjectSelect) {

        subjectSelect.innerHTML = `
            <option value="">
                Select Subject
            </option>
        `;
    }

    if (editorSubject) {

        editorSubject.innerHTML = `
            <option value="">
                Select Subject
            </option>
        `;
    }

    subjects.forEach(sub => {

        const option = `
            <option value="${sub._id}">
                ${escapeHTML(sub.name)}
            </option>
        `;

        if (filterSelect) {
            filterSelect.innerHTML += option;
        }

        if (subjectSelect) {
            subjectSelect.innerHTML += option;
        }

        if (editorSubject) {
            editorSubject.innerHTML += option;
        }
    });

} catch (err) {

    console.error(err);
    alert("Failed to load subjects ❌");
}
```

}

// =========================
// LOAD POSTS
// =========================
async function loadPosts() {

```
try {

    const subjectId =
        document.getElementById("filterSubject")
            ?.value || "";

    const visibility =
        document.getElementById("filterVisibility")
            ?.value || "";

    const search =
        document.getElementById("searchPost")
            ?.value.trim() || "";

    const query =
        new URLSearchParams({
            subjectId,
            visibility,
            search
        });

    const res =
        await fetch(
            `/api/admin/posts?${query.toString()}`
        );

    if (!res.ok) {
        throw new Error("Failed to load posts");
    }

    const posts =
        await res.json();

    const container =
        document.getElementById("postsList");

    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(posts) || !posts.length) {

        container.innerHTML = `
            <div class="empty-posts">
                No posts found.
            </div>
        `;

        return;
    }

    const html = posts.map(post => {

        const status =
            post.visibility === "public"
                ? "Published"
                : "Draft";

        const badgeClass =
            post.visibility === "public"
                ? "published"
                : "draft";

        const updatedDate =
            new Date(
                post.updatedAt || Date.now()
            ).toLocaleString();

        return `
            <div class="post-card">

                <div class="post-top">

                    <div class="post-info">

                        <div class="post-title">
                            ${escapeHTML(
                                post.title || "Untitled"
                            )}
                        </div>

                        <div class="post-subject">
                            📘 ${escapeHTML(
                                post.subjectId?.name || "Unknown"
                            )}
                        </div>

                        <div class="post-date">
                            Updated:
                            ${updatedDate}
                        </div>

                    </div>

                    <span class="badge ${badgeClass}">
                        ${status}
                    </span>

                </div>

                <div class="post-actions">

                    <button
                        class="edit-btn"
                        onclick="editPost('${post._id}')"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deletePost('${post._id}')"
                    >
                        🗑 Delete
                    </button>

                </div>

            </div>
        `;
    }).join("");

    container.innerHTML = html;

} catch (err) {

    console.error(err);

    const container =
        document.getElementById("postsList");

    if (container) {

        container.innerHTML = `
            <div class="empty-posts">
                Failed to load posts ❌
            </div>
        `;
    }
}
```

}

// =========================
// EDIT POST
// =========================
function editPost(id) {

```
const topicId =
    document.getElementById("topicId");

if (topicId) {
    topicId.value = id;
}

showSection("block");
loadPreview(id);
```

}

// =========================
// DELETE POST
// =========================
async function deletePost(id) {

```
const confirmDelete =
    confirm("Delete this post?");

if (!confirmDelete) return;

try {

    const res =
        await fetch(`/api/admin/topic/${id}`, {
            method: "DELETE"
        });

    if (!res.ok) {
        throw new Error("Delete failed");
    }

    await loadPosts();
    await loadStats();
    await loadSubjects();

} catch (err) {

    console.error(err);
    alert("Delete failed ❌");
}
```

}

// =========================
// LOAD SUBJECTS
// =========================
async function loadSubjects() {

```
try {

    const res =
        await fetch("/api/admin/subjects");

    if (!res.ok) {

        throw new Error(
            "Failed to load subjects"
        );
    }

    const subjects =
        await res.json();

    const container =
        document.getElementById("subjectList");

    if (!container) return;

    if (
        !Array.isArray(subjects) ||
        !subjects.length
    ) {

        container.innerHTML = `
            <div class="empty-posts">
                No subjects found.
            </div>
        `;

        return;
    }

    const html = subjects.map(sub => `

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

    `).join("");

    container.innerHTML = html;

} catch (err) {

    console.error(err);

    const container =
        document.getElementById("subjectList");

    if (container) {

        container.innerHTML = `
            <div class="empty-posts">
                Failed to load subjects ❌
            </div>
        `;
    }
}
```

}

// =========================
// TOGGLE TOPICS
// =========================
async function toggleTopics(subjectId) {

```
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
        await fetch(
            `/api/admin/topics/${subjectId}`
        );

    if (!res.ok) {
        throw new Error("Failed");
    }

    const topics =
        await res.json();

    const html = topics.map(topic => {

        const badge =
            topic.visibility === "public"
                ? "🟢"
                : "🟡";

        return `
            <div
                class="topic-node"
                onclick="selectTopic('${topic._id}')">

                ${badge}
                📖 ${escapeHTML(topic.title)}

            </div>
        `;
    }).join("");

    container.innerHTML = html;
    container.classList.remove("hidden");

} catch (err) {

    console.error(err);

    container.innerHTML = `
        <div class="empty-posts">
            Failed to load topics ❌
        </div>
    `;

    container.classList.remove("hidden");
}
```

}

// =========================
// CREATE TOPIC
// =========================
async function addTopic() {

```
const title =
    document.getElementById("topicTitle")
        ?.value.trim();

const subjectId =
    document.getElementById("subjectId")
        ?.value;

const language =
    document.getElementById("topicLang")
        ?.value || "en";

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

    const topic =
        await res.json();

    alert("Topic Created ✔");

    document.getElementById("topicTitle").value = "";

    await loadSubjects();
    await loadPosts();
    await loadStats();

    if (topic?._id) {
        selectTopic(topic._id);
    }

} catch (err) {

    console.error(err);
    alert("Failed to create topic ❌");
}
```

}

function selectTopic(id) {

```
const topicId =
    document.getElementById("topicId");

if (topicId) {
    topicId.value = id;
}

showSection("block");
loadPreview(id);
```

}

// =========================
// LOAD PREVIEW
// =========================
async function loadPreview(topicId) {

```
try {

    const res =
        await fetch(
            `/api/admin/topic/${topicId}`
        );

    const topic =
        await res.json();

    if (!topic) return;

    document.getElementById("topicId").value =
        topic._id || "";

    const editorTitle =
        document.getElementById("editorTitle");

    if (editorTitle) {

        editorTitle.value =
            topic.title || "";
    }

    const editorSubject =
        document.getElementById("editorSubject");

    if (
        editorSubject &&
        topic.subjectId?._id
    ) {

        editorSubject.value =
            topic.subjectId._id;
    }

    await loadTopicsForEditor(
        topic.subjectId?._id
    );

    const editorTopic =
        document.getElementById("editorTopic");

    if (editorTopic) {

        editorTopic.value =
            topic._id;
    }

    if (quill) {

        quill.root.innerHTML =
            topic.contentHTML || "";
    }

    const previewBox =
        document.getElementById("previewBox");

    if (previewBox) {

        previewBox.innerHTML =
            topic.contentHTML || "";
    }

    const badge =
        document.getElementById("statusBadge");

    const publishBtn =
        document.getElementById("publishBtn");

    if (badge && publishBtn) {

        if (topic.visibility === "public") {

            badge.innerText = "Published";
            badge.className =
                "badge published";

            publishBtn.innerText =
                "🔒 Unpublish";

        } else {

            badge.innerText = "Draft";
            badge.className =
                "badge draft";

            publishBtn.innerText =
                "🚀 Publish";
        }
    }

    showSection("block");

} catch (err) {

    console.error(err);
    alert("Failed to load article ❌");
}
```

}

// =========================
// LOAD TOPICS FOR EDITOR
// =========================
async function loadTopicsForEditor(
selectedSubjectId = null
) {

```
const subjectId =
    selectedSubjectId ||
    document.getElementById("editorSubject")
        ?.value;

const editorTopic =
    document.getElementById("editorTopic");

if (!editorTopic) return;

editorTopic.innerHTML = `
    <option value="">
        Select Article
    </option>
`;

if (!subjectId) return;

try {

    const res =
        await fetch(
            `/api/admin/topics/${subjectId}`
        );

    const topics =
        await res.json();

    topics.forEach(topic => {

        editorTopic.innerHTML += `
            <option value="${topic._id}">
                ${escapeHTML(topic.title)}
            </option>
        `;
    });

} catch (err) {

    console.error(err);
    alert("Failed to load articles ❌");
}
```

}

// =========================
// OPEN SELECTED TOPIC
// =========================
function openSelectedTopic() {

```
const topicId =
    document.getElementById("editorTopic")
        ?.value;

if (!topicId) return;

loadPreview(topicId);
```

}

// =========================
// CREATE NEW ARTICLE
// =========================
async function createNewArticle() {

```
const subjectId =
    document.getElementById("editorSubject")
        ?.value;

const title =
    document.getElementById("editorTitle")
        ?.value.trim();

if (!subjectId) {

    alert("Select subject ❌");
    return;
}

if (!title) {

    alert("Enter article title ❌");
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
                language: "en"
            })
        });

    const topic =
        await res.json();

    if (!topic?._id) {

        alert("Failed to create article ❌");
        return;
    }

    document.getElementById("topicId")
        .value = topic._id;

    if (quill) {
        quill.root.innerHTML = "";
    }

    await loadTopicsForEditor(subjectId);

    document.getElementById("editorTopic")
        .value = topic._id;

    await loadPreview(topic._id);

    await loadPosts();
    await loadSubjects();
    await loadStats();

    alert("Article created ✔");

} catch (err) {

    console.error(err);
    alert("Failed to create article ❌");
}
```

}

// =========================
// AUTO SAVE SETUP
// =========================
function setupAutoSave() {

```
if (!quill) return;

quill.on("text-change", () => {

    clearTimeout(saveTimer);

    const status =
        document.getElementById("saveStatus");

    if (status) {
        status.innerText = "Saving...";
    }

    saveTimer =
        setTimeout(() => {
            autoSaveDraft();
        }, 1000);
});

const titleInput =
    document.getElementById("editorTitle");

if (titleInput) {

    titleInput.addEventListener("input", () => {

        clearTimeout(saveTimer);

        const status =
            document.getElementById("saveStatus");

        if (status) {
            status.innerText = "Saving...";
        }

        saveTimer =
            setTimeout(() => {
                autoSaveDraft();
            }, 1000);
    });
}
```

}

// =========================
// AUTO SAVE
// =========================
async function autoSaveDraft() {

```
const topicId =
    document.getElementById("topicId")
        ?.value;

if (!topicId || !quill) return;

const contentHTML =
    quill.root.innerHTML;

const title =
    document.getElementById("editorTitle")
        ?.value.trim() || "Untitled";

try {

    const res =
        await fetch(
            `/api/admin/topic/${topicId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    title,
                    contentHTML
                })
            }
        );

    if (!res.ok) {
        throw new Error("Save failed");
    }

    const previewBox =
        document.getElementById("previewBox");

    if (previewBox) {
        previewBox.innerHTML = contentHTML;
    }

    const status =
        document.getElementById("saveStatus");

    if (status) {

        status.innerText =
            `Saved ✔ ${new Date()
                .toLocaleTimeString()}`;
    }

    loadPosts();

} catch (err) {

    console.error(err);

    const status =
        document.getElementById("saveStatus");

    if (status) {
        status.innerText = "Save failed ❌";
    }
}
```

}

// =========================
// TOGGLE PUBLISH
// =========================
async function togglePublish() {

```
const topicId =
    document.getElementById("topicId")
        ?.value;

if (!topicId) {

    alert("No topic selected ❌");
    return;
}

const btn =
    document.getElementById("publishBtn");

try {

    const isPublish =
        btn.innerText.includes("Publish");

    const endpoint =
        isPublish
            ? `/api/admin/topic/publish/${topicId}`
            : `/api/admin/topic/unpublish/${topicId}`;

    const res =
        await fetch(endpoint, {
            method: "POST"
        });

    if (!res.ok) {
        throw new Error("Publish failed");
    }

    await loadPreview(topicId);
    await loadPosts();
    await loadSubjects();

} catch (err) {

    console.error(err);
    alert("Action failed ❌");
}
```

}

// =========================
// DASHBOARD
// =========================
async function loadStats() {

```
try {

    const res =
        await fetch("/api/admin/stats");

    const data =
        await res.json();

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
        data.subjects || 0
    );

    animateCount(
        "topicsCount",
        data.topics || 0
    );

    renderChart(data);

} catch (err) {

    console.error(err);
}
```

}

// =========================
// CHART
// =========================
function renderChart(data) {

```
const canvas =
    document.getElementById("mainChart");

if (!canvas) return;

const ctx = canvas.getContext("2d");

if (mainChart) {
    mainChart.destroy();
}

mainChart = new Chart(ctx, {

    type: "bar",

    data: {

        labels: [
            "Subjects",
            "Topics"
        ],

        datasets: [{
            label: "CMS Data",

            data: [
                data.subjects || 0,
                data.topics || 0
            ],

            borderWidth: 2
        }]
    },

    options: {

        responsive: true,

        plugins: {
            legend: {
                display: false
            }
        }
    }
});
```

}

// =========================
// ANIMATE COUNT
// =========================
function animateCount(id, target) {

```
let current = 0;

const step =
    Math.max(1, Math.ceil(target / 40));

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
```

}

// =========================
// SIDEBAR
// =========================
function toggleSidebar() {

```
document.querySelector(".sidebar")
    ?.classList.toggle("active");

document.getElementById("overlay")
    ?.classList.toggle("show");
```

}

function closeSidebar() {

```
document.querySelector(".sidebar")
    ?.classList.remove("active");

document.getElementById("overlay")
    ?.classList.remove("show");
```

}

// =========================
// ACTIVE MENU
// =========================
function initSidebarActiveState() {

```
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
```

}

// =========================
// LOGOUT
// =========================
function logout() {

```
window.location.href = "/logout";
```

}

// =========================
// IMAGE INPUT UPLOAD
// =========================
function setupImageUpload() {

```
const imageInput =
    document.getElementById("imageUpload");

if (!imageInput || !quill) return;

imageInput.addEventListener("change", async e => {

    const file =
        e.target.files[0];

    if (!file) return;

    try {

        const formData =
            new FormData();

        formData.append(
            "image",
            file
        );

        const res =
            await fetch("/api/upload", {

                method: "POST",
                body: formData
            });

        const data =
            await res.json();

        if (!data?.url) {
            throw new Error("Upload failed");
        }

        const range =
            quill.getSelection(true);

        quill.insertEmbed(
            range.index,
            "image",
            data.url
        );

    } catch (err) {

        console.error(err);
        alert("Image upload failed ❌");
    }
});
```

}

// =========================
// WINDOW INIT
// =========================
window.onload = async () => {

```
try {

    if (typeof Quill === "undefined") {
        throw new Error("Quill not loaded");
    }

    if (typeof ImageUploader !== "undefined") {

        Quill.register(
            "modules/imageUploader",
            ImageUploader
        );
    }

    quill = new Quill("#editor", {

        theme: "snow",

        placeholder:
            "Write your article content here...",

        modules: {

            toolbar: [

                [{ font: [] }],

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
                    { script: "sub" },
                    { script: "super" }
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
                    { direction: "rtl" }
                ],

                [
                    { align: [] }
                ],

                [
                    "blockquote",
                    "code-block"
                ],

                [
                    "link",
                    "image",
                    "video",
                    "formula"
                ],

                ["clean"]
            ],

            ...(typeof ImageUploader !== "undefined" && {

                imageUploader: {

                    upload: async file => {

                        try {

                            const formData =
                                new FormData();

                            formData.append(
                                "image",
                                file
                            );

                            const res =
                                await fetch(
                                    "/api/upload",
                                    {
                                        method: "POST",
                                        body: formData
                                    }
                                );

                            if (!res.ok) {
                                throw new Error("Upload failed");
                            }

                            const data =
                                await res.json();

                            if (!data?.url) {
                                throw new Error("Invalid URL");
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
            })
        }
    });

    showSection("dashboard");

    closeSidebar();

    await Promise.all([

        loadSubjectFilter(),
        loadPosts(),
        loadSubjects(),
        loadStats()
    ]);

    initSidebarActiveState();

    setupAutoSave();

    setupImageUpload();

    console.log(
        "Admin panel loaded successfully ✔"
    );

} catch (err) {

    console.error(err);

    alert(
        "Application failed to load ❌"
    );
}
```

};
