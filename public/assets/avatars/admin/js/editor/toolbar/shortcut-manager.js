/* =========================================================
   EXCEL YOU SHORTCUT MANAGER
========================================================= */

class ShortcutManager {

    constructor(editor) {

        this.editor = editor;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupKeyboardShortcuts();

        console.log(
            "Shortcut Manager Initialized ✔"
        );
    }

    /* =====================================================
       SHORTCUTS
    ===================================================== */

    setupKeyboardShortcuts() {

        document.addEventListener(
            "keydown",
            e => {

                // =====================
                // CTRL SHORTCUTS
                // =====================
                if (
                    e.ctrlKey ||
                    e.metaKey
                ) {

                    switch (
                        e.key.toLowerCase()
                    ) {

                        // =================
                        // SAVE
                        // =================
                        case "s":

                            e.preventDefault();

                            if (
                                typeof autoSaveDraft
                                === "function"
                            ) {

                                autoSaveDraft();
                            }

                            console.log(
                                "CTRL+S"
                            );

                            break;

                        // =================
                        // BOLD
                        // =================
                        case "b":

                            e.preventDefault();

                            document.execCommand(
                                "bold"
                            );

                            break;

                        // =================
                        // ITALIC
                        // =================
                        case "i":

                            e.preventDefault();

                            document.execCommand(
                                "italic"
                            );

                            break;

                        // =================
                        // UNDERLINE
                        // =================
                        case "u":

                            e.preventDefault();

                            document.execCommand(
                                "underline"
                            );

                            break;

                        // =================
                        // UNDO
                        // =================
                        case "z":

                            e.preventDefault();

                            document.execCommand(
                                "undo"
                            );

                            break;

                        // =================
                        // REDO
                        // =================
                        case "y":

                            e.preventDefault();

                            document.execCommand(
                                "redo"
                            );

                            break;

                        // =================
                        // SELECT ALL
                        // =================
                        case "a":

                            if (
                                document.activeElement ===
                                this.editor
                            ) {

                                e.preventDefault();

                                document.execCommand(
                                    "selectAll"
                                );
                            }

                            break;
                    }
                }

                // =====================
                // TAB
                // =====================
                if (
                    e.key === "Tab"
                ) {

                    if (
                        document.activeElement ===
                        this.editor
                    ) {

                        e.preventDefault();

                        document.execCommand(
                            "insertHTML",
                            false,
                            "&nbsp;&nbsp;&nbsp;&nbsp;"
                        );
                    }
                }

                // =====================
                // ENTER
                // =====================
                if (
                    e.key === "Enter"
                ) {

                    this.handleEnter(e);
                }

                // =====================
                // DELETE
                // =====================
                if (
                    e.key === "Delete" ||
                    e.key === "Backspace"
                ) {

                    this.handleDelete(e);
                }
            }
        );
    }

    /* =====================================================
       ENTER HANDLER
    ===================================================== */

    handleEnter(e) {

        const selection =
            window.getSelection();

        if (
            !selection.rangeCount
        ) {
            return;
        }

        const range =
            selection.getRangeAt(0);

        const currentNode =
            range.startContainer.parentElement;

        // =========================
        // EXIT BLOCKQUOTE
        // =========================
        if (
            currentNode &&
            currentNode.tagName ===
            "BLOCKQUOTE"
        ) {

            if (
                currentNode.innerText.trim()
                === ""
            ) {

                e.preventDefault();

                const p =
                    document.createElement(
                        "p"
                    );

                p.innerHTML =
                    "<br>";

                currentNode.after(p);

                currentNode.remove();

                this.moveCursorToEnd(
                    p
                );
            }
        }

        // =========================
        // EXIT PRE CODE
        // =========================
        if (
            currentNode &&
            currentNode.tagName ===
            "PRE"
        ) {

            if (
                e.shiftKey === false
            ) {

                e.preventDefault();

                const p =
                    document.createElement(
                        "p"
                    );

                p.innerHTML =
                    "<br>";

                currentNode.after(p);

                this.moveCursorToEnd(
                    p
                );
            }
        }
    }

    /* =====================================================
       DELETE HANDLER
    ===================================================== */

    handleDelete() {

        document
            .querySelectorAll(
                ".editor-block"
            )
            .forEach(block => {

                // Remove empty blocks
                if (
                    block.innerText.trim()
                    === "" &&
                    !block.querySelector(
                        "img, iframe"
                    )
                ) {

                    if (
                        block.childNodes.length
                        <= 1
                    ) {

                        block.remove();
                    }
                }
            });
    }

    /* =====================================================
       CURSOR MOVE
    ===================================================== */

    moveCursorToEnd(element) {

        const range =
            document.createRange();

        const selection =
            window.getSelection();

        range.selectNodeContents(
            element
        );

        range.collapse(false);

        selection.removeAllRanges();

        selection.addRange(
            range
        );
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

        window.shortcutManager =
            new ShortcutManager(
                editor
            );
    }
);
