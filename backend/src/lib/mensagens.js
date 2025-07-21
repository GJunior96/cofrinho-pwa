export const mensagens = {
    sucesso: {
        deposito: 'Valor adicionado com sucesso!',
        gasto: 'Gasto reistrado com sucesso!',
        resete: 'Cofrinho resetado com sucesso!',
        metaCriada: 'Meta criada com sucesso!'
    },
    erro: {
        valorInvalido: {
            mensagem: 'Valor inválido.',
            codigo: 400,
            tipo: 'VALOR_INVALIDO'
        },
        rotaInvalida: {
            mensagem: 'Rota não encontrada.',
            codigo: 404,
            tipo: 'ROTA_NAO_ENCONTRADA'
        },
        usuarioInvalida: {
            mensagem: 'Usuario inválido.',
            codigo: 404,
            tipo: 'USUARIO_INVALIDO'
        },
        metaNaoEncontrada: {
            mensagem: 'Meta não encontrada.',
            codigo: 404,
            tipo: 'META_NAO_ENCONTRADA'
        },
        usuarioObrigatorio: {
            mensagem: 'Usuário não informado.',
            codigo: 400,
            tipo: 'USUARIO_OBRIGATORIO'
        },
        escopoObrigatorio: {
            mensagem: 'Escopo não informado',
            codigo: 400,
            tipo: 'ESCOPO_OBRIGATORIO'
        },
        metaEncerrada: {
            mensagem: 'Meta já encerrada.',
            codigo: 403,
            tipo: 'META_ENCERRADA'
        },
        nomeMetaObrigatorio: {
            mensagem: 'Nome da meta não informado.',
            codigo: 400,
            tipo: 'NOME_META_OBRIGATORIO'
        },
        cofrinhoConjuntoNaoEncontrada: {
            mensagem: 'Cofrinho conjunto não encontrad.',
            codigo: 404,
            tipo: 'COFRINHO_CONJUNTO_NAO_ENCONTRADO'
        },
        usuariosConjuntoInvalidos: {
            mensagem: 'O número mínimo de usuários para criação de um cofrinho conjunto é 2.',
            codigo: 400,
            tipo: 'USUARIOS_CONJUNTO_INVALIDO'
        },
        usuarioJaPossuiCofrinho: {
            mensagem: 'O usuário informado já possui um cofrinho',
            codigo: 400,
            tipo: 'USUARIO_JA_POSSUI_COFRINHO'
        }
    }
}

export const mensagensErroPersonalizadas = {
    campoVazio: campo => `O campo ${campo} é obrigatório.`,
    formatoInvalido: campo => `O formato do campo ${campo} está incorreto.`
}