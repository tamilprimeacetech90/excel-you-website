/* =========================================================
   EXCEL YOU VIDEO BLOCK
========================================================= */

class VideoBlock {

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
            "Video Block Initialized ✔"
        );
    }

    /* =====================================================
       TOOLBAR BUTTON
    ===================================================== */

    setupToolbarButton() {

        const videoBtn =
            document.getElementById(
                "videoBtn"
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
                "Enter YouTube video URL"
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

        const block =
            this.createVideoBlock(
                embedUrl
            );

        this.editor.appendChild(
            block
        );

        block.scrollIntoView({

            behavior: "smooth",

            block: "center"
        });

        // Save to media library
        if (
            window.mediaLibrary
        ) {

            window.mediaLibrary
                .addMedia({

                    type: "video",

                    name: "YouTube Video",

                    url: embedUrl
                });
        }
    }

    /* =====================================================
       YOUTUBE URL CONVERTER
    ===================================================== */

    convertToEmbedURL(url) {

        try {

            // youtu.be
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

                return `
https://www.youtube.com/embed/${videoId}
                `.trim();
            }

            // youtube watch
            if (
                url.includes(
                    "watch?v="
                )
            ) {

                const videoId =
                    new URL(url)
                    .searchParams
                    .get("v");

                return `
https://www.youtube.com/embed/${videoId}
                `.trim();
            }

            // already embed
            if (
                url.includes(
                    "/embed/"
                )
            ) {

                return url;
            }

            return null;

        } catch {

            return null;
        }
    }

    /* =====================================================
       CREATE BLOCK
    ===================================================== */

    createVideoBlock(src) {

        // Wrapper
        const wrapper =
            document.createElement(
                "div"
            );

     wrapper.className =
    "editor-block video-block media-block";

wrapper.draggable = true;

wrapper.dataset.blockType =
    "video";

wrapper.dataset.blockId =
    "vid_" +
    Date.now() +
    "_" +
    Math.random()
        .toString(36)
        .substring(2, 8);

wrapper.setAttribute(
    "data-draggable",
    "true"
);

        // Video iframe
        const iframe =
            document.createElement(
                "iframe"
            );

        iframe.src = src;

        iframe.className =
            "editor-video";

        iframe.allowFullscreen =
            true;

        iframe.setAttribute(
            "frameborder",
            "0"
        );

        iframe.setAttribute(
            "allow",

`
accelerometer;
autoplay;
clipboard-write;
encrypted-media;
gyroscope;
picture-in-picture
`
        );

        // Controls
        const controls =
            this.createControls(
                wrapper,
                iframe
            );

        // Caption
        const caption =
            document.createElement(
                "div"
            );

        caption.className =
            "video-caption";

        caption.contentEditable =
            "true";

        caption.innerHTML =
            "Write video caption...";

        // Append
        wrapper.appendChild(
            controls
        );

        wrapper.appendChild(
            iframe
        );

        wrapper.appendChild(
            caption
        );

        // Events
        this.setupEvents(
            wrapper,
            iframe
        );

        return wrapper;
    }

    /* =====================================================
       CONTROLS
    ===================================================== */

    createControls(
        wrapper,
        iframe
    ) {

        const controls =
            document.createElement(
                "div"
            );

        controls.className =
            "media-controls";

        // Delete
        const deleteBtn =
            document.createElement(
                "button"
            );

        deleteBtn.innerHTML =
`
<i class="fas fa-trash"></i>
`;

        deleteBtn.className =
            "media-delete-btn";

        deleteBtn.onclick = () => {

            const confirmDelete =
                confirm(
                    "Delete video?"
                );

            if (
                !confirmDelete
            ) {
                return;
            }

            wrapper.remove();
        };

        // Move Up
        const upBtn =
            document.createElement(
                "button"
            );

        upBtn.innerHTML =
`
<i class="fas fa-arrow-up"></i>
`;

        upBtn.onclick = () => {

            const previous =
                wrapper.previousElementSibling;

            if (
                previous
            ) {

                wrapper.parentNode.insertBefore(

                    wrapper,

                    previous
                );
            }
        };

        // Move Down
        const downBtn =
            document.createElement(
                "button"
            );

        downBtn.innerHTML =
`
<i class="fas fa-arrow-down"></i>
`;

        downBtn.onclick = () => {

            const next =
                wrapper.nextElementSibling;

            if (
                next
            ) {

                wrapper.parentNode.insertBefore(

                    next,

                    wrapper
                );
            }
        };

        // Full Width
        const fullBtn =
            document.createElement(
                "button"
            );

        fullBtn.innerHTML =
`
<i class="fas fa-expand"></i>
`;

        fullBtn.onclick = () => {

            wrapper.classList.toggle(
                "full-video"
            );
        };

        // Append
        controls.appendChild(
            upBtn
        );

        controls.appendChild(
            downBtn
        );

        controls.appendChild(
            fullBtn
        );

        controls.appendChild(
            deleteBtn
        );

        return controls;
    }

    /* =====================================================
       EVENTS
    ===================================================== */

    setupEvents(
        wrapper,
        iframe
    ) {

        // =========================
        // SELECT VIDEO
        // =========================
        iframe.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".video-block"
                    )
                    .forEach(block => {

                        block.classList.remove(
                            "selected-media"
                        );
                    });

                wrapper.classList.add(
                    "selected-media"
                );
            }
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

        window.videoBlock =
            new VideoBlock(
                editor
            );
    }
);
