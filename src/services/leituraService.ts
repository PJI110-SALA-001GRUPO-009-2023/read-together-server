import { PrismaClient } from '@prisma/client'
import prismaInstance from '../prisma/prisma'
import { ClubeDadosPK, LeituraDadosCriar, LivroDadosPK } from '../types/services'
import logger from '../logger'

/**
 * Serviços relacionados às Leituras
 */
export class LeituraService {
    private static logger = logger.child({ contexto: LeituraService.name })
    /**
     * @param prisma default PrismaClient Global
     */
    constructor(private readonly prisma: PrismaClient = prismaInstance) {
        this.prisma = prisma
    }

    /**
     * Armazena nova leitura
     * @param clube Apenas PK é necessária, restante é ignorado
     * @param livro Apenas PK é necessária, restante é ignorado
     */
    public async criarLeitura(this:LeituraService, leitura: LeituraDadosCriar, clube: ClubeDadosPK, livro: LivroDadosPK) {
        return this.prisma.leitura.create({
            data: {
                ...leitura,
                clube: {
                    connect: { idClube: clube.idClube }
                },
                livro: {
                    connect: { idLivro: livro.idLivro }
                }
            }
        })
            .then(leitura => {
                LeituraService.logger.info('Leitura criada ID: %d', leitura.idLeitura)
                return leitura
            })
            .catch(err => {
                LeituraService.logger.error(err)
                throw err
            })
    }
}

/**
 * Instância Global LeituraService
 */
const leituraServiceInstance: LeituraService = new LeituraService()

export default leituraServiceInstance