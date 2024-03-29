import bcrypt from 'bcrypt'
import { ViewOptionsInterface } from '../types/routes'
import { join } from 'path'
import crypto from 'crypto'
import { promisify } from 'util'

export const UM_DIA_EM_MS = 86400000

export function gerarSenha(senha: string): Promise<string> {
    return bcrypt.hash(senha, 10)
}

export function compararSenhaComHash(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash)
}

export function preencherOpcoesDeRender(params?: Partial<ViewOptionsInterface>): ViewOptionsInterface {
    return {
        titulo: params?.titulo ?? 'Home',
        diretorioBase: params?.diretorioBase ?? '',
        cssCustomizados: params?.cssCustomizados ?? [],
        layout: obterPathDoArquivoDeLayout(params?.layout),
        clubes: params?.clubes ?? null,
        idUsuario: params?.idUsuario ?? null  
    }
}

function obterPathDoArquivoDeLayout(nomeArquivo = 'layout'): string {
    return join('..', 'views/layouts', nomeArquivo)
}

/**
 * Processa / parsea dados, principalmente vindos do cliente, precisam
 * de posterior validação para inferência de tipos. Caso tenha **certeza**
 * do tipo pode ser usado Type Assertion. Exemplo:
 * 
 * const dados = <Tipo>processaParam(params)
 * 
 * Utiliza as seguintes regras:
 * - Processa objetos recursivamente até dados primitivos como string e numbers
 * - Chaves começando com id, cod ou data tenta converter, caso falham retornam null
 * - Se nenhum dos casos for satisfeito, retorna o valor original
 * @param params objeto a ser parseado
 * @returns objeto pós parse
 */
export function processaParams(params: object): object {
    const entradas: [string, object | number | string | unknown][] = Object.entries(params).map(([chave, valor]) => {
        if (typeof valor === 'object') {
            return [chave, processaParams(valor)]
        }
        if (typeof chave === 'string' && typeof valor === 'string') {
            if (chave.startsWith('id') || chave.startsWith('cod')) {
                return [chave, converteStringNaoVaziaEmNumero(valor)]
            }
            if (chave.startsWith('data')) {
                return [chave, converteStringNaoVaziaEmData(valor)]
            }
        }
        return [chave, valor]
    })

    return Object.fromEntries(entradas)
}

function converteStringNaoVaziaEmNumero(s: string): number | null {
    if (s.trim().length === 0) {
        return null
    }
    if (!isNaN(Number(s))) {
        return Number(s)
    }
    return null
}

function converteStringNaoVaziaEmData(s: string): Date | null {
    if (s.trim().length === 0) {
        return null
    }
    if (!isNaN(Date.parse(s))) {
        return new Date(s)
    }
    return null
}

export function limpaCamposVazios(params: object): object {
    const entradas = Object.entries(params).filter(([chave, valor]) => valor !== undefined || valor !== null)
    return Object.fromEntries(entradas)
}

function sha1HexHash(key:string) {
    return crypto.createHash('sha1').update(key).digest('hex')
}

export const asyncSha1HexHash = (key: string) => {
    return new Promise<string>((resolve, reject) => {
        try {
            const h = sha1HexHash(key)
            console.log(h)
            resolve(h)
        } catch (error) {
            reject(error)
        }
    })
}