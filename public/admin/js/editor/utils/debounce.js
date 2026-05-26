/* =========================================================
   EXCEL YOU DEBOUNCE UTILITY
========================================================= */

/* =========================================================
   BASIC DEBOUNCE
========================================================= */

function debounce(

    callback,

    delay = 300

) {

    let timer;

    return function (...args) {

        // Remove previous timer
        clearTimeout(timer);

        // Create new timer
        timer = setTimeout(() => {

            callback.apply(
                this,
                args
            );

        }, delay);
    };
}

/* =========================================================
   ADVANCED DEBOUNCE
========================================================= */

function advancedDebounce({

    callback,

    delay = 300,

    immediate = false

}) {

    let timer;

    return function (...args) {

        const callNow =
            immediate && !timer;

        clearTimeout(timer);

        timer = setTimeout(() => {

            timer = null;

            if (!immediate) {

                callback.apply(
                    this,
                    args
                );
            }

        }, delay);

        if (callNow) {

            callback.apply(
                this,
                args
            );
        }
    };
}

/* =========================================================
   PROMISE DEBOUNCE
========================================================= */

function promiseDebounce(

    callback,

    delay = 300

) {

    let timer;

    return (...args) => {

        return new Promise(

            resolve => {

                clearTimeout(
                    timer
                );

                timer = setTimeout(
                    async () => {

                        const result =
                            await callback(
                                ...args
                            );

                        resolve(
                            result
                        );

                    },

                    delay
                );
            }
        );
    };
}

/* =========================================================
   CANCELABLE DEBOUNCE
========================================================= */

function cancelableDebounce(

    callback,

    delay = 300

) {

    let timer;

    function debounced(...args) {

        clearTimeout(
            timer
        );

        timer = setTimeout(() => {

            callback.apply(
                this,
                args
            );

        }, delay);
    }

    // Cancel manually
    debounced.cancel = () => {

        clearTimeout(
            timer
        );
    };

    return debounced;
}

/* =========================================================
   THROTTLE
========================================================= */

function throttle(

    callback,

    delay = 300

) {

    let waiting = false;

    return function (...args) {

        if (waiting) {
            return;
        }

        callback.apply(
            this,
            args
        );

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, delay);
    };
}

/* =========================================================
   RAF THROTTLE
========================================================= */

function rafThrottle(callback) {

    let ticking = false;

    return function (...args) {

        if (!ticking) {

            requestAnimationFrame(() => {

                callback.apply(
                    this,
                    args
                );

                ticking = false;

            });

            ticking = true;
        }
    };
}

/* =========================================================
   EXAMPLES
========================================================= */

// ===================================
// SEARCH INPUT
// ===================================

// const searchHandler = debounce(
//     e => {
//         console.log(
//             "Searching:",
//             e.target.value
//         );
//     },
//     400
// );

// ===================================
// AUTOSAVE
// ===================================

// const autoSave = debounce(
//     () => {
//         console.log(
//             "Auto Saving..."
//         );
//     },
//     2000
// );

// ===================================
// WINDOW RESIZE
// ===================================

// const resizeHandler = throttle(
//     () => {
//         console.log(
//             "Resizing..."
//         );
//     },
//     200
// );

/* =========================================================
   EXPORT
========================================================= */

window.debounce =
    debounce;

window.advancedDebounce =
    advancedDebounce;

window.promiseDebounce =
    promiseDebounce;

window.cancelableDebounce =
    cancelableDebounce;

window.throttle =
    throttle;

window.rafThrottle =
    rafThrottle;

console.log(
    "Debounce Utilities Loaded ✔"
);
