/* =========================================================
   EXCEL YOU FLOATING TOOLBAR
========================================================= */

class FloatingToolbar {

    constructor(editor) {

        this.editor = editor;

        this.toolbar = null;

        this.selection = null;

        this.visible = false;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.createToolbar();

        this.setupSelectionEvents();

        this.setupToolbarActions();

        console.log(
            "Floating Toolbar Initialized ✔"
        );
    }

    /* =====================================================
       CREATE TOOLBAR
    ===================================================== */

    createToolbar() {

        this.toolbar =
            document.createElement(
                "div"
            );

        this.toolbar.className =
            "floating-toolbar";

        this.toolbar.innerHTML = `

<button data-action="bold">

    <i class="fas fa-bold"></i>

</button>

<button data-action="italic">

    <i class="fas fa-italic"></i>

</button>

<button data-action="underline">

    <i class="fas fa-underline"></i>

</button>

<button data-action="strikeThrough">

    <i class="fas fa-strikethrough"></i>

</button>

<div class="toolbar-divider"></div>

<button data-action="h1">

    H1

</button>

<button data-action="h2">

    H2

</button>

<button data-action="h3">

    H3

</button>

<div class="toolbar-divider"></div>

<button data-action="insertUnorderedList">

    <i class="fas fa-list-ul"></i>

</button>

<button data-action="insertOrderedList">

    <i class="fas fa-list-ol"></i>

</button>

<div class="toolbar-divider"></div>

<button data-action="link">

    <i class="fas fa-link"></i>

</button>

<button data-action="code">

    <i class="fas fa-code"></i>

</button>

        `;

        document.body.appendChild(
            this.toolbar
        );
    }

    /* =====================================================
       SELECTION EVENTS
    ===================================================== */

    setupSelectionEvents() {

        document.addEventListener(
            "mouseup",
            () => {

                setTimeout(() => {

                    this.handleSelection();

                }, 10);
            }
        );

        document.addEventListener(
            "keyup",
            () => {

                setTimeout(() => {

                    this.handleSelection();

                }, 10);
            }
        );

        // Hide on scroll
        window.addEventListener(
            "scroll",
            () => {

                this.hideToolbar();
            }
        );

        // Hide when clicking outside
        document.addEventListener(
            "click",
            e => {

                if (
                    !this.toolbar.contains(
                        e.target
                    )
                ) {

                    if (
                        !window.getSelection()
                            .toString()
                    ) {

                        this.hideToolbar();
                    }
                }
            }
        );
    }

    /* =====================================================
       HANDLE SELECTION
    ===================================================== */

    handleSelection() {

        const selection =
            window.getSelection();

        // No selection
        if (
            !selection ||
            selection.rangeCount === 0
        ) {

            this.hideToolbar();

            return;
        }

        const text =
            selection.toString()
            .trim();

        // Empty selection
        if (!text) {

            this.hideToolbar();

            return;
        }

        const range =
            selection.getRangeAt(0);

        const rect =
            range.getBoundingClientRect();

        // Save selection
        this.selection =
            selection;

        // Position toolbar
        this.positionToolbar(
            rect
        );

        this.showToolbar();
    }

    /* =====================================================
       POSITION
    ===================================================== */

    positionToolbar(rect) {

        const toolbarWidth =
            this.toolbar.offsetWidth;

        const left =
            rect.left +

            (rect.width / 2) -

            (toolbarWidth / 2);

        const top =
            rect.top +

            window.scrollY -

            65;

        this.toolbar.style.left =
`
${left}px
`;

        this.toolbar.style.top =
`
${top}px
`;
    }

    /* =====================================================
       SHOW
    ===================================================== */

    showToolbar() {

        this.visible = true;

        this.toolbar.classList.add(
            "show"
        );
    }

    /* =====================================================
       HIDE
    ===================================================== */

    hideToolbar() {

        this.visible = false;

        this.toolbar.classList.remove(
            "show"
        );
    }

    /* =====================================================
       TOOLBAR ACTIONS
    ===================================================== */

    setupToolbarActions() {

        this.toolbar
            .querySelectorAll(
                "button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    e => {

                        e.preventDefault();

                        const action =
                            button.dataset
                            .action;

                        this.executeAction(
                            action
                        );
                    }
                );
            });
    }

    /* =====================================================
       EXECUTE ACTION
    ===================================================== */

    executeAction(action) {

        // Restore selection
        if (
            this.selection
        ) {

            const range =
                this.selection
                .getRangeAt(0);

            this.selection.removeAllRanges();

            this.selection.addRange(
                range
            );
        }

        switch (action) {

            // =====================
            // TEXT FORMAT
            // =====================

            case "bold":

                document.execCommand(
                    "bold"
                );

                break;

            case "italic":

                document.execCommand(
                    "italic"
                );

                break;

            case "underline":

                document.execCommand(
                    "underline"
                );

                break;

            case "strikeThrough":

                document.execCommand(
                    "strikeThrough"
                );

                break;

            // =====================
            // HEADINGS
            // =====================

            case "h1":

                document.execCommand(

                    "formatBlock",

                    false,

                    "h1"
                );

                break;

            case "h2":

                document.execCommand(

                    "formatBlock",

                    false,

                    "h2"
                );

                break;

            case "h3":

                document.execCommand(

                    "formatBlock",

                    false,

                    "h3"
                );

                break;

            // =====================
            // LISTS
            // =====================

            case "insertUnorderedList":

                document.execCommand(
                    "insertUnorderedList"
                );

                break;

            case "insertOrderedList":

                document.execCommand(
                    "insertOrderedList"
                );

                break;

            // =====================
            // LINK
            // =====================

            case "link":

                this.insertLink();

                break;

            // =====================
            // CODE
            // =====================

            case "code":

                this.insertCode();

                break;
        }

        this.hideToolbar();
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
    }

    /* =====================================================
       INSERT CODE
    ===================================================== */

    insertCode() {

        const selection =
            window.getSelection();

        const text =
            selection.toString();

        if (!text) {
            return;
        }

        document.execCommand(

            "insertHTML",

            false,

`
<code>${text}</code>
`
        );
    }

    /* =====================================================
       DESTROY
    ===================================================== */

    destroy() {

        this.toolbar?.remove();
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

        window.floatingToolbar =
            new FloatingToolbar(
                editor
            );
    }
);
