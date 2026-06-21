/* =========================================================
   EXCEL YOU SEO MANAGER
========================================================= */

class SEOManager {

    constructor(editor) {

        this.editor = editor;

        this.maxTitleLength = 60;

        this.maxDescriptionLength = 160;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupSlugGenerator();

        this.setupSEOInputs();

        this.setupLiveSEOScore();

        this.setupKeywordExtractor();

        console.log(
            "SEO Manager Initialized ✔"
        );
    }

    /* =====================================================
       SLUG GENERATOR
    ===================================================== */

    setupSlugGenerator() {

        const titleInput =
            document.getElementById(
                "articleTitle"
            );

        const slugInput =
            document.getElementById(
                "articleSlug"
            );

        if (
            !titleInput ||
            !slugInput
        ) {
            return;
        }

        titleInput.addEventListener(
            "input",
            () => {

                const slug =
                    this.generateSlug(

                        titleInput.value
                    );

                slugInput.value =
                    slug;

                this.updateSEO();
            }
        );
    }

    /* =====================================================
       GENERATE SLUG
    ===================================================== */

    generateSlug(text) {

        return text

            .toLowerCase()

            .trim()

            .replace(

                /[^a-z0-9\s-]/g,

                ""
            )

            .replace(

                /\s+/g,

                "-"
            )

            .replace(

                /-+/g,

                "-"
            );
    }

    /* =====================================================
       SEO INPUT EVENTS
    ===================================================== */

    setupSEOInputs() {

        const seoTitle =
            document.getElementById(
                "seoTitle"
            );

        const seoDescription =
            document.getElementById(
                "seoDescription"
            );

        if (
            seoTitle
        ) {

            seoTitle.addEventListener(
                "input",
                () => {

                    this.updateTitleCounter();

                    this.updateSEO();
                }
            );
        }

        if (
            seoDescription
        ) {

            seoDescription.addEventListener(
                "input",
                () => {

                    this.updateDescriptionCounter();

                    this.updateSEO();
                }
            );
        }
    }

    /* =====================================================
       TITLE COUNTER
    ===================================================== */

    updateTitleCounter() {

        const seoTitle =
            document.getElementById(
                "seoTitle"
            );

        const counter =
            document.getElementById(
                "seoTitleCount"
            );

        if (
            !seoTitle ||
            !counter
        ) {
            return;
        }

        const length =
            seoTitle.value.length;

        counter.innerText =
`
${length}/${this.maxTitleLength}
`;

        // Color warnings
        if (
            length > this.maxTitleLength
        ) {

            counter.style.color =
                "#ef4444";
        }
        else {

            counter.style.color =
                "#22c55e";
        }
    }

    /* =====================================================
       DESCRIPTION COUNTER
    ===================================================== */

    updateDescriptionCounter() {

        const seoDescription =
            document.getElementById(
                "seoDescription"
            );

        const counter =
            document.getElementById(
                "seoDescriptionCount"
            );

        if (
            !seoDescription ||
            !counter
        ) {
            return;
        }

        const length =
            seoDescription.value
            .length;

        counter.innerText =
`
${length}/${this.maxDescriptionLength}
`;

        if (
            length > this.maxDescriptionLength
        ) {

            counter.style.color =
                "#ef4444";
        }
        else {

            counter.style.color =
                "#22c55e";
        }
    }

    /* =====================================================
       LIVE SEO SCORE
    ===================================================== */

    setupLiveSEOScore() {

        setInterval(() => {

            this.updateSEO();

        }, 1500);
    }

    /* =====================================================
       UPDATE SEO
    ===================================================== */

    updateSEO() {

        const score =
            this.calculateSEOScore();

        this.renderSEOScore(
            score
        );

        this.renderPreview();
    }

    /* =====================================================
       SEO SCORE
    ===================================================== */

