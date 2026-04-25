module.exports = function isAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
};