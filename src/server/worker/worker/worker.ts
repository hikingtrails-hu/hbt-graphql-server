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

export class Worker<M extends WorkerMessage> {
    constructor(
        private readonly jobs: Jobs<M>
    ) {}

    public async handle(message: M): Promise<void> {
        const job = this.jobs[message.type as M['type']]
        if (!job) {
            throw new InvalidMessage(`Invalid message: ${JSON.stringify(message)}`)
        }
        void await job(message.data as unknown as never)
    }
}

export interface Sender {
    send: <M extends WorkerMessage>(message: M) => Promise<void>
}
