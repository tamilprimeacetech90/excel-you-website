/* =========================================================
   EXCEL YOU NOTIFICATION SYSTEM
========================================================= */

class NotificationManager {

    constructor() {

        this.container = null;

        this.maxNotifications = 5;

        this.duration = 4000;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.createContainer();

        console.log(
            "Notification Manager Initialized ✔"
        );
    }

    /* =====================================================
       CREATE CONTAINER
    ===================================================== */

    createContainer() {

        // Prevent duplicate
        if (
            document.getElementById(
                "notificationContainer"
            )
        ) {

            this.container =
                document.getElementById(
                    "notificationContainer"
                );

            return;
        }

        this.container =
            document.createElement(
                "div"
            );

        this.container.id =
            "notificationContainer";

        this.container.className =
            "notification-container";

        document.body.appendChild(
            this.container
        );
    }

    /* =====================================================
       SHOW NOTIFICATION
    ===================================================== */

    show({

        type = "info",

        title = "Notification",

        message = "",

        duration = this.duration

    }) {

        // Limit notifications
        this.limitNotifications();

        // Create notification
        const notification =
            document.createElement(
                "div"
            );

        notification.className =
`
notification ${type}
`;

        // Icon
        const icon =
            this.getIcon(type);

        // HTML
        notification.innerHTML = `

<div class="notification-left">

    <div class="notification-icon">

        <i class="${icon}"></i>

    </div>

    <div class="notification-content">

        <h4>
            ${title}
        </h4>

        <p>
            ${message}
        </p>

    </div>

</div>

<button class="notification-close">

    <i class="fas fa-xmark"></i>

</button>

        `;

        // Append
        this.container.appendChild(
            notification
        );

        // Animate
        setTimeout(() => {

            notification.classList.add(
                "show"
            );

        }, 10);

        // Close button
        const closeBtn =
            notification.querySelector(
                ".notification-close"
            );

        closeBtn.addEventListener(
            "click",
            () => {

                this.remove(
                    notification
                );
            }
        );

        // Auto remove
        setTimeout(() => {

            this.remove(
                notification
            );

        }, duration);

        return notification;
    }

    /* =====================================================
       REMOVE
    ===================================================== */

    remove(notification) {

        if (!notification) {
            return;
        }

        notification.classList.remove(
            "show"
        );

        notification.classList.add(
            "hide"
        );

        setTimeout(() => {

            notification.remove();

        }, 350);
    }

    /* =====================================================
       LIMIT
    ===================================================== */

    limitNotifications() {

        const notifications =
            this.container.querySelectorAll(
                ".notification"
            );

        if (
            notifications.length >=
            this.maxNotifications
        ) {

            this.remove(
                notifications[0]
            );
        }
    }

    /* =====================================================
       ICONS
    ===================================================== */

    getIcon(type) {

        switch (type) {

            case "success":

                return `
fas fa-circle-check
`;

            case "error":

                return `
fas fa-circle-xmark
`;

            case "warning":

                return `
fas fa-triangle-exclamation
`;

            case "info":

                return `
fas fa-circle-info
`;

            default:

                return `
fas fa-bell
`;
        }
    }

    /* =====================================================
       SHORTCUT METHODS
    ===================================================== */

    success(

        title,

        message

    ) {

        this.show({

            type: "success",

            title,

            message
        });
    }

    error(

        title,

        message

    ) {

        this.show({

            type: "error",

            title,

            message
        });
    }

    warning(

        title,

        message

    ) {

        this.show({

            type: "warning",

            title,

            message
        });
    }

    info(

        title,

        message

    ) {

        this.show({

            type: "info",

            title,

            message
        });
    }

    /* =====================================================
       LOADING NOTIFICATION
    ===================================================== */

    loading(message = "Loading...") {

        return this.show({

            type: "info",

            title: "Please Wait",

            message,

            duration: 999999
        });
    }

    /* =====================================================
       CLEAR ALL
    ===================================================== */

    clearAll() {

        const notifications =
            this.container.querySelectorAll(
                ".notification"
            );

        notifications.forEach(
            notification => {

                this.remove(
                    notification
                );
            }
        );
    }
}

/* =========================================================
   GLOBAL INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.notify =
            new NotificationManager();
    }
);

/* =========================================================
   EXAMPLES
========================================================= */

// notify.success(
//     "Saved",
//     "Article saved successfully"
// );

// notify.error(
//     "Upload Failed",
//     "Image upload failed"
// );

// notify.warning(
//     "Offline",
//     "You are offline"
// );

// notify.info(
//     "Publishing",
//     "Publishing article..."
// );
