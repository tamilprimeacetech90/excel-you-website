/* =========================================================
   EXCEL YOU VIDEO EMBED SYSTEM
========================================================= */

class VideoEmbedManager {

    constructor(editor) {

        this.editor = editor;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupToolbarButton();

        console.log(
            "Video Embed Manager Initialized ✔"
        );
    }

    /* =====================================================
       TOOLBAR BUTTON
    ===================================================== */

    setupToolbarButton() {

        const videoBtn =
            document.getElementById(
                "videoEmbedBtn"
            );

        if (!videoBtn) {
            return;
        }

        videoBtn.addEventListener(
            "click",
            () => {

                this.openVideoPrompt();
            }
        );
    }

    /* =====================================================
       VIDEO PROMPT
    ===================================================== */

    openVideoPrompt() {

        const url =
            prompt(
                "Paste YouTube Video URL"
            );

        if (!url) {
            return;
        }

        const embedUrl =
            this.convertToEmbedURL(
                url
            );

        if (!embedUrl) {

            alert(
                "Invalid YouTube URL"
            );

            return;
        }

        this.createVideoBlock(
            embedUrl
        );
    }

    /* =====================================================
       CONVERT URL
    ===================================================== */

    convertToEmbedURL(url) {

        try {

            // youtube.com/watch?v=
            if (
                url.includes(
                    "youtube.com/watch?v="
                )
            ) {

                const videoId =
                    url.split(
                        "v="
                    )[1]
                    ?.split("&")[0];

                return `https://www.youtube.com/embed/${videoId}`;
            }

            // youtu.be/
            if (
                url.includes(
                    "youtu.be/"
                )
            ) {

                const videoId =
                    url.split(
                        "youtu.be/"
                    )[1]
                    ?.split("?")[0];

                return `https://www.youtube.com/embed/${videoId}`;
            }

            return null;

        } catch {

            return null;
        }
    }

    /* =====================================================
       CREATE VIDEO BLOCK
    ===================================================== */

    createVideoBlock(embedUrl) {

        // Main wrapper
        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "editor-block media-block video-block";

        wrapper.setAttribute(
            "draggable",
            "true"
        );

        // Video container
        const videoContainer =
            document.createElement(
                "div"
            );

        videoContainer.className =
            "video-container";

        // iframe
        const iframe =
            document.createElement(
                "iframe"
            );

        iframe.src =
            embedUrl;

        iframe.allowFullscreen =
            true;

        iframe.className =
            "editor-video";

        iframe.setAttribute(
            "frameborder",
            "0"
        );

        iframe.setAttribute(
            "allow",
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        );

        // Controls
        const controls =
            document.createElement(
                "div"
            );

        controls.className =
            "media-controls";

        // Delete button
        const deleteBtn =
            document.createElement(
                "button"
            );

        deleteBtn.innerHTML =
            `<i class="fas fa-trash"></i>`;

        deleteBtn.className =
            "media-delete-btn";

        deleteBtn.addEventListener(
            "click",
            () => {

                wrapper.remove();
            }
        );

        // Append
        controls.appendChild(
            deleteBtn
        );

        videoContainer.appendChild(
            iframe
        );

        wrapper.appendChild(
            videoContainer
        );

        wrapper.appendChild(
            controls
        );

        // Add to editor
        this.editor.appendChild(
            wrapper
        );

        // Scroll
        wrapper.scrollIntoView({

            behavior: "smooth",

            block: "center"
        });

        console.log(
            "Video inserted ✔"
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

        window.videoEmbedManager =
            new VideoEmbedManager(
                editor
            );
    }
);
