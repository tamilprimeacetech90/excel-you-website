/* =========================================================
   EXCEL YOU IMAGE CROP SYSTEM
========================================================= */

class ImageCropManager {

    constructor(editor) {

        this.editor = editor;

        this.currentImage = null;

        this.cropModal = null;

        this.cropBox = null;

        this.imageClone = null;

        this.isDragging = false;

        this.startX = 0;

        this.startY = 0;

        this.currentX = 50;

        this.currentY = 50;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupCropButton();

        this.createCropModal();

        console.log(
            "Image Crop Manager Initialized ✔"
        );
    }

    /* =====================================================
       CROP BUTTON
    ===================================================== */

    setupCropButton() {

        document.addEventListener(
            "click",
            e => {

                const cropBtn =
                    e.target.closest(
                        ".crop-image-btn"
                    );

                if (!cropBtn) {
                    return;
                }

                const wrapper =
                    cropBtn.closest(
                        ".image-block"
                    );

                if (!wrapper) {
                    return;
                }

                const image =
                    wrapper.querySelector(
                        ".editor-image"
                    );

                if (!image) {
                    return;
                }

                this.openCropper(
                    image
                );
            }
        );
    }

    /* =====================================================
       CREATE MODAL
    ===================================================== */

    createCropModal() {

        const modal =
            document.createElement(
                "div"
            );

        modal.className =
            "crop-modal";

        modal.innerHTML = `

            <div class="crop-container">

                <div class="crop-header">

                    <h3>
                        Crop Image
                    </h3>

                    <button
                    class="close-crop-btn">

                        ✖

                    </button>

                </div>

                <div class="crop-preview">

                </div>

                <div class="crop-actions">

                    <button
                    class="cancel-crop-btn">

                        Cancel

                    </button>

                    <button
                    class="apply-crop-btn">

                        Apply Crop

                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(
            modal
        );

        this.cropModal = modal;

        // Close
        modal.querySelector(
            ".close-crop-btn"
        ).onclick = () => {

            this.closeCropper();
        };

        modal.querySelector(
            ".cancel-crop-btn"
        ).onclick = () => {

            this.closeCropper();
        };

        modal.querySelector(
            ".apply-crop-btn"
        ).onclick = () => {

            this.applyCrop();
        };
    }

    /* =====================================================
       OPEN CROPPER
    ===================================================== */

    openCropper(image) {

        this.currentImage =
            image;

        this.cropModal.classList.add(
            "active"
        );

        const preview =
            this.cropModal.querySelector(
                ".crop-preview"
            );

        preview.innerHTML = "";

        // Clone image
        const clone =
            document.createElement(
                "img"
            );

        clone.src =
            image.src;

        clone.className =
            "crop-image-preview";

        preview.appendChild(
            clone
        );

        this.imageClone = clone;

        // Crop box
        const cropBox =
            document.createElement(
                "div"
            );

        cropBox.className =
            "crop-box";

        preview.appendChild(
            cropBox
        );

        this.cropBox =
            cropBox;

        this.enableDragging();
    }

    /* =====================================================
       DRAGGING
    ===================================================== */

    enableDragging() {

        this.cropBox.addEventListener(
            "mousedown",
            e => {

                this.isDragging = true;

                this.startX =
                    e.clientX -
                    this.currentX;

                this.startY =
                    e.clientY -
                    this.currentY;
            }
        );

        document.addEventListener(
            "mousemove",
            e => {

                if (!this.isDragging) {
                    return;
                }

                this.currentX =
                    e.clientX -
                    this.startX;

                this.currentY =
                    e.clientY -
                    this.startY;

                this.cropBox.style.left =
                    `${this.currentX}px`;

                this.cropBox.style.top =
                    `${this.currentY}px`;
            }
        );

        document.addEventListener(
            "mouseup",
            () => {

                this.isDragging = false;
            }
        );
    }

    /* =====================================================
       APPLY CROP
    ===================================================== */

    applyCrop() {

        if (
            !this.currentImage ||
            !this.imageClone
        ) {
            return;
        }

        const canvas =
            document.createElement(
                "canvas"
            );

        const ctx =
            canvas.getContext(
                "2d"
            );

        const cropRect =
            this.cropBox.getBoundingClientRect();

        const imageRect =
            this.imageClone.getBoundingClientRect();

        const scaleX =
            this.imageClone.naturalWidth /
            imageRect.width;

        const scaleY =
            this.imageClone.naturalHeight /
            imageRect.height;

        const cropX =
            (cropRect.left - imageRect.left)
            * scaleX;

        const cropY =
            (cropRect.top - imageRect.top)
            * scaleY;

        const cropWidth =
            cropRect.width * scaleX;

        const cropHeight =
            cropRect.height * scaleY;

        canvas.width =
            cropWidth;

        canvas.height =
            cropHeight;

        ctx.drawImage(

            this.imageClone,

            cropX,
            cropY,

            cropWidth,
            cropHeight,

            0,
            0,

            cropWidth,
            cropHeight
        );

        const croppedImage =
            canvas.toDataURL(
                "image/png"
            );

        this.currentImage.src =
            croppedImage;

        this.closeCropper();

        console.log(
            "Image cropped ✔"
        );
    }

    /* =====================================================
       CLOSE
    ===================================================== */

    closeCropper() {

        this.cropModal.classList.remove(
            "active"
        );

        this.currentImage = null;
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

        window.imageCropManager =
            new ImageCropManager(
                editor
            );
    }
);
