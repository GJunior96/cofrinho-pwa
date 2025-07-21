export function formatarData(dataIso) {
    const data = new Date(dataIso)
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR')
}