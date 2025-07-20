export function tratarErroPadrao(err, req, res, next) {
    const status = err.statusCode || 500
    res.status(status).json({ 
        erro: err.message,
        tipo: err.tipo || 'INTERNAL_ERROR'
    })
}