export enum BlueskyErrorCodes {
	LOGIN_FAILED = 0xa3f1,
	INTERNAL_SERVER_ERROR = 0xe724,
}

export class BlueskyError extends Error {
	code: BlueskyErrorCodes
	message: string

	constructor(message: string, code: BlueskyErrorCodes) {
		super(message)
		this.name = 'BlueskyError'
		this.code = code
		this.message = message
	}
}
