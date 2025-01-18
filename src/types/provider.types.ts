export interface SearchParams {
	query?: string
	tags?: string
	page?: number
	limit?: number
	format?: 'json' | 'xml'
	apiKey?: string
	userId?: string
	sort?: string
	order?: 'ASC' | 'DESC'
	[key: string]: unknown
}

export interface ProviderOptions {
	apiKey?: string
	userId?: string
	defaultLimit?: number
	baseUrl: string
	defaultParams?: Record<string, string>
	timeout?: number
}

export interface SearchResponse<T = unknown> {
	success: boolean
	data: T[]
	error?: string
	count?: number
	url?: string
	totalCount?: number
	hasMore?: boolean
}
