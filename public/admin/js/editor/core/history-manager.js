/* =========================================================
   EXCEL YOU HISTORY MANAGER
========================================================= */

class HistoryManager {

    constructor(editor) {

        // Editor container
        this.editor = editor;

        // History stack
        this.history = [];

        // Current position
        this.currentIndex = -1;

        // Max snapshots
        this.maxHistory = 100;

        // Prevent duplicate saves
        this.isRestoring = false;

        // Initialize
        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        // Save initial state
        this.save();

        // Keyboard shortcuts
        this.setupShortcuts();

        console.log(
            "History Manager Initialized ✔"
        );
    }

    /* =====================================================
       SAVE SNAPSHOT
    ===================================================== */

    save() {

        if (this.isRestoring) {
            return;
        }

        const snapshot =
            this.editor.innerHTML;

        // Prevent duplicate snapshots
        if (
            this.history[
                this.currentIndex
            ] === snapshot
        ) {
            return;
        }

        // Remove future history
        this.history =
            this.history.slice(
                0,
                this.currentIndex + 1
            );

        // Push snapshot
        this.history.push(snapshot);

        // Limit history
        if (
            this.history.length >
            this.maxHistory
        ) {

            this.history.shift();
        }

        // Update index
        this.currentIndex =
            this.history.length - 1;

        console.log(
            "Snapshot saved ✔"
        );
    }

    /* =====================================================
       UNDO
    ===================================================== */

    undo() {

        if (
            this.currentIndex <= 0
        ) {

            console.log(
                "Nothing to undo"
            );

            return;
        }

        this.currentIndex--;

        this.restore(
            this.history[
                this.currentIndex
            ]
        );

        console.log(
            "Undo ✔"
        );
    }

    /* =====================================================
       REDO
    ===================================================== */

    redo() {

        if (
            this.currentIndex >=
            this.history.length - 1
        ) {

            console.log(
                "Nothing to redo"
            );

            return;
        }

        this.currentIndex++;

        this.restore(
            this.history[
                this.currentIndex
            ]
        );

        console.log(
            "Redo ✔"
        );
    }

    /* =====================================================
       RESTORE SNAPSHOT
    ===================================================== */

    restore(snapshot) {

        this.isRestoring = true;

        this.editor.innerHTML =
            snapshot;

        // Small delay
        setTimeout(() => {

            this.isRestoring = false;

        }, 50);
    }

    /* =====================================================
       CLEAR HISTORY
    ===================================================== */

    clear() {

        this.history = [];

        this.currentIndex = -1;

        this.save();

        console.log(
            "History cleared"
        );
    }

    /* =====================================================
       SHORTCUTS
    ===================================================== */

    setupShortcuts() {

        document.addEventListener(
            "keydown",
            e => {

                // CTRL + Z
                if (
                    e.ctrlKey &&
                    !e.shiftKey &&
                    e.key.toLowerCase() === "z"
                ) {

                    e.preventDefault();

                    this.undo();
                }

                // CTRL + Y
                if (
                    e.ctrlKey &&
                    e.key.toLowerCase() === "y"
                ) {

                    e.preventDefault();

                    this.redo();
                }

                // CTRL + SHIFT + Z
                if (
                    e.ctrlKey &&
                    e.shiftKey &&
                    e.key.toLowerCase() === "z"
                ) {

                    e.preventDefault();

                    this.redo();
                }
            }
        );
    }

    /* =====================================================
       AUTO TRACK CHANGES
    ===================================================== */

    watch() {

        this.editor.addEventListener(
            "input",
            () => {

                this.save();
            }
        );

        // Track media changes
        this.editor.addEventListener(
            "click",
            e => {

                const deleteBtn =
                    e.target.closest(
                        ".delete-btn"
                    );

                if (deleteBtn) {

                    setTimeout(() => {

                        this.save();

                    }, 100);
                }
            }
        );
    }

    /* =====================================================
       GET HISTORY INFO
    ===================================================== */

    getInfo() {

        return {

            totalSnapshots:
                this.history.length,

            currentIndex:
                this.currentIndex
        };
    }
}

/* =========================================================
   INITIALIZE HISTORY MANAGER
========================================================= */

const historyManager =
    new HistoryManager(
        document.getElementById(
            "editor"
        )
    );

// Start watching changes
historyManager.watch();
