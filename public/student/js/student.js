// =========================
// EXCEL YOU
// student.js
// SUBJECT HOME PAGE
// =========================


// =========================
// GLOBALS
// =========================

let allSubjects = [];


// =========================
// ELEMENTS
// =========================

const subjectContainer =
    document.getElementById(
        "subjectContainer"
    );

const searchInput =
    document.getElementById(
        "search"
    );

const subjectSelect =
    document.getElementById(
        "subjectSelect"
    );

const themeBtn =
    document.getElementById(
        "themeBtn"
    );


// =========================
// LOAD SUBJECTS
// =========================

async function loadSubjects(){

    try {

        // FETCH API

        const response =
            await fetch(
                "/api/subjects"
            );

        const data =
            await response.json();

        // SAVE

        allSubjects = data;

        // RENDER

        renderSubjects(
            allSubjects
        );

        // DROPDOWN

        populateSubjectSelect(
            allSubjects
        );

    } catch(err){

        console.error(
            "❌ SUBJECT LOAD ERROR:",
            err
        );

        subjectContainer.innerHTML = `

            <div class="empty-box">

                Failed to load subjects

            </div>

        `;

    }

}


// =========================
// RENDER SUBJECTS
// =========================

function renderSubjects(subjects){

    // RESET

    subjectContainer.innerHTML = "";

    // EMPTY

    if(!subjects.length){

        subjectContainer.innerHTML = `

            <div class="empty-box">

                No subjects found

            </div>

        `;

        return;

    }

    // LOOP

    subjects.forEach(subject => {

        // TILE

        const tile =
            document.createElement(
                "div"
            );

        tile.className =
            "subject-tile";

        // IMAGE

        const image =

            subject.image ||

            "/assets/default-subject.jpg";

        // HTML

        tile.innerHTML = `

            <!-- SUBJECT IMAGE -->

            <div class="subject-image-wrap">

                <img
                    src="${image}"
                    alt="${subject.name}"
                    class="subject-image"
                >

                <!-- INFO -->

                <button
                    class="info-btn"
                >
                    ⓘ
                </button>

            </div>

            <!-- SUBJECT NAME -->

            <div class="subject-bottom">

                <h3>

                    ${subject.name}

                </h3>

            </div>

            <!-- INFO POPUP -->

            <div class="subject-info">

                <h4>

                    ${subject.name}

                </h4>

                <p>

                    ${
                        subject.description ||

                        "No description available."
                    }

                </p>

            </div>

        `;

        // OPEN SUBJECT PAGE

        tile.addEventListener(
            "click",
            (e) => {

                // PREVENT INFO CLICK

                if(
                    e.target.classList.contains(
                        "info-btn"
                    )
                ){

                    return;

                }

                // SUBJECT SLUG

                const slug =

                    createSlug(
                        subject.name
                    );

                // REDIRECT

                window.location.href =

                    `/subject/${slug}`;

            }
        );

        // INFO BUTTON

        const infoBtn =
            tile.querySelector(
                ".info-btn"
            );

        const infoPopup =
            tile.querySelector(
                ".subject-info"
            );

        infoBtn.addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                // CLOSE OTHERS

                document
                    .querySelectorAll(
                        ".subject-info"
                    )
                    .forEach(popup => {

                        if(
                            popup !== infoPopup
                        ){

                            popup.classList.remove(
                                "active"
                            );

                        }

                    });

                // TOGGLE

                infoPopup.classList.toggle(
                    "active"
                );

            }
        );

        // APPEND

        subjectContainer.appendChild(
            tile
        );

    });

}


// =========================
// SUBJECT DROPDOWN
// =========================

function populateSubjectSelect(subjects){

    // RESET

    subjectSelect.innerHTML = `

        <option value="">
            Select Subject
        </option>

    `;

    // LOOP

    subjects.forEach(subject => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            subject.name;

        option.innerHTML =
            subject.name;

        subjectSelect.appendChild(
            option
        );

    });

}


// =========================
// SEARCH SUBJECTS
// =========================

