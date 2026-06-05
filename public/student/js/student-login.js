// =========================
// EXCEL YOU
// STUDENT LOGIN JS
// =========================

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ELEMENTS
    // =========================

    const loginForm =
        document.getElementById(
            "studentLoginForm"
        );

    const errorBox =
        document.getElementById(
            "errorBox"
        );

    const loginBtn =
        document.querySelector(
            ".login-btn"
        );

    const themeBtn =
        document.getElementById(
            "themeBtn"
        );
    console.log(data);
    console.log(data.student);
     console.log(data.student?.name);
    // =========================
    // AUTO REDIRECT
    // =========================

    const loggedIn =
    localStorage.getItem(
        "studentLoggedIn"
               );

    const student =
          localStorage.getItem(
             "student"
               );

    if (
            loggedIn === "true" &&
            student
        ) {

       window.location.href =
        "/student";

        return;
       }

    // =========================
    // ERROR FUNCTIONS
    // =========================

    function showError(message) {

        if (!errorBox) return;

        errorBox.textContent =
            message;

        errorBox.style.display =
            "block";
    }

    function hideError() {

        if (!errorBox) return;

        errorBox.style.display =
            "none";
    }

    // =========================
    // LOADING BUTTON
    // =========================

    function setLoading(state) {

        if (!loginBtn) return;

        if (state) {

            loginBtn.disabled =
                true;

            loginBtn.innerHTML =
                "⏳ Logging In...";

        } else {

            loginBtn.disabled =
                false;

            loginBtn.innerHTML =
                "🚀 Login";
        }
    }

    // =========================
    // LOGIN FORM
    // =========================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();

                hideError();

                const email =
                    document
                    .getElementById(
                        "email"
                    )
                    ?.value
                    .trim();

                const password =
                    document
                    .getElementById(
                        "password"
                    )
                    ?.value
                    .trim();

                if (!email || !password) {

                    showError(
                        "Please fill all fields."
                    );

                    return;
                }

                try {

                    setLoading(true);

               const response =
                    await fetch(
                    "/api/student/login",
                 {
                     method: "POST",

                    headers: {
                     "Content-Type":
                       "application/json"
                  },

                  body: JSON.stringify({
                   email,
                  password
                  })
                  }
                  );

                  const data =
                    await response.json();

                   console.log(
                     "LOGIN RESPONSE:",
                        data
                     );



                  if(data.success){

                     localStorage.setItem(
                        "studentLoggedIn",
                       "true"
                     );

                       localStorage.setItem(
                       "student",
                       JSON.stringify({
                          name: data.student?.name || "",
                         rank: data.student?.rank || "Beginner",
                         xp: data.student?.xp || 0,
                           level: data.student?.level || 1,
                           streak: data.student?.streak || 0,
                            avatar: data.student?.avatar || "/assets/anime/default.png"
                       })
                   );

                     window.location.href =
                    "/student";

                    } else {

                        showError(
                            data.message ||
                            "Invalid email or password."
                        );
                    }

                } catch (error) {

                    console.error(error);

                    showError(
                        "Server error. Please try again."
                    );

                } finally {

                    setLoading(false);
                }
            }
        );
    }

 // =========================
// THEME TOGGLE
// =========================

if (themeBtn) {

    const logo =
        document.getElementById(
            "siteLogo"
        );
     const loginBoxLogo =
         document.getElementById(
             "loginBoxLogo"
        );

    // LOAD SAVED THEME

const savedTheme =
    localStorage.getItem(
        "theme"
    ) || "dark";

document.body.setAttribute(
    "data-theme",
    savedTheme
);

// LOAD CORRECT LOGOS

if(savedTheme === "light"){

    if(logo){
        logo.src =
            "/assets/logo/full-logo.png";
    }

    if(loginBoxLogo){
        loginBoxLogo.src =
            "/assets/logo/full-logo.png";
    }
}

else{

    if(logo){
        logo.src =
            "/assets/logo/full-logo-white.png";
    }

    if(loginBoxLogo){
        loginBoxLogo.src =
            "/assets/logo/full-logo-white.png";
    }
if(savedTheme === "light"){

    themeBtn.innerHTML = "☀️";

}
else{

    themeBtn.innerHTML = "🌙";

}

}
    // TOGGLE THEME

    themeBtn.addEventListener(
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

            // CHANGE LOGO

          if (newTheme === "light") {

    themeBtn.innerHTML =
        "☀️";

    if (logo) {
        logo.src =
            "/assets/logo/full-logo.png";
    }

    if (loginBoxLogo) {
        loginBoxLogo.src =
            "/assets/logo/full-logo.png";
    }

} else {

    themeBtn.innerHTML =
        "🌙";

    if (logo) {
        logo.src =
            "/assets/logo/full-logo-white.png";
    }

    if (loginBoxLogo) {
        loginBoxLogo.src =
            "/assets/logo/full-logo-white.png";
    }

}
        }
    );
}


});