/* =========================================================
   EXCEL YOU BACKUP MANAGER
========================================================= */

class BackupManager {

    constructor(editor) {

        this.editor = editor;

        this.backupKey =
            "excelYouEditorBackup";

        this.historyKey =
            "excelYouBackupHistory";

        this.maxHistory = 10;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupBackupListener();

        this.restoreLatestBackup();

        this.setupRecoveryButton();

        console.log(
            "Backup Manager Initialized ✔"
        );
    }

    /* =====================================================
       BACKUP LISTENER
    ===================================================== */

    setupBackupListener() {

        if (!this.editor) {
            return;
        }

        this.editor.addEventListener(
            "input",
            () => {

                this.createBackup();
            }
        );
    }

    /* =====================================================
       CREATE BACKUP
    ===================================================== */

    createBackup() {

        try {

            const backupData =
                this.generateBackupData();

            // =====================
            // SAVE CURRENT BACKUP
            // =====================
            localStorage.setItem(

                this.backupKey,

                JSON.stringify(
                    backupData
                )
            );

            // =====================
            // SAVE HISTORY
            // =====================
            this.saveBackupHistory(
                backupData
            );

            console.log(
                "Backup Created ✔"
            );

        } catch (err) {

            console.error(
                "Backup Failed",
                err
            );
        }
    }

    /* =====================================================
       GENERATE BACKUP DATA
    ===================================================== */

    generateBackupData() {

        const title =
            document.getElementById(
                "articleTitle"
            )?.value || "";

        const slug =
            document.getElementById(
                "articleSlug"
            )?.value || "";

        const content =
            this.editor.innerHTML;

        const thumbnail =
            document.querySelector(
                ".thumbnail-preview img"
            )?.src || "";

        return {

            title,

            slug,

            content,

            thumbnail,

            createdAt:
                new Date()
                .toISOString()
        };
    }

    /* =====================================================
       SAVE HISTORY
    ===================================================== */

    saveBackupHistory(data) {

        let history = [];

        try {

            history = JSON.parse(

                localStorage.getItem(
                    this.historyKey
                )

            ) || [];

        } catch {

            history = [];
        }

        // Add new backup
        history.unshift(data);

        // Limit history
        if (
            history.length >
            this.maxHistory
        ) {

            history =
                history.slice(

                    0,

                    this.maxHistory
                );
        }

        localStorage.setItem(

            this.historyKey,

            JSON.stringify(
                history
            )
        );
    }

    /* =====================================================
       RESTORE LATEST
    ===================================================== */

    restoreLatestBackup() {

        try {

            const backup =
                localStorage.getItem(
                    this.backupKey
                );

            if (!backup) {
                return;
            }

            const parsed =
                JSON.parse(
                    backup
                );

            // =====================
            // RESTORE TITLE
            // =====================
            const titleInput =
                document.getElementById(
                    "articleTitle"
                );

            if (
                titleInput
            ) {

                titleInput.value =
                    parsed.title || "";
            }

            // =====================
            // RESTORE SLUG
            // =====================
            const slugInput =
                document.getElementById(
                    "articleSlug"
                );

            if (
                slugInput
            ) {

                slugInput.value =
                    parsed.slug || "";
            }

            // =====================
            // RESTORE CONTENT
            // =====================
            if (
                parsed.content
            ) {

                this.editor.innerHTML =
                    parsed.content;
            }

            // =====================
            // RESTORE THUMBNAIL
            // =====================
            if (
                parsed.thumbnail
            ) {

                const preview =
                    document.getElementById(
                        "thumbnailPreview"
                    );

                if (
                    preview
                ) {

                    preview.innerHTML =
`
<img src="${parsed.thumbnail}">
`;
                }
            }

            console.log(
                "Backup Restored ✔"
            );

        } catch (err) {

            console.error(
                "Restore Failed",
                err
            );
        }
    }

    /* =====================================================
       RESTORE SPECIFIC BACKUP
    ===================================================== */

    restoreBackup(index) {

        try {

            const history =
                JSON.parse(

                    localStorage.getItem(
                        this.historyKey
                    )

                ) || [];

            const backup =
                history[index];

            if (!backup) {
                return;
            }

            // Restore
            this.editor.innerHTML =
                backup.content || "";

            const titleInput =
                document.getElementById(
                    "articleTitle"
                );

            if (
                titleInput
            ) {

                titleInput.value =
                    backup.title || "";
            }

            const slugInput =
                document.getElementById(
                    "articleSlug"
                );

            if (
                slugInput
            ) {

                slugInput.value =
                    backup.slug || "";
            }

            alert(
                "Backup Restored ✔"
            );

        } catch (err) {

            console.error(
                err
            );
        }
    }

    /* =====================================================
       SHOW HISTORY
    ===================================================== */

    showBackupHistory() {

        try {

            const history =
                JSON.parse(

                    localStorage.getItem(
                        this.historyKey
                    )

                ) || [];

            console.table(
                history
            );

            return history;

        } catch {

            return [];
        }
    }

    /* =====================================================
       CLEAR BACKUPS
    ===================================================== */

    clearBackups() {

        const confirmDelete =
            confirm(
                "Delete all backups?"
            );

        if (
            !confirmDelete
        ) {
            return;
        }

        localStorage.removeItem(
            this.backupKey
        );

        localStorage.removeItem(
            this.historyKey
        );

        alert(
            "Backups Cleared ✔"
        );
    }

    /* =====================================================
       RECOVERY BUTTON
    ===================================================== */

    setupRecoveryButton() {

        const recoveryBtn =
            document.getElementById(
                "restoreBackupBtn"
            );

        if (!recoveryBtn) {
            return;
        }

        recoveryBtn.addEventListener(
            "click",
            () => {

                this.restoreLatestBackup();
            }
        );
    }

    /* =====================================================
       EXPORT BACKUP
    ===================================================== */

    exportBackup() {

        try {

            const backup =
                localStorage.getItem(
                    this.backupKey
                );

            if (!backup) {

                alert(
                    "No Backup Found"
                );

                return;
            }

            const blob =
                new Blob(

                    [backup],

                    {
                        type:
                            "application/json"
                    }
                );

            const url =
                URL.createObjectURL(
                    blob
                );

            const a =
                document.createElement(
                    "a"
                );

            a.href = url;

            a.download =
`
excel-you-backup-${Date.now()}.json
`;

            a.click();

            URL.revokeObjectURL(
                url
            );

        } catch (err) {

            console.error(
                err
            );
        }
    }

    /* =====================================================
       IMPORT BACKUP
    ===================================================== */

    importBackup(file) {

        const reader =
            new FileReader();

        reader.onload = e => {

            try {

                const data =
                    JSON.parse(
                        e.target.result
                    );

                localStorage.setItem(

                    this.backupKey,

                    JSON.stringify(
                        data
                    )
                );

                this.restoreLatestBackup();

                alert(
                    "Backup Imported ✔"
                );

            } catch {

                alert(
                    "Invalid Backup File"
                );
            }
        };

        reader.readAsText(
            file
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

        window.backupManager =
            new BackupManager(
                editor
            );
    }
);
