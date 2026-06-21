/* =========================================================
   EXCEL YOU MEDIA LIBRARY
========================================================= */

class MediaLibrary {

    constructor() {

        this.storageKey =
            "excelyou-media-library";

        this.media = [];

        this.loadLibrary();

        console.log(
            "Media Library Initialized ✔"
        );
    }

    /* =====================================================
       LOAD
    ===================================================== */

    loadLibrary() {

        try {

            const saved =
                localStorage.getItem(
                    this.storageKey
                );

            if (saved) {

                this.media =
                    JSON.parse(saved);
            }

        } catch (err) {

            console.error(
                "Failed to load media library",
                err
            );

            this.media = [];
        }
    }

    /* =====================================================
       SAVE
    ===================================================== */

    saveLibrary() {

        try {

            localStorage.setItem(

                this.storageKey,

                JSON.stringify(
                    this.media
                )
            );

        } catch (err) {

            console.error(
                "Failed to save media library",
                err
            );
        }
    }

    /* =====================================================
       ADD MEDIA
    ===================================================== */

    addMedia({

        type,
        name,
        url,
        size = 0

    }) {

        const mediaItem = {

            id:
                crypto.randomUUID(),

            type,

            name,

            url,

            size,

            createdAt:
                new Date().toISOString()
        };

        this.media.unshift(
            mediaItem
        );

        this.saveLibrary();

        console.log(
            "Media added ✔"
        );

        return mediaItem;
    }

    /* =====================================================
       REMOVE MEDIA
    ===================================================== */

    removeMedia(id) {

        this.media =
            this.media.filter(
                item => item.id !== id
            );

        this.saveLibrary();

        console.log(
            "Media removed ✔"
        );
    }

    /* =====================================================
       GET ALL MEDIA
    ===================================================== */

    getAllMedia() {

        return this.media;
    }

    /* =====================================================
       FILTER BY TYPE
    ===================================================== */

    getMediaByType(type) {

        return this.media.filter(
            item => item.type === type
        );
    }

    /* =====================================================
       FIND MEDIA
    ===================================================== */

    findMedia(id) {

        return this.media.find(
            item => item.id === id
        );
    }

    /* =====================================================
       CLEAR LIBRARY
    ===================================================== */

    clearLibrary() {

        const confirmClear =
            confirm(
                "Clear media library?"
            );

        if (!confirmClear) {
            return;
        }

        this.media = [];

        this.saveLibrary();

        console.log(
            "Media library cleared ✔"
        );
    }

    /* =====================================================
       OPEN LIBRARY MODAL
    ===================================================== */

    openLibrary() {

        // Remove old modal
        const oldModal =
            document.querySelector(
                ".media-library-modal"
            );

        if (oldModal) {

            oldModal.remove();
        }

        // Create modal
        const modal =
            document.createElement(
                "div"
            );

        modal.className =
            "media-library-modal";

        // Content
        modal.innerHTML = `

            <div class="media-library-container">

                <div class="media-library-header">

                    <h2>
                        Media Library
                    </h2>

                    <button
                    class="close-library-btn">

                        ✖

                    </button>

                </div>

                <div class="media-library-grid">

                    ${this.renderMediaItems()}

                </div>

            </div>
        `;

        document.body.appendChild(
            modal
        );

        // Close
        modal.querySelector(
            ".close-library-btn"
        ).onclick = () => {

            modal.remove();
        };
    }

    /* =====================================================
       RENDER MEDIA
    ===================================================== */

    renderMediaItems() {

        if (!this.media.length) {

            return `
                <div class="empty-library">

                    <i class="fas fa-photo-film"></i>

                    <p>
                        No media uploaded
                    </p>

                </div>
            `;
        }

        return this.media.map(
            item => {

                // =====================
                // IMAGE
                // =====================
                if (
                    item.type === "image"
                ) {

                    return `

                        <div
                        class="library-item">

                            <img
                            src="${item.url}"
                            class="library-image">

                            <div
                            class="library-info">

                                <p>
                                    ${item.name}
                                </p>

                            </div>

                        </div>
                    `;
                }

                // =====================
                // VIDEO
                // =====================
                if (
                    item.type === "video"
                ) {

                    return `

                        <div
                        class="library-item">

                            <div
                            class="library-video">

                                <i
                                class="fas fa-video">
                                </i>

                            </div>

                            <div
                            class="library-info">

                                <p>
                                    ${item.name}
                                </p>

                            </div>

                        </div>
                    `;
                }

                // =====================
                // FILE
                // =====================
                return `

                    <div
                    class="library-item">

                        <div
                        class="library-file">

                            <i
                            class="fas fa-file">
                            </i>

                        </div>

                        <div
                        class="library-info">

                            <p>
                                ${item.name}
                            </p>

                        </div>

                    </div>
                `;
            }
        ).join("");
    }
}

/* =========================================================
   GLOBAL INSTANCE
========================================================= */

window.mediaLibrary =
    new MediaLibrary();
