import { randomUUID } from "node:crypto";

export enum QueueStatus {
    NOT_IN_QUEUE,
    IN_QUEUE,
    SERVED
}

export type QueueEntry = {
    uuid: string,
    time_added: string,
};

export class Queue {
    entries: QueueEntry[] = [];
    pastEntries: QueueEntry[] = [];

    enqueue(uuid?: string) : QueueEntry {
        if (uuid === undefined)
            uuid = randomUUID().toString();

        const newQueueEntry: QueueEntry = {
            uuid: uuid,
            time_added: new Date().toDateString()
        };

        this.entries.push(newQueueEntry);

        return newQueueEntry;
    }

    dequeue(uuid: string) : QueueEntry | undefined {
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i].uuid === uuid) {
                let dequeuedElement = this.entries.splice(i, 1)[0];
                this.pastEntries.push(dequeuedElement);
                return dequeuedElement;
            }
        }
    }

    get(uuid: string) : QueueEntry | undefined {
        return this.entries.find(value => value.uuid == uuid);
    }


    dequeueFirst() : QueueEntry | undefined {
        let dequeuedElement = this.entries.shift();

        if (dequeuedElement !== undefined)
            this.pastEntries.push(dequeuedElement);

        return dequeuedElement;
    }

    getFirst() : QueueEntry | undefined {
        return this.entries[0];
    }

    getQueueStatus(uuid: string) : { status: QueueStatus, people_ahead?: number } {
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i].uuid === uuid) {
                return { status: QueueStatus.IN_QUEUE, people_ahead: i };
            }
        }

        for (let i = 0; i < this.pastEntries.length; i++) {
            if (this.pastEntries[i].uuid === uuid) {
                return { status: QueueStatus.SERVED };
            }
        }

        return { status: QueueStatus.NOT_IN_QUEUE };
    }
}

// horrible class name
export class UniqueQueueArray {
    queues: Queue[] = []

    constructor(initialQueueCount: number = 0) {
        console.log("I am unique queue array constructor");
        for (let i = 0; i < initialQueueCount; i++)
            this.queues.push(new Queue());
    }

    // horrible function name, horrible api. please redesign
    getQueueContainingUuid(uuid: string) : Queue | undefined {
        return this.queues.find(queue => queue.getQueueStatus(uuid).status === QueueStatus.IN_QUEUE);
    }

    // ditto
    getQueueNumberContainingUuid(uuid: string) : number | undefined {
        for (let i = 0; i < this.queues.length; i++) {
            if (this.queues[i].getQueueStatus(uuid).status === QueueStatus.IN_QUEUE)
                return i;
        }
        return undefined;
    }

    enqueue(room: number, uuid?: string) : QueueEntry | undefined {
        room = Math.floor(room);
        if (room < 0 || room >= this.queues.length)
            return undefined;

        if (uuid !== undefined) {
            for (let queue of this.queues)
                if (queue.getQueueStatus(uuid).status == QueueStatus.IN_QUEUE)
                    return undefined;

            return this.queues[room].enqueue(uuid);
        }
    }

    dequeue(uuid: string) : QueueEntry | undefined {
        let queue = this.getQueueContainingUuid(uuid);

        if (queue !== undefined)
            return queue.dequeue(uuid);
    }

    get(uuid: string) : QueueEntry | undefined {
        for (let i = 0; i < this.queues.length; i++) {
            let possibleEntry = this.queues[i].get(uuid);

            if (possibleEntry !== undefined)
                return possibleEntry;
        }
    }

    dequeueFirst(room: number) : QueueEntry | undefined {
        room = Math.floor(room);
        if (room < 0 || room >= this.queues.length)
            return undefined;

        return this.queues[room].dequeueFirst();
    }

    getFirst(room: number) : QueueEntry | undefined {
        room = Math.floor(room);
        if (room < 0 || room >= this.queues.length)
            return undefined;

        return this.queues[room].getFirst();
    }

    deserialize(data: string) {
        let obj = JSON.parse(data);
        if (Object.hasOwn(obj, "queues"))
            this.queues = structuredClone(obj["queues"]);
    }

    serialize() : string {
        let data = JSON.stringify(this);
        return data;
    }

}

// TODO: turn 3 into a configured variable. maybe roomsconfig.json or something.
// since this file is only about queues, maybe extract the singleton into another file
// which also handles loading from a file
let singletonQueues = new UniqueQueueArray(3);
export { singletonQueues };