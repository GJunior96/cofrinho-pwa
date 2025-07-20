import { consultarMetaPorId, consultarMetas, criarMeta, resetarMetas } from "../../src/lib/cofrinho/metas"
import { mensagens } from "../../src/lib/mensagens"
import { describe, it, expect, beforeEach } from 'vitest'

describe('Função criarMeta', () => {
    beforeEach(() => {
        resetarMetas()
    })

    describe.each([
        { valido: true, nome: 'teste', objetivo: 400, escopo: 'pessoal', usuario: 'usuario teste', descricao: 'escopo pessoal, obetivo inteiro, usuario teste e nome teste' },
        { valido: true, nome: 'teste', objetivo: 400, escopo: 'conjunto', usuario: 'usuario teste', grupoId: 'teste', descricao: 'escopo conjunto, obetivo inteiro, usuario teste e nome teste' },
        { valido: true, nome: 'teste', objetivo: 400, usuario: 'usuario teste', grupoId: 'teste', descricao: 'escopo da meta faltando, utiliza padrao conjunto' },
        { valido: true, nome: 'teste', objetivo: 400, escopo: undefined, usuario: 'usuario teste', grupoId:'teste', descricao: 'escopo da meta com tipo undefined, utiliza padrao conjunto' },
        { valido: false, nome: 'teste', objetivo: 400, escopo: 'conjunto', usuario: 'usuario teste', descricao: 'escopo conjunto, mas grupoId faltando' },
        { valido: false, objetivo: 400, escopo: 'pessoal', usuario: 'usuario teste', descricao: 'nome da meta faltando' },
        { valido: false, nome: 'teste', escopo: 'pessoal', usuario: 'usuario teste', descricao: 'objetivo da meta faltando' },
        { valido: false, nome: 'teste', objetivo: 400, escopo: 'pessoal', descricao: 'usuario da meta faltando' },
        { valido: false, nome: 100, objetivo: 400, escopo: 'pessoal', usuario: 'usuario teste', descricao: 'nome da meta como tipo number' },
        { valido: false, nome: undefined, objetivo: 400, escopo: 'pessoal', usuario: 'usuario teste', descricao: 'nome da meta como tipo undefined' },
        { valido: false, nome: null, objetivo: 400, escopo: 'pessoal', usuario: 'usuario teste', descricao: 'nome da meta como tipo null' },
        { valido: false, nome: '', objetivo: 400, escopo: 'pessoal', usuario: 'usuario teste', descricao: 'nome da meta vazio' },
        { valido: false, nome: 'teste', objetivo: 'dez reais', escopo: 'pessoal', usuario: 'usuario teste', descricao: 'objetivo da meta como tipo string' },
        { valido: false, nome: 'teste', objetivo: undefined, escopo: 'pessoal', usuario: 'usuario teste', descricao: 'objetivo da meta como tipo undefined' },
        { valido: false, nome: 'teste', objetivo: null, escopo: 'pessoal', usuario: 'usuario teste', descricao: 'objetivo da meta como tipo null' },
        { valido: false, nome: 'teste', objetivo: 0, escopo: 'pessoal', usuario: 'usuario teste', descricao: 'objetivo da meta com valor 0' },
        { valido: false, nome: 'teste', objetivo: -5, escopo: 'pessoal', usuario: 'usuario teste', descricao: 'objetivo da meta com valor negativo' },
        { valido: false, nome: 'teste', objetivo: 400, escopo: 1, usuario: 'usuario teste', descricao: 'escopo da meta com tipo number' },
        { valido: false, nome: 'teste', objetivo: 400, escopo: null, usuario: 'usuario teste', descricao: 'escopo da meta com tipo null' },
        { valido: false, nome: 'teste', objetivo: 400, escopo: '', usuario: 'usuario teste', descricao: 'escopo da meta vazio' },
        { valido: false, nome: 'teste', objetivo: 400, escopo: 'teste', usuario: 'usuario teste', descricao: 'escopo da meta com string teste' },
        { valido: false, nome: 'teste', objetivo: 400, escopo: 'pessoal', usuario: undefined, descricao: 'usuario da meta com tipo undefined' },
        { valido: false, nome: 'teste', objetivo: 400, escopo: 'pessoal', usuario: '', descricao: 'usuario da meta vazio' },
        { valido: false, nome: 'teste', objetivo: 400, escopo: 'pessoal', usuario: null, descricao: 'usuario da meta com tipo null' },
        { valido: false, nome: 'teste', objetivo: 400, escopo: 'pessoal', usuario: 10, descricao: 'usuario da meta com tipo number' },
    ])('Teste com $descricao', ({ valido, nome, objetivo, escopo, usuario, grupoId }) => {
        if(valido) {
            it('deve aceitar a criacao da meta', () => {
                const metaNova = criarMeta({ nome: nome, objetivo: objetivo, usuario: usuario, escopo: escopo, grupoId: grupoId }),
                      meta = consultarMetaPorId(metaNova.id)

                expect(consultarMetas({ escopo: escopo !== undefined ? escopo : 'conjunto', usuario:usuario, grupoId:grupoId })).toHaveLength(1)
                expect(metaNova.id).toBe(meta.id)
            })
        } else {
            it('deve apresentar erro', () => {
                expect(() => criarMeta({ nome: nome, objetivo: objetivo, usuario: usuario, escopo: escopo }))
                .toThrow(mensagens.erro.valorInvalido.mensagem)
            })
        }
    })
})

describe('Função depositar meta', () => {
    const metaPessoal = criarMeta({ nome: 'meta pessoal', objetivo: 200, usuario: 'usuario teste 1', escopo: 'pessoal' }),
          metaConjunta = criarMeta({ nome: 'meta conjunta', objetivo: 500, usuario: 'usuario teste 2', escopo: 'conjunto', grupoId: 'teste' })

    describe.each([
        {  }
    ])
})