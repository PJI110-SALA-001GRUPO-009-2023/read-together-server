/* Deve vir no incio para permimtir debugs */
import * as dotenv from 'dotenv'
dotenv.config()

import * as utils from '../utils'

export const NODE_PORT: number = Number(process.env.NODE_PORT) || 8080
export const NODE_ENV: string = process.env.NODE_ENV || 'development'
export const DATABASE_URL: string =  process.env.DATABASE_URL || ''

export const SESSAO_SEGREDO: string = process.env.SESSAO_SEGREDO || ''
export const SESSAO_MAX_TEMPO: number = Number(process.env.SESSAO_MAX_TEMPO) || utils.UM_DIA_EM_MS
export const SESSAO_PERIODO_CHECK: number = Number(process.env.SESSAO_PERIODO_CHECK) || utils.UM_DIA_EM_MS

export const SEGREDO_JWT: string = process.env.SEGREDO_JWT || '3C65CA8655DB84ABF846572D4279C'

export const WINSTON_LOG_LEVEL: string = process.env.WINSTON_LOG_LEVEL || 'http'

export const GOOGLE_BOOKS_API: string = process.env.GOOGLE_BOOKS_API || ''

export const CHAVE_AZURE_EMAIL_COMMUNICATION_SERVICE = process.env.CHAVE_AZURE_EMAIL_COMMUNICATION_SERVICE || ''
export const ENDPOINT_AZURE_EMAIL_COMMUNICATION_SERVICE = process.env.ENDPOINT_AZURE_EMAIL_COMMUNICATION_SERVICE || ''
export const DOMINIO_AZURE_EMAIL_COMMUNICATION_SERVICE = process.env.DOMINIO_AZURE_EMAIL_COMMUNICATION_SERVICE || ''
export const URL_COM_TOKEN_SAS_AZURE_BLOB_STORAGE = process.env.URL_COM_TOKEN_SAS_AZURE_BLOB_STORAGE || ''