function searchSubjects(){

    // VALUES

    const searchValue =

        searchInput.value
            .toLowerCase()
            .trim();

    const selectedValue =

        subjectSelect.value
            .toLowerCase()
            .trim();

    // FILTER

    const filtered =

        allSubjects.filter(subject => {

            const name =

                subject.name
                    .toLowerCase();

            return (

                name.includes(
                    searchValue
                ) &&

                (
                    selectedValue === "" ||

                    name.includes(
                        selectedValue
                    )
                )

            );

        });

    // RENDER

    renderSubjects(filtered);

}


// =========================
// CREATE SLUG
// =========================

function createSlug(text){

    return text

        .toLowerCase()

        .replace(/[^a-z0-9]+/g, "-")

        .replace(/(^-|-$)/g, "");

}


// =========================
// THEME INIT
// =========================

function initTheme(){

    const savedTheme =

        localStorage.getItem(
            "theme"
        ) || "dark";

    document.body.setAttribute(
        "data-theme",
        savedTheme
    );

    updateThemeIcon();

}


// =========================
// UPDATE ICON
// =========================

function updateThemeIcon(){

    const currentTheme =

        document.body.getAttribute(
            "data-theme"
        );

    if(currentTheme === "dark"){

        themeBtn.innerHTML = "☀️";

    } else {

        themeBtn.innerHTML = "🌙";

    }

}


// =========================
// THEME TOGGLE
// =========================

themeBtn?.addEventListener(
    "click",
    () => {

        const currentTheme =

            document.body.getAttribute(
                "data-theme"
            );

        const newTheme =

            currentTheme === "dark"
                ? "light"
                : "dark";

        document.body.setAttribute(
            "data-theme",
            newTheme
        );

        localStorage.setItem(
            "theme",
            newTheme
        );

        updateThemeIcon();

    }
);


// =========================
// SEARCH EVENTS
// =========================

searchInput?.addEventListener(
    "keyup",
    searchSubjects
);

subjectSelect?.addEventListener(
    "change",
    searchSubjects
);


// =========================
// LOGIN STATUS UI
// =========================

function updateStudentNavbar(){

    // STUDENT DATA

    const studentData =

        localStorage.getItem(
            "student"
        );

    // NAV ELEMENTS

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

    // NOT LOGGED

    if(!studentData){

        return;

    }

    // PARSE

    const student =
        JSON.parse(studentData);

    // REMOVE LOGIN

    if(loginBtn){

        loginBtn.remove();

    }

    // REMOVE SIGNUP

    if(signupBtn){

        signupBtn.remove();

    }

    // TOPBAR

    const topbarRight =
        document.querySelector(
            ".topbar-right"
        );

    // XP BADGE

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

    // INSERT

    if(profileBtn){

        topbarRight.insertBefore(
            badge,
            profileBtn
        );

    }

    // LOGOUT

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

    topbarRight.appendChild(
        logoutBtn
    );

    // RIGHT SIDEBAR UPDATE

    const loginCard =
        document.querySelector(
            ".login-card"
        );

    if(loginCard){

        loginCard.innerHTML = `

            <div class="anime-avatar">

                ⚔️

            </div>

            <h2>

                Welcome Back,
                ${student.name || "Scholar"}

            </h2>

            <p>

                Continue your path toward
                becoming a Celestial Immortal.

            </p>

            <div class="benefit-list">

                <div class="benefit-item">

                    ⚡ XP:
                    ${student.xp || 0}

                </div>

                <div class="benefit-item">

                    👑 Rank:
                    ${student.rank || "Scholar"}

                </div>

                <div class="benefit-item">

                    📈 Level:
                    ${student.level || 1}

                </div>

                <div class="benefit-item">

                    🔥 Daily Streak:
                    ${student.streak || 0} Days

                </div>

            </div>

        `;

    }

}


// =========================
// CLOSE INFO POPUPS
// =========================

document.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                ".subject-info"
            )
            .forEach(popup => {

                popup.classList.remove(
                    "active"
                );

            });

    }
);


// =========================
// INITIAL LOAD
// =========================

window.addEventListener(
    "load",
    () => {

        // SUBJECTS

        loadSubjects();

        // THEME

        initTheme();

        // LOGIN UI

        updateStudentNavbar();

    }
);