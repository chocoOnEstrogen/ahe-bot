export interface IPost {
	text: string
	tags: string[]
	images?: {
		alt: string
		image: string
		imageType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
		aspectRatio: {
			width: number
			height: number
		}
	}[]
	isNsfw: boolean
}
