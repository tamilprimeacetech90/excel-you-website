/* =========================================================
   EXCEL YOU AUTOSAVE SYSTEM
========================================================= */

class AutoSaveManager {

    constructor(editor) {

        this.editor = editor;

        this.saveDelay = 2000;

        this.saveTimer = null;

        this.isSaving = false;

        this.hasUnsavedChanges = false;

        this.retryLimit = 3;

        this.retryCount = 0;

        this.isOnline =
            navigator.onLine;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupAutoSave();

        this.setupNetworkDetection();

        this.setupKeyboardShortcut();

        this.setupPageLeaveProtection();

        console.log(
            "AutoSave Manager Initialized ✔"
        );
    }

    /* =====================================================
       AUTO SAVE
    ===================================================== */

    setupAutoSave() {

        if (!this.editor) {
            return;
        }

        this.editor.addEventListener(
            "input",
            () => {

                this.hasUnsavedChanges =
                    true;

                this.showStatus(
                    "Unsaved Changes..."
                );

                // Clear old timer
                clearTimeout(
                    this.saveTimer
                );

                // Create new timer
                this.saveTimer =
                    setTimeout(() => {

                        this.autoSave();

                    }, this.saveDelay);
            }
        );
    }

    /* =====================================================
       AUTO SAVE MAIN
    ===================================================== */

    async autoSave() {

        // Prevent duplicate saves
        if (
            this.isSaving
        ) {
            return;
        }

        // Prevent save while offline
        if (
            !this.isOnline
        ) {

            this.showStatus(
                "Offline ⚠"
            );

            return;
        }

        try {

            this.isSaving = true;

            this.showStatus(
                "Saving..."
            );

            // =====================
            // GET DATA
            // =====================
            const articleData =
                this.getEditorData();

            // =====================
            // SAVE API
            // =====================
            await this.fakeSaveAPI(
                articleData
            );

            this.hasUnsavedChanges =
                false;

            this.retryCount = 0;

            this.showStatus(
                `Saved ✔ ${new Date()
                    .toLocaleTimeString()}`
            );

        } catch (err) {

            console.error(
                "AutoSave Failed:",
                err
            );

            this.retrySave();

        } finally {

            this.isSaving = false;
        }
    }

    /* =====================================================
       RETRY SYSTEM
    ===================================================== */

    async retrySave() {

        if (
            this.retryCount >=
            this.retryLimit
        ) {

            this.showStatus(
                "Save Failed ❌"
            );

            return;
        }

        this.retryCount++;

        this.showStatus(
`
Retrying... (${this.retryCount}/${this.retryLimit})
`
        );

        await new Promise(

            resolve =>

                setTimeout(
                    resolve,
                    2000
                )
        );

        await this.autoSave();
    }

    /* =====================================================
       GET EDITOR DATA
    ===================================================== */

    getEditorData() {

        const title =
            document.getElementById(
                "articleTitle"
            )?.value || "";

        const content =
            this.editor.innerHTML;

        const slug =
            document.getElementById(
                "articleSlug"
            )?.value || "";

        return {

            title,

            slug,

            content,

            updatedAt:
                new Date()
                .toISOString()
        };
    }

    /* =====================================================
       FAKE API
       Replace later with real fetch()
    ===================================================== */

    async fakeSaveAPI(data) {

        console.log(
            "Saving...",
            data
        );

        // Simulate API delay
        await new Promise(

            resolve =>

                setTimeout(
                    resolve,
                    1200
                )
        );

        return true;
    }

    /* =====================================================
       STATUS
    ===================================================== */

    showStatus(message) {

        const status =
            document.getElementById(
                "saveStatus"
            );

        if (!status) {
            return;
        }

        status.innerText =
            message;
    }

    /* =====================================================
       NETWORK DETECTION
    ===================================================== */

    setupNetworkDetection() {

        window.addEventListener(
            "online",
            () => {

                this.isOnline =
                    true;

                this.showStatus(
                    "Back Online ✔"
                );

                if (
                    this.hasUnsavedChanges
                ) {

                    this.autoSave();
                }
            }
        );

        window.addEventListener(
            "offline",
            () => {

                this.isOnline =
                    false;

                this.showStatus(
                    "Offline ⚠"
                );
            }
        );
    }

    /* =====================================================
       CTRL + S
    ===================================================== */

    setupKeyboardShortcut() {

        document.addEventListener(
            "keydown",
            async e => {

                if (
                    (
                        e.ctrlKey ||
                        e.metaKey
                    ) &&

                    e.key.toLowerCase()
                    === "s"
                ) {

                    e.preventDefault();

                    await this.autoSave();
                }
            }
        );
    }

    /* =====================================================
       PAGE LEAVE WARNING
    ===================================================== */

    setupPageLeaveProtection() {

        window.addEventListener(
            "beforeunload",
            e => {

                if (
                    this.hasUnsavedChanges
                ) {

                    e.preventDefault();

                    e.returnValue = "";
                }
            }
        );
    }

    /* =====================================================
       FORCE SAVE
    ===================================================== */

    async forceSave() {

        clearTimeout(
            this.saveTimer
        );

        await this.autoSave();
    }

    /* =====================================================
       DESTROY
    ===================================================== */

    destroy() {

        clearTimeout(
            this.saveTimer
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

        window.autoSaveManager =
            new AutoSaveManager(
                editor
            );
    }
);

