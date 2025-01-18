import { Gelbooru } from '@/services/providers/gelbooru'
import { Rule34 } from '@/services/providers/rule34'
import { Bluesky } from '@/services/bluesky'
import { IPost } from '@/interfaces/IPost'
import sharp from 'sharp'

export class PostingService {
	private providers: {
		gelbooru: Gelbooru
		rule34: Rule34
	}
	private bluesky: Bluesky

	constructor() {
		this.providers = {
			gelbooru: new Gelbooru({
				apiKey: process.env.GELBOORU_API_KEY,
				userId: process.env.GELBOORU_USER_ID,
				defaultLimit: 1,
			}),
			rule34: new Rule34({
				defaultLimit: 1,
			}),
		}
		this.bluesky = new Bluesky()
	}

	async init() {
		await this.bluesky.init()
	}

	private async fetchRandomImage() {
		// Randomly select a provider
		const provider = Math.random() < 0.5 ? 'gelbooru' : 'rule34'

		const searchParams = {
			query: '', // Empty query to get random images
			page: Math.floor(Math.random() * 100) + 1, // Random page between 1-100 for more variety
			limit: 1,
		}

		const response = await this.providers[provider].search(searchParams)

		if (!response.success || response.data.length === 0) {
			throw new Error(`Failed to fetch image from ${provider}`)
		}

		const post = response.data[0]
		return {
			url: post.file_url,
			tags: post.tags.split(' '),
			rating: post.rating,
		}
	}

	private async downloadAndResizeImage(url: string): Promise<{
		buffer: string
		type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
		width: number
		height: number
	}> {
		const response = await fetch(url)
		const arrayBuffer = await response.arrayBuffer()

		const image = sharp(Buffer.from(arrayBuffer))
		const metadata = await image.metadata()

		// Calculate new dimensions to keep file size under 975KB
		// Start with max dimensions of 2000x2000
		let width = metadata.width || 2000
		let height = metadata.height || 2000
		const aspectRatio = width / height

		// If either dimension is larger than 2000, scale down
		if (width > 2000 || height > 2000) {
			if (width > height) {
				width = 2000
				height = Math.round(width / aspectRatio)
			} else {
				height = 2000
				width = Math.round(height * aspectRatio)
			}
		}

		const resizedImage = await image
			.resize(width, height, {
				fit: 'inside',
				withoutEnlargement: true,
			})
			.jpeg({ quality: 80 }) // Use JPEG with 80% quality for better compression
			.toBuffer()

		const base64 = resizedImage.toString('base64')
		return {
			buffer: `data:image/jpeg;base64,${base64}`,
			type: 'image/jpeg',
			width,
			height,
		}
	}

	async createPost() {
		try {
			const { url, tags, rating } = await this.fetchRandomImage()
			const { buffer, type, width, height } =
				await this.downloadAndResizeImage(url)

			const displayTags = tags.slice(0, 5)
			const isNsfw = rating === 'explicit'
			const hashTags = displayTags.map(tag => `#${tag}`)
			const altText = `${isNsfw ? 'NSFW' : 'SFW'} artwork featuring: ${displayTags.join(', ')} ${hashTags.join(' ')}`
			const post: IPost = {
				text: `✨ ${isNsfw ? 'NSFW' : 'SFW'} Art ✨\n\nFeatured tags:\n${displayTags.map(tag => `• ${tag}`).join('\n')}`,
				tags: displayTags,
				images: [
					{
						alt: altText,
						image: buffer,
						imageType: type,
						aspectRatio: {
							width,
							height,
						},
					},
				],
			}

			await Bluesky.createPost(post)
			console.log('Successfully posted to Bluesky')
		} catch (error) {
			console.error('Failed to create post:', error)
		}
	}
}
