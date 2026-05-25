// =========================
// EXCEL YOU PROFILE SYSTEM
// profile.js
// =========================


// =========================
// ELEMENTS
// =========================

const body =
    document.body;

const themeBtn =
    document.getElementById(
        "themeBtn"
    );

const siteLogo =
    document.getElementById(
        "siteLogo"
    );


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

    // LOGO CHANGE

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
// XP ANIMATION
// =========================

window.addEventListener(
    "load",
    () => {

        const fills =
            document.querySelectorAll(
                ".progress-fill, .xp-fill"
            );

        fills.forEach(fill => {

            const width =
                fill.style.width;

            fill.style.width = "0%";

            setTimeout(() => {

                fill.style.width =
                    width;

            }, 300);

        });

    }
);


// =========================
// FUTURE USER DATA
// =========================

// Later we will connect:
//
// - student login
// - mongodb profile
// - xp system
// - rewards
// - streak system
// - quiz stats
// - live arena
// - anime avatar system
//
// using API routes


// =========================
// DEMO ARENA BUTTON
// =========================

const arenaBtn =
    document.querySelector(
        ".arena-btn"
    );

if(arenaBtn){

    arenaBtn.addEventListener(
        "click",
        () => {

            alert(
                "⚔️ Live Quiz Arena Coming Soon!"
            );

        }
    );

}


// =========================
// DEMO PROFILE LOADER
// =========================

console.log(
    "✅ EXCEL YOU PROFILE LOADED"
);