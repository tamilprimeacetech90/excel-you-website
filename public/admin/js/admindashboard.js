/* =========================================================
   EXCEL YOU ADMIN DASHBOARD JS
========================================================= */

/* =========================================================
   ELEMENTS
========================================================= */

const body =
document.body;

const themeToggle =
document.getElementById("themeToggle");

const sidebar =
document.getElementById("sidebar");

const mobileToggle =
document.getElementById("mobileToggle");

const searchInput =
document.querySelector(".search-box input");

const cards =
document.querySelectorAll(".card");

const articles =
document.querySelectorAll(".article");

/* =========================================================
   THEME SYSTEM
========================================================= */

function loadTheme(){

    const savedTheme =
    localStorage.getItem("excelyou-admin-theme");

    if(savedTheme === "dark"){

        body.classList.add("dark-theme");

        if(themeToggle){

            themeToggle.innerHTML = "☀️";
        }
    }
    else{

        body.classList.remove("dark-theme");

        if(themeToggle){

            themeToggle.innerHTML = "🌙";
        }
    }
}

function toggleTheme(){

    body.classList.toggle("dark-theme");

    const darkMode =
    body.classList.contains("dark-theme");

    localStorage.setItem(
        "excelyou-admin-theme",
        darkMode ? "dark" : "light"
    );

    if(themeToggle){

        themeToggle.innerHTML =
        darkMode ? "☀️" : "🌙";
    }
}

/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function toggleSidebar(){

    sidebar.classList.toggle("active");
}

function closeSidebar(){

    sidebar.classList.remove("active");
}

/* =========================================================
   SEARCH FILTER
========================================================= */

function setupSearch(){

    if(!searchInput) return;

    searchInput.addEventListener(
        "input",
        e => {

            const value =
            e.target.value.toLowerCase();

            articles.forEach(article => {

                const text =
                article.innerText.toLowerCase();

                if(text.includes(value)){

                    article.style.display = "flex";
                }
                else{

                    article.style.display = "none";
                }
            });
        }
    );
}

/* =========================================================
   CARD HOVER EFFECT
========================================================= */

function setupCardEffects(){

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

                if(window.innerWidth <= 900){

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

    sections.forEach((item,index) => {

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
    });
}

/* =========================================================
   RESPONSIVE FIX
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if(window.innerWidth > 900){

            sidebar.classList.remove(
                "active"
            );
        }
    }
);

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

// =========================
// LOGOUT
// =========================

function logout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );

    if (!confirmLogout) {
        return;
    }

    // clear local storage if needed
    localStorage.removeItem(
        "adminTheme"
    );

    // redirect login page
    window.location.href =
        "/login.html";
}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTheme();

        setupSearch();

        setupCardEffects();

        setupMenuActive();

        pageAnimation();

        console.log(
            "EXCEL YOU Dashboard Loaded ✔"
        );
    }
);
