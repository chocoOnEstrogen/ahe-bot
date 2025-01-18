import { BskyAgent } from '@atproto/api'
import { BlueskyError, BlueskyErrorCodes } from '@/errors/Bluesky'
import { IPost } from '@/interfaces/IPost'
import { addRecentPost } from '@/server'

export class Bluesky {
	private agent: BskyAgent

	constructor() {
		if (!process.env.BLUESKY_IDENTIFIER || !process.env.BLUESKY_PASSWORD) {
			throw new BlueskyError(
				'BLUESKY_IDENTIFIER and BLUESKY_PASSWORD must be set',
				BlueskyErrorCodes.LOGIN_FAILED,
			)
		}

		this.agent = new BskyAgent({
			service: 'https://bsky.social',
		})
	}

	async init() {
		try {
			await this.agent.login({
				identifier: process.env.BLUESKY_IDENTIFIER!,
				password: process.env.BLUESKY_PASSWORD!,
			})
		} catch (error) {
			throw new BlueskyError(
				'Failed to login to Bluesky',
				BlueskyErrorCodes.LOGIN_FAILED,
			)
		}
	}

	static async createPost(postData: IPost) {
		if (postData.images && postData.images.length > 4) {
			throw new BlueskyError(
				'Bluesky does not support more than 4 images per post',
				BlueskyErrorCodes.INTERNAL_SERVER_ERROR,
			)
		}

		try {
			const agent = new BskyAgent({
				service: 'https://bsky.social',
			})

			await agent.login({
				identifier: process.env.BLUESKY_IDENTIFIER!,
				password: process.env.BLUESKY_PASSWORD!,
			})

			const data: any = {
				text: postData.text,
				tags: postData.tags,
				createdAt: new Date().toISOString(),
			}

			if (postData.images && postData.images.length > 0) {
				const uploadedImages = await Promise.all(
					postData.images.map(async (img) => {
						const { data: uploadData } = await agent.uploadBlob(
							this.convertDataURIToUint8Array(img.image),
							{ encoding: img.imageType },
						)
						return {
							alt: img.alt,
							image: uploadData.blob,
							aspectRatio: img.aspectRatio,
						}
					}),
				)

				data.embed = {
					$type: 'app.bsky.embed.images',
					images: uploadedImages,
				}
			}

			await agent.post(data)

			addRecentPost({
				text: postData.text,
				tags: postData.tags,
				timestamp: new Date().toISOString(),
				images: postData.images?.map(img => ({
					alt: img.alt,
					aspectRatio: img.aspectRatio
				}))
			})

			await agent.logout()
		} catch (error: any) {
			throw new BlueskyError(
				`Failed to create post on Bluesky: ${error.message}`,
				BlueskyErrorCodes.INTERNAL_SERVER_ERROR,
			)
		}
	}

	private static convertDataURIToUint8Array(dataURI: string): Uint8Array {
		const base64 = dataURI.split(',')[1]
		const binary = atob(base64)
		const array = new Uint8Array(binary.length)
		for (let i = 0; i < binary.length; i++) {
			array[i] = binary.charCodeAt(i)
		}
		return array
	}
}
