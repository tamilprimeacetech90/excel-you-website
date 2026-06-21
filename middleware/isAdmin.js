module.exports = function isAdmin(req, res, next) {
    if (!req.session.adminId) {
        return res.redirect("/Login.html");
    }
    next();
};