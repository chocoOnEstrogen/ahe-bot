import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import blockList from '@/resources/block_list.json'

import {
	SearchParams,
	SearchResponse,
	ProviderOptions,
} from '@/types/provider.types'

export abstract class ProviderBase {
	protected readonly client: AxiosInstance
	protected readonly options: ProviderOptions

	constructor(options: ProviderOptions) {
		this.options = {
			defaultLimit: 100,
			...options,
		}

		this.client = axios.create({
			baseURL: options.baseUrl,
			timeout: options.timeout || 10000,
		})
	}

	protected abstract transformResponse<T>(response: unknown): SearchResponse<T>
	protected abstract buildSearchParams(
		params: SearchParams,
	): Record<string, string>

	protected async search<T>(
		params: SearchParams,
		config?: AxiosRequestConfig,
	): Promise<SearchResponse<T>> {
		try {
			const searchParams = this.buildSearchParams(params)
			const response = await this.client.get('', {
				...config,
				params: searchParams,
			})

			const filteredResponse = this.filterBlockedTerms(response.data)

			return this.transformResponse<T>(filteredResponse)
		} catch (error) {
			return {
				success: false,
				data: [],
				error:
					error instanceof Error ? error.message : 'Unknown error occurred',
			}
		}
	}

	protected filterBlockedTerms(data: any): any {
		// If data is not an array, return as is
		if (!Array.isArray(data)) {
			return data
		}

		// Filter out posts that contain blocked terms in their tags
		return data.filter((post) => {
			// Skip if post has no tags
			if (!post.tags) {
				return true
			}

			// Convert tags to array if it's a string
			const tags =
				typeof post.tags === 'string' ? post.tags.split(' ') : post.tags

			// Check if any blocked terms exist in the tags
			return !blockList.some((blockedItem) =>
				tags.some((tag: string) =>
					tag.toLowerCase().includes(blockedItem.term.toLowerCase()),
				),
			)
		})
	}
}
