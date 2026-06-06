/* =========================================================
   EXCEL YOU DOM UTILITIES
========================================================= */

/* =========================================================
   SELECTORS
========================================================= */

function $(selector, parent = document) {

    return parent.querySelector(
        selector
    );
}

function $$(selector, parent = document) {

    return Array.from(

        parent.querySelectorAll(
            selector
        )
    );
}

/* =========================================================
   CREATE ELEMENT
========================================================= */

function createElement({

    tag = "div",

    className = "",

    id = "",

    text = "",

    html = "",

    attrs = {}

}) {

    const element =
        document.createElement(
            tag
        );

    // Class
    if (className) {

        element.className =
            className;
    }

    // ID
    if (id) {

        element.id =
            id;
    }

    // Text
    if (text) {

        element.textContent =
            text;
    }

    // HTML
    if (html) {

        element.innerHTML =
            html;
    }

    // Attributes
    Object.entries(attrs)
        .forEach(

            ([key, value]) => {

                element.setAttribute(
                    key,
                    value
                );
            }
        );

    return element;
}

/* =========================================================
   REMOVE ELEMENT
========================================================= */

function removeElement(element) {

    if (
        element &&
        element.parentNode
    ) {

        element.parentNode.removeChild(
            element
        );
    }
}

/* =========================================================
   EMPTY ELEMENT
========================================================= */

function emptyElement(element) {

    if (!element) {
        return;
    }

    while (
        element.firstChild
    ) {

        element.removeChild(
            element.firstChild
        );
    }
}

/* =========================================================
   INSERT AFTER
========================================================= */

function insertAfter(

    newNode,

    existingNode

) {

    existingNode.parentNode.insertBefore(

        newNode,

        existingNode.nextSibling
    );
}

/* =========================================================
   INSERT BEFORE
========================================================= */

function insertBefore(

    newNode,

    existingNode

) {

    existingNode.parentNode.insertBefore(

        newNode,

        existingNode
    );
}

/* =========================================================
   GET SELECTION
========================================================= */

function getSelectionText() {

    return window.getSelection()
        .toString();
}

function getSelectionRange() {

    const selection =
        window.getSelection();

    if (
        !selection ||
        selection.rangeCount === 0
    ) {

        return null;
    }

    return selection.getRangeAt(0);
}

/* =========================================================
   SAVE / RESTORE SELECTION
========================================================= */

let savedSelection = null;

function saveSelection() {

    const selection =
        window.getSelection();

    if (
        selection.rangeCount > 0
    ) {

        savedSelection =
            selection.getRangeAt(0);
    }
}

function restoreSelection() {

    if (!savedSelection) {
        return;
    }

    const selection =
        window.getSelection();

    selection.removeAllRanges();

    selection.addRange(
        savedSelection
    );
}

/* =========================================================
   CLOSEST
========================================================= */

function closest(

    element,

    selector

) {

    while (
        element &&
        element !== document
    ) {

        if (
            element.matches(selector)
        ) {

            return element;
        }

        element =
            element.parentNode;
    }

    return null;
}

/* =========================================================
   CLASS HELPERS
========================================================= */

function addClass(

    element,

    className

) {

    if (!element) {
        return;
    }

    element.classList.add(
        className
    );
}

function removeClass(

    element,

    className

) {

    if (!element) {
        return;
    }

    element.classList.remove(
        className
    );
}

function toggleClass(

    element,

    className

) {

    if (!element) {
        return;
    }

    element.classList.toggle(
        className
    );
}

function hasClass(

    element,

    className

) {

    if (!element) {
        return false;
    }

    return element.classList.contains(
        className
    );
}

/* =========================================================
   ATTRIBUTE HELPERS
========================================================= */

function setAttributes(

    element,

    attrs = {}

) {

    Object.entries(attrs)
        .forEach(

            ([key, value]) => {

                element.setAttribute(
                    key,
                    value
                );
            }
        );
}

function removeAttributes(

    element,

    attrs = []

) {

    attrs.forEach(attr => {

        element.removeAttribute(
            attr
        );
    });
}

/* =========================================================
   EVENT HELPERS
========================================================= */

function on(

    element,

    event,

    callback

) {

    if (!element) {
        return;
    }

    element.addEventListener(

        event,

        callback
    );
}

function off(

    element,

    event,

    callback

) {

    if (!element) {
        return;
    }

    element.removeEventListener(

        event,

        callback
    );
}

/* =========================================================
   EVENT DELEGATION
========================================================= */

function delegate(

    parent,

    selector,

    event,

    callback

) {

    parent.addEventListener(
        event,
        e => {

            const target =
                e.target.closest(
                    selector
                );

            if (target) {

                callback(
                    e,
                    target
                );
            }
        }
    );
}

/* =========================================================
   SAFE HTML
========================================================= */

function safeHTML(html = "") {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        html;

    return div.innerHTML;
}

/* =========================================================
   COPY TO CLIPBOARD
========================================================= */

async function copyToClipboard(text) {

    try {

        await navigator.clipboard.writeText(
            text
        );

        return true;

    } catch (err) {

        console.error(
            "Copy Failed",
            err
        );

        return false;
    }
}

/* =========================================================
   SCROLL HELPERS
========================================================= */

function scrollToElement(

    element,

    behavior = "smooth"

) {

    if (!element) {
        return;
    }

    element.scrollIntoView({

        behavior,

        block: "center"
    });
}

/* =========================================================
   POSITION
========================================================= */

function getElementPosition(element) {

    const rect =
        element.getBoundingClientRect();

    return {

        top:
            rect.top +
            window.scrollY,

        left:
            rect.left +
            window.scrollX,

        width:
            rect.width,

        height:
            rect.height
    };
}

/* =========================================================
   EXPORT
========================================================= */

window.DOMUtils = {

    $,

    $$,

    createElement,

    removeElement,

    emptyElement,

    insertAfter,

    insertBefore,

    getSelectionText,

    getSelectionRange,

    saveSelection,

    restoreSelection,

    closest,

    addClass,

    removeClass,

    toggleClass,

    hasClass,

    setAttributes,

    removeAttributes,

    on,

    off,

    delegate,

    safeHTML,

    copyToClipboard,

    scrollToElement,

    getElementPosition
};

console.log(
    "DOM Utilities Loaded ✔"
);
