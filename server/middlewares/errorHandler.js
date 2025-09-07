
// PostgreSQL specific error handling
function postgresErrorHandler(err, req, res, next) {
    if (err.code === '23505')
        return res.status(409).json({ message: "Email already exists." });
    else if (err.code === '23502')
        return res.status(400).json({ message: `Missing required field: ${err.column}` });
    else
        next(err);
}

// Generic fallback handler
function globalErrorHandler(err, req, res, next) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error!" });
}

module.exports = {
    postgresErrorHandler,
    globalErrorHandler
};
