import crypto from 'crypto'

export function gerarId(prefixo = '') {
    const aleatorio = crypto.randomBytes(4).toString('hex'),
          timestamp = Date.now().toString(36)
    return `${prefixo}${timestamp}-${aleatorio}`
}