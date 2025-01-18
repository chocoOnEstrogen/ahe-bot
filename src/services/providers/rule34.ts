import { AxiosRequestConfig } from 'axios'

import { ProviderBase } from '@/classes/Provider.Base'
import {
	SearchParams,
	SearchResponse,
	ProviderOptions,
} from '@/types/provider.types'

export interface Rule34Post {
	id: number
	score: number
	file_url: string
	tags: string
	preview_url: string
	width: number
	height: number
	rating: string
	source: string
	sample: boolean
	sample_height: number
	sample_width: number
}

export class Rule34 extends ProviderBase {
	constructor(options?: Partial<ProviderOptions>) {
		super({
			baseUrl: 'https://api.rule34.xxx/index.php',
			defaultParams: {
				page: 'dapi',
				s: 'post',
				q: 'index',
				json: '1',
			},
			...options,
		})
	}

	protected buildSearchParams(params: SearchParams): Record<string, string> {
		return {
			...this.options.defaultParams,
			tags: params.query || '',
			pid: String(Math.max(0, (params.page || 1) - 1)),
			limit: String(params.limit || this.options.defaultLimit),
		}
	}

	protected transformResponse<T>(response: unknown): SearchResponse<T> {
		const posts = Array.isArray(response) ? response : []
		return {
			success: true,
			data: posts as T[],
			hasMore: posts.length === (this.options.defaultLimit || 100),
		}
	}

	search<T = Rule34Post>(
		params: SearchParams,
		config?: AxiosRequestConfig,
	): Promise<SearchResponse<T>> {
		return super.search<T>(params, config)
	}
}
