import net from 'net'
import { fromEventEmitter } from '../utils/fromEventEmitter'

export type ServerEvent =
    | { type: 'connection' }
    | { type: 'listening' }

export const fromServer = (server: net.Server) => fromEventEmitter<ServerEvent>(server, {
    complete: ['close'],
    error: ['error'],
    next: ['connection', 'listening'],
})