    calculateSEOScore() {

        let score = 0;

        const title =
            document.getElementById(
                "articleTitle"
            )?.value || "";

        const seoTitle =
            document.getElementById(
                "seoTitle"
            )?.value || "";

        const seoDescription =
            document.getElementById(
                "seoDescription"
            )?.value || "";

        const content =
            this.editor.innerText
            .trim();

        // =====================
        // TITLE
        // =====================
        if (
            title.length >= 10
        ) {

            score += 20;
        }

        // =====================
        // SEO TITLE
        // =====================
        if (
            seoTitle.length >= 20 &&
            seoTitle.length <= 60
        ) {

            score += 25;
        }

        // =====================
        // DESCRIPTION
        // =====================
        if (
            seoDescription.length >= 50 &&
            seoDescription.length <= 160
        ) {

            score += 25;
        }

        // =====================
        // CONTENT LENGTH
        // =====================
        if (
            content.length >= 300
        ) {

            score += 30;
        }

        return score;
    }

    /* =====================================================
       RENDER SCORE
    ===================================================== */

    renderSEOScore(score) {

        const scoreElement =
            document.getElementById(
                "seoScore"
            );

        if (!scoreElement) {
            return;
        }

        scoreElement.innerText =
`
SEO Score: ${score}/100
`;

        // Colors
        if (score < 40) {

            scoreElement.style.color =
                "#ef4444";
        }

        else if (score < 70) {

            scoreElement.style.color =
                "#f59e0b";
        }

        else {

            scoreElement.style.color =
                "#22c55e";
        }
    }

    /* =====================================================
       GOOGLE PREVIEW
    ===================================================== */

    renderPreview() {

        const title =
            document.getElementById(
                "seoTitle"
            )?.value ||

            document.getElementById(
                "articleTitle"
            )?.value ||

            "Article Title";

        const description =
            document.getElementById(
                "seoDescription"
            )?.value ||

            "Meta description preview...";

        const slug =
            document.getElementById(
                "articleSlug"
            )?.value ||

            "article-url";

        const preview =
            document.getElementById(
                "seoPreview"
            );

        if (!preview) {
            return;
        }

        preview.innerHTML = `

<div class="google-preview">

    <h3>
        ${title}
    </h3>

    <span>
        https://excelyou.com/${slug}
    </span>

    <p>
        ${description}
    </p>

</div>

        `;
    }

    /* =====================================================
       KEYWORD EXTRACTION
    ===================================================== */

    setupKeywordExtractor() {

        setInterval(() => {

            this.extractKeywords();

        }, 3000);
    }

    /* =====================================================
       EXTRACT KEYWORDS
    ===================================================== */

    extractKeywords() {

        const content =
            this.editor.innerText
            .toLowerCase();

        const keywordBox =
            document.getElementById(
                "keywordSuggestions"
            );

        if (!keywordBox) {
            return;
        }

        // Clean words
        const words =
            content.match(
                /\b[a-z]{4,}\b/g
            ) || [];

        // Count frequency
        const frequency = {};

        words.forEach(word => {

            frequency[word] =

                (frequency[word] || 0)
                + 1;
        });

        // Sort
        const sorted =
            Object.entries(
                frequency
            )
            .sort(

                (a, b) =>

                    b[1] - a[1]
            )
            .slice(0, 10);

        keywordBox.innerHTML =
            sorted.map(

                item =>

`
<span class="keyword-chip">
${item[0]}
</span>
`
            ).join("");
    }

    /* =====================================================
       CANONICAL URL
    ===================================================== */

    generateCanonicalURL() {

        const slug =
            document.getElementById(
                "articleSlug"
            )?.value || "";

        return `
https://excelyou.com/articles/${slug}
        `.trim();
    }

    /* =====================================================
       OPEN GRAPH DATA
    ===================================================== */

    generateOpenGraphData() {

        const title =
            document.getElementById(
                "seoTitle"
            )?.value || "";

        const description =
            document.getElementById(
                "seoDescription"
            )?.value || "";

        const thumbnail =
            document.querySelector(
                ".thumbnail-preview img"
            )?.src || "";

        return {

            ogTitle:
                title,

            ogDescription:
                description,

            ogImage:
                thumbnail,

            ogURL:
                this.generateCanonicalURL()
        };
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

        window.seoManager =
            new SEOManager(
                editor
            );
    }
);
