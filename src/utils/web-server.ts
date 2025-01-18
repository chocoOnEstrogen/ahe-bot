import { ServerResponse } from 'http'

interface ApiResponse<T> {
	success: boolean
	data?: T
	error?: string
	statusCode: number
}

export function sendResponse<T>(
	res: ServerResponse,
	data: T | null,
	statusCode: number = 200,
	error?: string,
) {
	const response: ApiResponse<T> = {
		success: statusCode >= 200 && statusCode < 300,
		statusCode,
	}

	if (error) {
		response.error = error
	} else if (data !== null) {
		response.data = data
	}

	res.writeHead(statusCode, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify(response))
}
