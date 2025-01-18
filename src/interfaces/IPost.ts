export interface IPost {
	text: string
	tags: string[]
	facets?: {
		index: {
			byteStart: number
			byteEnd: number
		}
		features: Array<{
			$type: string
			tag?: string
			uri?: string
			did?: string
		}>
	}[]
	images?: Array<{
		alt: string
		image: string
		imageType: string
		aspectRatio: {
			width: number
			height: number
		}
	}>
}
