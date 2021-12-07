export interface WorkerMessage<
    Type extends string = string,
    Data extends Record<string, unknown> = Record<string, unknown>
> {
    type: Type
    data: Data
}

export type Jobs<M extends WorkerMessage> = {
    [message in M as message['type']]: (data: message['data']) => Promise<void>
}

export class InvalidMessage extends Error {}

export type HandleMessage<M extends WorkerMessage> = (message: M) => Promise<void>

export type SendMessage = <M extends WorkerMessage>(message: M) => Promise<void>

export const handleMessage = <M extends WorkerMessage>(jobs: Jobs<M>): HandleMessage<M> =>
    async (message: M): Promise<void> => {
        const job = jobs[message.type as M['type']]
        if (!job) {
            throw new InvalidMessage(`Invalid message: ${JSON.stringify(message)}`)
        }
        void await job(message.data as unknown as never)
    }
