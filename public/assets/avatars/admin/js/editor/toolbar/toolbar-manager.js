/* =========================================================
   EXCEL YOU TOOLBAR MANAGER
========================================================= */

class ToolbarManager {

    constructor(editor) {

        this.editor = editor;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupToolbarButtons();

        this.setupActiveStates();

        console.log(
            "Toolbar Manager Initialized ✔"
        );
    }

    /* =====================================================
       TOOLBAR BUTTONS
    ===================================================== */

    setupToolbarButtons() {

        // =========================
        // BOLD
        // =========================
        this.bindCommand(
            "boldBtn",
            "bold"
        );

        // =========================
        // ITALIC
        // =========================
        this.bindCommand(
            "italicBtn",
            "italic"
        );

        // =========================
        // UNDERLINE
        // =========================
        this.bindCommand(
            "underlineBtn",
            "underline"
        );

        // =========================
        // STRIKE
        // =========================
        this.bindCommand(
            "strikeBtn",
            "strikeThrough"
        );

        // =========================
        // HEADING
        // =========================
        const headingBtn =
            document.getElementById(
                "headingBtn"
            );

        if (headingBtn) {

            headingBtn.addEventListener(
                "click",
                () => {

                    document.execCommand(
                        "formatBlock",
                        false,
                        "h2"
                    );
                }
            );
        }

        // =========================
        // QUOTE
        // =========================
        const quoteBtn =
            document.getElementById(
                "quoteBtn"
            );

        if (quoteBtn) {

            quoteBtn.addEventListener(
                "click",
                () => {

                    document.execCommand(
                        "formatBlock",
                        false,
                        "blockquote"
                    );
                }
            );
        }

        // =========================
        // UNORDERED LIST
        // =========================
        this.bindCommand(
            "bulletListBtn",
            "insertUnorderedList"
        );

        // =========================
        // ORDERED LIST
        // =========================
        this.bindCommand(
            "orderedListBtn",
            "insertOrderedList"
        );

        // =========================
        // LINK
        // =========================
        const linkBtn =
            document.getElementById(
                "linkBtn"
            );

        if (linkBtn) {

            linkBtn.addEventListener(
                "click",
                () => {

                    this.insertLink();
                }
            );
        }

        // =========================
        // HTML MODE
        // =========================
        const htmlBtn =
            document.getElementById(
                "htmlModeBtn"
            );

        if (htmlBtn) {

            htmlBtn.addEventListener(
                "click",
                () => {

                    this.toggleHTMLMode();
                }
            );
        }
    }

    /* =====================================================
       GENERIC COMMAND
    ===================================================== */

    bindCommand(id, command) {

        const btn =
            document.getElementById(id);

        if (!btn) {
            return;
        }

        btn.addEventListener(
            "click",
            () => {

                document.execCommand(
                    command,
                    false,
                    null
                );

                this.editor.focus();
            }
        );
    }

    /* =====================================================
       INSERT LINK
    ===================================================== */

    insertLink() {

        const url =
            prompt(
                "Enter URL"
            );

        if (!url) {
            return;
        }

        document.execCommand(

            "createLink",

            false,

            url
        );

        this.editor.focus();
    }

    /* =====================================================
       HTML MODE
    ===================================================== */

    toggleHTMLMode() {

        const isCode =
            this.editor.getAttribute(
                "data-html-mode"
            );

        // =========================
        // SWITCH TO HTML
        // =========================
        if (!isCode) {

            this.editor.setAttribute(
                "data-html-mode",
                "true"
            );

            this.editor.textContent =
                this.editor.innerHTML;

            this.editor.classList.add(
                "html-mode"
            );

            console.log(
                "HTML mode enabled"
            );

            return;
        }

        // =========================
        // SWITCH BACK
        // =========================
        this.editor.removeAttribute(
            "data-html-mode"
        );

        this.editor.innerHTML =
            this.editor.textContent;

        this.editor.classList.remove(
            "html-mode"
        );

        console.log(
            "HTML mode disabled"
        );
    }

    /* =====================================================
       ACTIVE STATES
    ===================================================== */

    setupActiveStates() {

        document.addEventListener(
            "selectionchange",
            () => {

                this.updateActiveStates();
            }
        );
    }

    /* =====================================================
       UPDATE ACTIVE BUTTONS
    ===================================================== */

    updateActiveStates() {

        this.toggleActive(
            "boldBtn",
            "bold"
        );

        this.toggleActive(
            "italicBtn",
            "italic"
        );

        this.toggleActive(
            "underlineBtn",
            "underline"
        );

        this.toggleActive(
            "strikeBtn",
            "strikeThrough"
        );
    }

    /* =====================================================
       ACTIVE TOGGLE
    ===================================================== */

    toggleActive(id, command) {

        const btn =
            document.getElementById(id);

        if (!btn) {
            return;
        }

        const active =
            document.queryCommandState(
                command
            );

        if (active) {

            btn.classList.add(
                "active-tool"
            );
        }
        else {

            btn.classList.remove(
                "active-tool"
            );
        }
    }
}

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const editor =
            document.getElementById(
                "editor"
            );

        if (!editor) {
            return;
        }

        window.toolbarManager =
            new ToolbarManager(
                editor
            );
    }
);
