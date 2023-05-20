import * as config from '../config'
import { EmailClient, EmailMessage, KnownEmailSendStatus } from '@azure/communication-email'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import logger from '../logger'

class EmailService {
    #connectionString: string
    #emailClient: EmailClient
    #POLLER_TEMPO_ESPERA: number
    #dominioEmailApp: string

    constructor() {
        this.#connectionString = config.COMMUNICATION_SERVICES_CONNECTION_STRING
        this.#emailClient = new EmailClient(this.#connectionString)
        this.#POLLER_TEMPO_ESPERA = 10
        this.#dominioEmailApp = 'DoNotReply@c7bb72eb-d9ca-4e21-92f2-823432e90a58.azurecomm.net'
    }

    #obterTemplateEmailHtmlPreenchidoComVariaveis(
        nomeClube: string,
        nomeRemetente: string,
        nomeDestinatario: string): string {
        const htmlBase = readFileSync(
            resolve('views', 'templates', 'convite-email.min.html'),
            { encoding: 'utf8' }
        )
        console.log(htmlBase.substring(0, 20))
        htmlBase
            .replace('${nome_clube}', nomeClube)
            .replace('${nome_remetente}', nomeRemetente)
            .replace('${nome_destinatario}', nomeDestinatario)
        return htmlBase
    }

    #contruirConteudoEmail(
        nomeClube: string,
        nomeRemetente: string,
        nomeDestinatario: string,
        emailDestinatario: string): EmailMessage {
        const message: EmailMessage = {
            senderAddress: this.#dominioEmailApp,
            content: {
                subject: 'Convite para Participar do Clube do Livro',
                html: this.#obterTemplateEmailHtmlPreenchidoComVariaveis(nomeClube, nomeRemetente, nomeDestinatario)
            },
            recipients: {
                to: [{
                    address: `<${emailDestinatario}>`,
                    displayName: nomeDestinatario
                }]
            }
        }
        return message
    }

    async enviarEmailDeConvite(
        nomeClube: string,
        nomeRemetente: string,
        nomeDestinatario: string,
        emailDestinatario: string) {
        try {
            const mensagemEmail = this.#contruirConteudoEmail(nomeClube, nomeRemetente, nomeDestinatario, emailDestinatario)
            const poller = await this.#emailClient.beginSend(mensagemEmail)
            if (!poller.getOperationState().isStarted) {
                throw new Error('Email send polling in progress')
            }

            let tempoDecorrido = 0
            while (!poller.isDone()) {
                poller.poll()
                console.log('Envio de e-mail em progresso')

                await new Promise((resolve) => setTimeout(resolve, this.#POLLER_TEMPO_ESPERA * 1000))
                tempoDecorrido += 10

                if (tempoDecorrido > 18 * this.#POLLER_TEMPO_ESPERA) {
                    logger.error('Envio de e-mail demorou demais...')
                    return
                }
            }

            if (poller.getResult()?.status === KnownEmailSendStatus.Succeeded) {
                console.log('email enviado!')
            } else {
                logger.error(poller.getResult())
            }
        } catch (e) {
            console.error(e)
        }
    }
}

/**
 * Instância Global EmailService
 */
const emailServiceInstance: EmailService = new EmailService()

export default emailServiceInstance