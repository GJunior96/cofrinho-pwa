import { gerarId, formatarData, normalizarTexto, clone } from '../../src/lib/utils'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Funções utilitárias', () => {
  
  describe('gerarId()', () => {
    it('deve gerar um ID único com prefixo', () => {
      const id = gerarId('meta_')
      expect(id).toMatch(/^meta_/)
      expect(id.length).toBeGreaterThan(10)
    })
  })

  describe('formatarData()', () => {
    it('deve formatar uma data ISO corretamente', () => {
      const agora = new Date().toISOString()
      const formatado = formatarData(agora)
      expect(typeof formatado).toBe('string')
      expect(formatado).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/)
    })
  })

  describe('normalizarTexto()', () => {
    it('deve normalizar texto tirando espaços e deixando lowercase', () => {
      expect(normalizarTexto('  Gilberto  ')).toBe('gilberto')
      expect(normalizarTexto('COFRINHO')).toBe('cofrinho')
      expect(normalizarTexto(null)).toBeUndefined()
    })
  })

  describe('clone()', () => {
    it('deve criar um clone profundo de objeto', () => {
      const original = { a: 1, b: { c: 2 } }
      const clonado = clone(original)
      expect(clonado).toEqual(original)
      expect(clonado).not.toBe(original)
      expect(clonado.b).not.toBe(original.b)
    })
  })

})