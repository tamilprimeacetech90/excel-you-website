/* =========================================================
   EXCEL YOU ADMIN DASHBOARD JS
========================================================= */

/* =========================================================
   ELEMENTS
========================================================= */

const body =
document.body;

const themeToggle =
document.getElementById(
    "themeToggle"
);

const sidebar =
document.getElementById(
    "sidebar"
);

const mobileToggle =
document.getElementById(
    "mobileToggle"
);

const searchInput =
document.querySelector(
    ".search-box input"
);

const cards =
document.querySelectorAll(
    ".card"
);

const articles =
document.querySelectorAll(
    ".article"
);

const siteLogo =
document.getElementById(
    "siteLogo"
);

/* =========================================================
   THEME SYSTEM
========================================================= */

function applyTheme(theme){

    if(theme === "dark"){

        body.classList.add(
            "dark-theme"
        );

        if(themeToggle){

            themeToggle.innerHTML =
            "☀️";
        }

        // DARK LOGO

        if(siteLogo){

            siteLogo.src =
            "/assets/full-logo-white.png";
        }

    } else {

        body.classList.remove(
            "dark-theme"
        );

        if(themeToggle){

            themeToggle.innerHTML =
            "🌙";
        }

        // LIGHT LOGO

        if(siteLogo){

            siteLogo.src =
            "/assets/full-logo.png";
        }
    }
}

function loadTheme(){

    const savedTheme =
    localStorage.getItem(
        "excelyou-admin-theme"
    );

    applyTheme(
        savedTheme || "light"
    );
}

function toggleTheme(){

    const darkMode =
    body.classList.contains(
        "dark-theme"
    );

    const newTheme =
    darkMode
    ? "light"
    : "dark";

    applyTheme(
        newTheme
    );

    localStorage.setItem(
        "excelyou-admin-theme",
        newTheme
    );
}

/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function toggleSidebar(){

    if(!sidebar) return;

    sidebar.classList.toggle(
        "active"
    );
}

function closeSidebar(){

    if(!sidebar) return;

    sidebar.classList.remove(
        "active"
    );
}

/* =========================================================
   CLOSE SIDEBAR OUTSIDE CLICK
========================================================= */

document.addEventListener(
    "click",
    (e) => {

        if(

            window.innerWidth <= 900 &&

            sidebar &&

            !sidebar.contains(
                e.target
            ) &&

            mobileToggle &&

            !mobileToggle.contains(
                e.target
            )

        ){

            closeSidebar();
        }
    }
);

/* =========================================================
   SEARCH FILTER
========================================================= */

function setupSearch(){

    if(
        !searchInput ||
        !articles.length
    ) return;

    searchInput.addEventListener(
        "input",
        e => {

            const value =
            e.target.value.toLowerCase();

            articles.forEach(article => {

                const text =
                article.innerText.toLowerCase();

                if(
                    text.includes(value)
                ){

                    article.style.display =
                    "flex";

                } else {

                    article.style.display =
                    "none";
                }
            });
        }
    );
}

/* =========================================================
   CARD HOVER EFFECT
========================================================= */

function setupCardEffects(){

    if(!cards.length) return;

    cards.forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.style.transform =
                "translateY(-6px) scale(1.01)";
            }
        );

        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                "translateY(0px)";
            }
        );
    });
}

/* =========================================================
   ACTIVE MENU
========================================================= */

function setupMenuActive(){

    const menuLinks =
    document.querySelectorAll(
        ".sidebar-menu a"
    );

    if(!menuLinks.length) return;

    menuLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                menuLinks.forEach(item => {

                    item.classList.remove(
                        "active"
                    );
                });

                link.classList.add(
                    "active"
                );

                if(
                    window.innerWidth <= 900
                ){

                    closeSidebar();
                }
            }
        );
    });
}

/* =========================================================
   PAGE ANIMATION
========================================================= */

function pageAnimation(){

    const sections =
    document.querySelectorAll(
        ".card, .section"
    );

    if(!sections.length) return;

    sections.forEach(
        (item,index) => {

            item.style.opacity = "0";

            item.style.transform =
            "translateY(25px)";

            setTimeout(() => {

                item.style.transition =
                ".45s ease";

                item.style.opacity = "1";

                item.style.transform =
                "translateY(0px)";

            },index * 120);
        }
    );
}

/* =========================================================
   RESPONSIVE FIX
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if(
            window.innerWidth > 900 &&
            sidebar
        ){

            sidebar.classList.remove(
                "active"
            );
        }
    }
);

/* =========================================================
   LOGOUT
========================================================= */

function logout(){

    const confirmLogout =
    confirm(
        "Are you sure you want to logout?"
    );

    if(!confirmLogout){
        return;
    }

    // clear admin storage

    localStorage.removeItem(
        "adminToken"
    );

    sessionStorage.clear();

    // redirect

    window.location.href =
    "/login.html";
}

/* =========================================================
   EVENTS
========================================================= */

if(themeToggle){

    themeToggle.addEventListener(
        "click",
        toggleTheme
    );
}

if(mobileToggle){

    mobileToggle.addEventListener(
        "click",
        toggleSidebar
    );
}

/* =========================================================
   INIT
========================================================= */

function init(){

    loadTheme();

    setupSearch();

    setupCardEffects();

    setupMenuActive();

    pageAnimation();

    console.log(
        "EXCEL YOU Dashboard Loaded ✔"
    );
}

document.addEventListener(
    "DOMContentLoaded",
    init
);
