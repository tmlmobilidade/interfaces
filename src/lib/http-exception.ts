import HttpStatus from './http-status';

class HttpException extends Error {
	readonly statusCode: number;

	constructor(statusCode: number, message?: string) {
		super(message);
		this.statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
	}
}

export default HttpException;
