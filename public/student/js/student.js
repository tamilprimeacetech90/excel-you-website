// =========================
// EXCEL YOU STUDENT SYSTEM
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

const body =
    document.body;

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

const siteLogo =
    document.getElementById(
        "siteLogo"
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

const themeBtn =
    document.getElementById(
        "themeBtn"
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

    return String(str).replace(
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
// SHORT TEXT
// =========================

function shortText(
    text = "",
    limit = 100
){

    text = String(text);

    return text.length > limit

        ? text.substring(0, limit) + "..."

        : text;

}


// =========================
// LOADING UI
// =========================

function showLoading(container) {

    if(!container) return;

    container.innerHTML = `

        <div class="skeleton"></div>
        <div class="skeleton"></div>
        <div class="skeleton"></div>

    `;

}


// =========================
// EMPTY UI
// =========================

function emptyBox(message) {

    return `

        <div class="welcome-box">

            <p>

                ${escapeHTML(message)}

            </p>

        </div>

    `;

}


// =========================
// FETCH JSON
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

        // LANGUAGE FILTER

        allSubjects =
            subjects.filter(subject =>

                !subject.language ||

                subject.language === lang

            );

        renderSubjects(
            allSubjects
        );

        // RESET VIEW

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

    if(!subjectContainer) return;

    subjectContainer.innerHTML = "";

    if(
        !Array.isArray(subjects) ||
        !subjects.length
    ){

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

        // HIDE WELCOME

        welcomeBox?.classList.add(
            "hidden"
        );

        // SHOW TOPIC AREA

        topicContainer?.classList.remove(
            "hidden"
        );

        // HIDE LESSON

        lessonViewer?.classList.add(
            "hidden"
        );

        showLoading(
            topicsGrid
        );

        const topics =
            await fetchJSON(
                `/api/topics/${subjectId}`
            );

        allTopics = topics;

        renderTopics(
            topics
        );

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

    if(!topicsGrid) return;

    topicsGrid.innerHTML = "";

    if(
        !Array.isArray(topics) ||
        !topics.length
    ){

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

            topic.contentHTML

            ? String(topic.contentHTML)
                .replace(/<[^>]*>/g, "")

            : topic.content

            ? String(topic.content)
                .replace(/<[^>]*>/g, "")

            : "Interactive lesson available.";

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

        renderTopics(
            allTopics
        );

        // SHOW LESSON

        lessonViewer?.classList.remove(
            "hidden"
        );

        lessonTitle.innerHTML =
            "Loading Lesson...";

        lessonContent.innerHTML = `

            <div class="skeleton"></div>
            <div class="skeleton"></div>

        `;

        const topic =
            await fetchJSON(
                `/api/topic/${topicId}`
            );

        // TITLE

        lessonTitle.innerHTML =

            escapeHTML(
                topic.title || "Lesson"
            );

        // RESET CONTENT

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
        // BLOCK CONTENT
        // =========================

        else if(
            Array.isArray(
                topic.contentBlocks
            ) &&
            topic.contentBlocks.length
        ){

            topic.contentBlocks.forEach(block => {

                // HEADING

                if(block.type === "heading"){

                    lessonContent.innerHTML += `

                        <h2>

                            ${escapeHTML(block.value)}

                        </h2>

                    `;

                }

                // TEXT

                if(block.type === "text"){

                    lessonContent.innerHTML += `

                        <p>

                            ${escapeHTML(block.value)}

                        </p>

                    `;

                }

                // IMAGE

                if(block.type === "image"){

                    lessonContent.innerHTML += `

                        <img
                            src="${escapeHTML(block.value)}"
                            alt="Lesson Image"
                        >

                    `;

                }

                // VIDEO

                if(block.type === "video"){

                    lessonContent.innerHTML += `

                        <iframe
                            src="${escapeHTML(block.value)}"
                            frameborder="0"
                            allowfullscreen
                        ></iframe>

                    `;

                }

                // CODE

                if(block.type === "code"){

                    lessonContent.innerHTML += `

<pre>

<code>${escapeHTML(block.value)}</code>

</pre>

                    `;

                }

                // QUOTE

                if(block.type === "quote"){

                    lessonContent.innerHTML += `

                        <blockquote>

                            ${escapeHTML(block.value)}

                        </blockquote>

                    `;

                }

            });

        }

        // =========================
        // EMPTY CONTENT
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
// APPLY THEME
// =========================

function applyTheme(theme){

    body.setAttribute(
        "data-theme",
        theme
    );

    // BUTTON ICON

    if(themeBtn){

        themeBtn.innerHTML =

            theme === "dark"

            ? "☀️"

            : "🌙";

    }

    // LOGO

    if(siteLogo){

        siteLogo.src =

            theme === "dark"

            ? "/assets/logo/full-logo-white.png"

            : "/assets/logo/full-logo.png";

    }

}


// =========================
// THEME INIT
// =========================

const savedTheme =

    localStorage.getItem(
        "theme"
    ) || "dark";

applyTheme(savedTheme);


// =========================
// THEME TOGGLE
// =========================

if(themeBtn){

    themeBtn.addEventListener(
        "click",
        () => {

            const current =

                body.getAttribute(
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
// SEARCH EVENT
// =========================

if(searchInput){

    searchInput.addEventListener(
        "keyup",
        searchSubjects
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
// STUDENT LOGIN UI
// =========================

function updateStudentNavbar(){

    // GET STUDENT

    const studentData =
        localStorage.getItem(
            "student"
        );

    // NAV BUTTONS

    const loginBtn =
        document.querySelector(
            'a[href="/studentlogin.html"]'
        );

    const signupBtn =
        document.querySelector(
            'a[href="/studentsignup.html"]'
        );

    const profileBtn =
        document.querySelector(
            'a[href="/profile.html"]'
        );

    // IF NOT LOGGED IN

    if(!studentData){

        return;

    }

    // PARSE DATA

    const student =
        JSON.parse(studentData);

    // REMOVE LOGIN/SIGNUP

    if(loginBtn){

        loginBtn.remove();

    }

    if(signupBtn){

        signupBtn.remove();

    }

    // CREATE XP BADGE

    const controls =
        document.querySelector(
            ".controls"
        );

    const badge =
        document.createElement(
            "div"
        );

    badge.className =
        "xp-badge";

    badge.innerHTML = `

        ⚡ Lv.${student.level || 1}
        ${student.rank || "Scholar"}

    `;

    // INSERT BEFORE PROFILE

    if(profileBtn){

        controls.insertBefore(
            badge,
            profileBtn
        );

    }

    // LOGOUT BUTTON

    const logoutBtn =
        document.createElement(
            "button"
        );

    logoutBtn.className =
        "logout-btn";

    logoutBtn.innerHTML =
        "Logout";

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "student"
            );

            window.location.reload();

        }
    );

    controls.appendChild(
        logoutBtn
    );

}


// =========================
// INIT
// =========================

updateStudentNavbar();
// =========================
// CLOSE SIDEBAR
// =========================

document.addEventListener(
    "click",
    (e) => {

        if(

            window.innerWidth < 992 &&

            sidebar &&
            !sidebar.contains(e.target) &&

            mobileBtn &&
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

        // =====================
        // UPDATE LOGIN NAVBAR
        // =====================

        updateStudentNavbar();

    }
);