import net, { Socket } from 'net'
import { fromEventEmitter } from '../utils/fromEventEmitter'

export type ServerEvent =
    | { event: 'connection', args: [Socket] }
    | { event: 'listening' }

export const fromServer = (server: net.Server) => fromEventEmitter<ServerEvent>(server, {
  complete: ['close'],
  error: ['error'],
  next: ['connection', 'listening'],
})
