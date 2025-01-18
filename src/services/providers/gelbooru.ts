import { AxiosRequestConfig } from 'axios'

import { ProviderBase } from '@/classes/Provider.Base'
import {
	SearchParams,
	SearchResponse,
	ProviderOptions,
} from '@/types/provider.types'

export interface GelbooruPost {
	id: number
	score: number
	file_url: string
	tags: string
	preview_url: string
	width: number
	height: number
	change: number
	rating: string
	source: string
	creator_id: number
	parent_id: number | null
	sample: boolean
	sample_height: number
	sample_width: number
	status: string
	has_notes: boolean
	has_comments: boolean
	has_children: boolean
}

export interface GelbooruOptions extends ProviderOptions {
	apiKey?: string
	userId?: string
}

export class Gelbooru extends ProviderBase {
	constructor(options?: Partial<GelbooruOptions>) {
		super({
			baseUrl: 'https://gelbooru.com/index.php',
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
			api_key: this.options.apiKey || '',
			user_id: this.options.userId || '',
		}
	}

	protected transformResponse<T>(response: unknown): SearchResponse<T> {
		const data = response as { post?: T[]; '@attributes'?: { count: number } }
		const posts = data?.post || []
		const attributes = data?.['@attributes'] || { count: 0 }

		return {
			success: true,
			data: posts,
			totalCount: attributes.count,
			hasMore: posts.length === (this.options.defaultLimit || 100),
		}
	}

	search<T = GelbooruPost>(
		params: SearchParams,
		config?: AxiosRequestConfig,
	): Promise<SearchResponse<T>> {
		return super.search<T>(params, config)
	}
}
