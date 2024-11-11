import EventEmitter from "events";

export enum EventType {
	TypingEvent = "typingEvent",
	FetchingReady = "fetchingReady",
	WebsiteFetched = "websiteFetched",
	Recursion = "recursion",
}

export type Listener<T extends EventType> = T extends EventType.TypingEvent
	? (data: string) => void
	: T extends EventType.FetchingReady
	? (data: number) => void
	: T extends EventType.WebsiteFetched
	? () => void
	: T extends EventType.Recursion
	? () => void
	: never;

export type Args<T extends EventType> = T extends EventType.TypingEvent
	? [string] | []
	: T extends EventType.FetchingReady
	? [number]
	: T extends EventType.WebsiteFetched
	? []
	: T extends EventType.Recursion
	? []
	: never;

class Events extends EventEmitter {
	public emit<T extends EventType>(event: T, ...args: Args<T>) {
		return super.emit(event, ...args);
	}

	public on<T extends EventType>(event: T, listener: Listener<T>) {
		return super.on(event, listener);
	}

	public once<T extends EventType>(event: T, listener: Listener<T>) {
		return super.once(event, listener);
	}
}

export default new Events();
