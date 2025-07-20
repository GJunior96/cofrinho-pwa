import { criarErro } from "../erros"
import { mensagens } from "../mensagens"

let metas = []

export function criarMeta({ nome, objetivo, usuario, escopo = 'conjunto', grupoId }) {

    if (!nome || typeof nome !== 'string') {
        throw criarErro(mensagens.erro.valorInvalido)
    }

    if (!objetivo || typeof objetivo !== 'number' || objetivo <= 0) {
        throw criarErro(mensagens.erro.valorInvalido)
    }

    if (!usuario || typeof usuario !== 'string' || usuario.trim() == '') {
        throw criarErro(mensagens.erro.valorInvalido)
    }

    if (!escopo || typeof escopo !== 'string' || ![ 'conjunto', 'pessoal' ].includes(escopo)) {
        throw criarErro(mensagens.erro.valorInvalido)
    }

    if (typeof grupoId !== 'string' && escopo == 'conjunto') {
        throw criarErro(mensagens.erro.valorInvalido)
    }

    const meta = {
        id: gerarMetaId(),
        nome,
        objetivo,
        saldo: 0,
        encerrada: false,
        escopo,
        usuario,
        grupoId: escopo == 'conjunto' ? grupoId : null,
        dataCriacao: new Date().toISOString()
    }

    metas.push(meta)
    return meta
}

export function consultarMetas({ escopo, usuario, grupoId }) {
    return metas.filter(meta => {
        if(escopo == 'pessoal') return meta.usuario == usuario
        if(escopo == 'conjunto') return meta.grupoId == (grupoId || 'padrao')
        return false
    })
}

export function consultarMetaPorId(id) {
    return metas.find(meta => meta.id == id)
}

export function depositarMeta({ id, valor }) {
    const meta = metas.find(m => m.id == id)

    if (!meta) {
        throw criarErro(mensagens.erro.metaNaoEncontrada)
    }

    if (meta.encerrada) {
        throw criarErro(mensagens.erro.metaEncerrada)
    }

    if (!valor || typeof valor !== 'number' || valor <= 0) {
        throw criarErro(mensagens.erro.valorInvalido)
    }

    meta.saldo += valor

    if (meta.saldo >= meta.objetivo) {
        meta.encerrada = true
    }

    return meta
}

export function removerMeta({ id }) {
    const meta = metas.find(m => m.id == id)

    if (!meta) {
        throw criarErro(mensagens.erro.metaNaoEncontrada)
    }
}

export function resetarMetas() {
    metas = []
}

function gerarMetaId() {
    return 'meta-' + Math.random().toString(36).substring(2, 9)
}