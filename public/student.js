// =========================
// EXCEL YOU STUDENT SYSTEM
// FULL UPGRADED VERSION
// student.js
// =========================


// =========================
// GLOBAL STATE
// =========================

let allSubjects = [];

let allTopics = [];

let activeSubjectId = null;

let activeTopicId = null;


// =========================
// ELEMENTS
// =========================

const subjectContainer =
    document.getElementById(
        "subjectContainer"
    );

const topicContainer =
    document.getElementById(
        "topicContainer"
    );

const topicsGrid =
    document.getElementById(
        "topicsGrid"
    );

const lessonViewer =
    document.getElementById(
        "lessonViewer"
    );

const lessonTitle =
    document.getElementById(
        "lessonTitle"
    );

const lessonContent =
    document.getElementById(
        "lessonContent"
    );

const welcomeBox =
    document.getElementById(
        "welcomeBox"
    );

const searchInput =
    document.getElementById(
        "search"
    );

const langSelect =
    document.getElementById(
        "lang"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );

const mobileBtn =
    document.getElementById(
        "mobileBtn"
    );


// =========================
// MOBILE SIDEBAR
// =========================

if(mobileBtn){

    mobileBtn.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "active"
            );

        }
    );

}


// =========================
// SAFE HTML
// =========================

function escapeHTML(str = "") {

    return str.replace(
        /[&<>"']/g,
        match => ({

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"

        }[match])
    );

}


// =========================
// FORMAT TEXT
// =========================

function shortText(
    text = "",
    limit = 100
){

    return text.length > limit

        ? text.substring(0, limit) + "..."

        : text;

}


// =========================
// SHOW LOADER
// =========================

function showLoading(container) {

    container.innerHTML = `

        <div class="loading-box">

            <div class="loader"></div>

            <p>
                Loading...
            </p>

        </div>

    `;

}


// =========================
// EMPTY BOX
// =========================

function emptyBox(message) {

    return `

        <div class="empty-box">

            ${message}

        </div>

    `;

}


// =========================
// API FETCH
// =========================

async function fetchJSON(url) {

    const res =
        await fetch(url);

    if(!res.ok){

        throw new Error(
            "Request Failed"
        );

    }

    return await res.json();

}


// =========================
// LOAD SUBJECTS
// =========================

async function loadSubjects() {

    try {

        showLoading(
            subjectContainer
        );

        const lang =
            langSelect?.value || "en";

        const subjects =
            await fetchJSON(
                "/api/subjects"
            );

        // FILTER LANGUAGE
        allSubjects =
            subjects.filter(subject =>

                !subject.language ||

                subject.language === lang

            );

        renderSubjects(allSubjects);

        // RESET UI
        welcomeBox?.classList.remove(
            "hidden"
        );

        topicContainer?.classList.add(
            "hidden"
        );

        lessonViewer?.classList.add(
            "hidden"
        );

    } catch(err) {

        console.error(
            "LOAD SUBJECTS ERROR:",
            err
        );

        subjectContainer.innerHTML =
            emptyBox(
                "❌ Failed to load subjects"
            );

    }

}


// =========================
// RENDER SUBJECTS
// =========================

function renderSubjects(subjects) {

    subjectContainer.innerHTML = "";

    if(!subjects.length){

        subjectContainer.innerHTML =
            emptyBox(
                "No subjects found."
            );

        return;

    }

    subjects.forEach(subject => {

        const activeClass =

            activeSubjectId === subject._id

            ? "active"

            : "";

        subjectContainer.innerHTML += `

            <div
                class="subject-card ${activeClass}"
                onclick="openSubject(
                    '${subject._id}'
                )"
            >

                <h3>
                    📘
                    ${escapeHTML(
                        subject.name
                    )}
                </h3>

                <p>
                    ${shortText(

                        escapeHTML(
                            subject.description ||
                            "No description available"
                        ),

                        90
                    )}
                </p>

            </div>

        `;

    });

}


// =========================
// OPEN SUBJECT
// =========================

async function openSubject(subjectId) {

    try {

        activeSubjectId =
            subjectId;

        activeTopicId = null;

        renderSubjects(
            allSubjects
        );

        welcomeBox?.classList.add(
            "hidden"
        );

        lessonViewer?.classList.add(
            "hidden"
        );

        topicContainer?.classList.remove(
            "hidden"
        );

        topicsGrid.innerHTML = "";

        showLoading(
            topicsGrid
        );

        const topics =
            await fetchJSON(
                `/api/topics/${subjectId}`
            );

        allTopics = topics;

        renderTopics(topics);

        // MOBILE AUTO CLOSE
        if(window.innerWidth < 992){

            sidebar.classList.remove(
                "active"
            );

        }

    } catch(err) {

        console.error(
            "OPEN SUBJECT ERROR:",
            err
        );

        topicsGrid.innerHTML =
            emptyBox(
                "❌ Failed to load topics"
            );

    }

}


// =========================
// RENDER TOPICS
// =========================

function renderTopics(topics) {

    topicsGrid.innerHTML = "";

    if(!topics.length){

        topicsGrid.innerHTML =
            emptyBox(
                "No topics available."
            );

        return;

    }

    topics.forEach(topic => {

        const activeClass =

            activeTopicId === topic._id

            ? "active"

            : "";

        const preview =

            topic.content

            ? topic.content
                .replace(/<[^>]*>/g, "")

            : "No content";

        topicsGrid.innerHTML += `

            <div
                class="topic-card ${activeClass}"
                onclick="openTopic(
                    '${topic._id}'
                )"
            >

                <h3>

                    📖
                    ${escapeHTML(
                        topic.title ||
                        "Untitled Topic"
                    )}

                </h3>

                <p>

                    ${shortText(
                        escapeHTML(preview),
                        100
                    )}

                </p>

            </div>

        `;

    });

}


// =========================
// OPEN TOPIC
// =========================

async function openTopic(topicId) {

    try {

        activeTopicId =
            topicId;

        renderTopics(allTopics);

        lessonViewer.classList.remove(
            "hidden"
        );

        lessonTitle.innerHTML =
            "Loading Lesson...";

        lessonContent.innerHTML = `

            <div class="loading-box">

                <div class="loader"></div>

                <p>
                    Loading lesson...
                </p>

            </div>

        `;

        const topic =
            await fetchJSON(
                `/api/topic/${topicId}`
            );

        // TITLE
        lessonTitle.innerHTML =

            topic.title ||
            "Lesson";

        // CONTENT RESET
        lessonContent.innerHTML = "";

        // =========================
        // HTML CONTENT
        // =========================

        if(topic.contentHTML){

            lessonContent.innerHTML =
                topic.contentHTML;

        }

        // =========================
        // NORMAL CONTENT
        // =========================

        else if(topic.content){

            lessonContent.innerHTML = `

                <div class="lesson-text">

                    ${topic.content}

                </div>

            `;

        }

        // =========================
        // BLOCK CONTENT SYSTEM
        // =========================

        else if(
            topic.contentBlocks &&
            topic.contentBlocks.length
        ){

            topic.contentBlocks.forEach(block => {

                // =================
                // HEADING
                // =================

                if(block.type === "heading"){

                    lessonContent.innerHTML += `

                        <h2>

                            ${block.value}

                        </h2>

                    `;

                }

                // =================
                // TEXT
                // =================

                if(block.type === "text"){

                    lessonContent.innerHTML += `

                        <p>

                            ${block.value}

                        </p>

                    `;

                }

                // =================
                // IMAGE
                // =================

                if(block.type === "image"){

                    lessonContent.innerHTML += `

                        <img
                            src="${block.value}"
                            alt="Lesson Image"
                            class="lesson-image"
                        >

                    `;

                }

                // =================
                // VIDEO
                // =================

                if(block.type === "video"){

                    lessonContent.innerHTML += `

                        <iframe
                            class="lesson-video"
                            src="${block.value}"
                            frameborder="0"
                            allowfullscreen
                        ></iframe>

                    `;

                }

                // =================
                // CODE
                // =================

                if(block.type === "code"){

                    lessonContent.innerHTML += `

                        <pre class="code-block">

<code>${escapeHTML(block.value)}</code>

                        </pre>

                    `;

                }

                // =================
                // QUOTE
                // =================

                if(block.type === "quote"){

                    lessonContent.innerHTML += `

                        <blockquote>

                            ${block.value}

                        </blockquote>

                    `;

                }

            });

        }

        // =========================
        // EMPTY
        // =========================

        else {

            lessonContent.innerHTML =
                emptyBox(
                    "No lesson content available."
                );

        }

        // =========================
        // SCROLL
        // =========================

        window.scrollTo({

            top:
                lessonViewer.offsetTop - 100,

            behavior: "smooth"

        });

    } catch(err) {

        console.error(
            "OPEN TOPIC ERROR:",
            err
        );

        lessonContent.innerHTML =
            emptyBox(
                "❌ Failed to load lesson"
            );

    }

}


// =========================
// SEARCH SUBJECTS
// =========================

function searchSubjects() {

    const value =

        searchInput.value
            .toLowerCase()
            .trim();

    const filtered =

        allSubjects.filter(subject =>

            subject.name
                .toLowerCase()
                .includes(value)

        );

    renderSubjects(filtered);

}


// =========================
// THEME SYSTEM
// =========================

const themeBtn =
    document.getElementById(
        "themeBtn"
    );

function applyTheme(theme){

    document.body.setAttribute(
        "data-theme",
        theme
    );

    if(themeBtn){

        themeBtn.innerHTML =

            theme === "dark"

            ? "☀️"

            : "🌙";

    }

}

const savedTheme =

    localStorage.getItem(
        "theme"
    ) || "dark";

applyTheme(savedTheme);

if(themeBtn){

    themeBtn.addEventListener(
        "click",
        () => {

            const current =

                document.body.getAttribute(
                    "data-theme"
                );

            const next =

                current === "dark"

                ? "light"

                : "dark";

            applyTheme(next);

            localStorage.setItem(
                "theme",
                next
            );

        }
    );

}


// =========================
// LANGUAGE CHANGE
// =========================

if(langSelect){

    langSelect.addEventListener(
        "change",
        loadSubjects
    );

}


// =========================
// SEARCH EVENT
// =========================

if(searchInput){

    searchInput.addEventListener(
        "keyup",
        searchSubjects
    );

}


// =========================
// CLOSE SIDEBAR OUTSIDE CLICK
// =========================

document.addEventListener(
    "click",
    (e) => {

        if(

            window.innerWidth < 992 &&

            !sidebar.contains(e.target) &&

            !mobileBtn.contains(e.target)

        ){

            sidebar.classList.remove(
                "active"
            );

        }

    }
);


// =========================
// INITIAL LOAD
// =========================

window.addEventListener(
    "load",
    () => {

        loadSubjects();

    }
);