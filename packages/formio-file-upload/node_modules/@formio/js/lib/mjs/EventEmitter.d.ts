export default class EventEmitter extends EventEmitter3<string | symbol, any> {
    constructor(conf?: {});
    emit: (...args: any[]) => void;
    onAny: (fn: any) => void;
    offAny: (fn: any) => void;
}
import { EventEmitter as EventEmitter3 } from 'eventemitter3';
