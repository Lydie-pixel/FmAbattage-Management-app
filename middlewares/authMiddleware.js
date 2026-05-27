function isAuthenticated(req, res, next) {

    if (!req.session.userId) {
        return res.status(401).json({
            error: "Non autorisé"
        });
    }

    next();
}

module.exports = isAuthenticated;