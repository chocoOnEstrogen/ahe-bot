import { createServer, IncomingMessage, ServerResponse } from 'http'
import NodeCache from 'node-cache'
import { Gelbooru } from '@/services/providers/gelbooru'
import { Rule34 } from '@/services/providers/rule34'
import { sendResponse } from '@/utils/web-server'

// Initialize caches with different TTLs
const searchCache = new NodeCache({
	stdTTL: 3600, // 1 hour for search results
	checkperiod: 120,
	useClones: false,
}) as NodeCache

const providers = {
	gelbooru: new Gelbooru({
		apiKey: process.env.GELBOORU_API_KEY,
		userId: process.env.GELBOORU_USER_ID,
		defaultLimit: 20,
		timeout: 30000,
	}),
	rule34: new Rule34({
		defaultLimit: 20,
		timeout: 30000,
	}),
}

async function prefetchPopularSearches(): Promise<void> {
	const popularTags = ['rating:safe', 'rating:questionable', 'rating:explicit']
	const prefetchPromises: Promise<void>[] = []

	for (const [providerName, provider] of Object.entries(providers)) {
		for (const tag of popularTags) {
			const cacheKey = `${providerName}-${tag}-1`
			// eslint-disable-next-line
			if (!searchCache.has(cacheKey)) {
				prefetchPromises.push(
					provider
						.search({
							query: tag,
							page: 1,
							limit: 20,
						})
						.then((response) => {
							// eslint-disable-next-line
							searchCache.set(cacheKey, response)
						})
						.catch((error) => {
							console.error(
								`Prefetch failed for ${providerName} - ${tag}:`,
								error,
							)
						}),
				)
			}
		}
	}

	await Promise.allSettled(prefetchPromises)
}

// Run prefetch every 30 minutes
setInterval(() => void prefetchPopularSearches(), 30 * 60 * 1000)
void prefetchPopularSearches()

const server = createServer(
	(req: IncomingMessage, res: ServerResponse): void => {
		void (async () => {
			try {
				// Enable CORS
				res.setHeader('Access-Control-Allow-Origin', '*')
				res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
				res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

				if (req.method === 'OPTIONS') {
					res.writeHead(200)
					res.end()
					return
				}

				if (req.url?.startsWith('/api/providers')) {
					sendResponse(res, Object.keys(providers), 200)
					return
				}

				if (req.url?.startsWith('/api/search')) {
					const url = new URL(req.url, `http://${req.headers.host}`)
					const provider = url.searchParams.get('provider') || 'gelbooru'
					const query = url.searchParams.get('query') || ''
					const page = parseInt(url.searchParams.get('page') || '1')
					const cacheKey = `${provider}-${query}-${page}`

					// Try to get from cache first
					// eslint-disable-next-line
					const cachedResult = searchCache.get(cacheKey)
					if (cachedResult) {
						sendResponse(res, cachedResult, 200)

						// Refresh cache in background
						void (async () => {
							try {
								const newData = await providers[
									provider as keyof typeof providers
								].search({
									query,
									page,
									limit: 20,
								})
								// eslint-disable-next-line
								searchCache.set(cacheKey, newData)
							} catch (error) {
								console.error('Background cache refresh failed:', error)
							}
						})()
						return
					}

					if (provider in providers) {
						const response = await providers[
							provider as keyof typeof providers
						].search({
							query,
							page,
							limit: 20,
						})

						// eslint-disable-next-line
						searchCache.set(cacheKey, response)

						// Prefetch next page in background
						void (async () => {
							try {
								const nextPageResponse = await providers[
									provider as keyof typeof providers
								].search({
									query,
									page: page + 1,
									limit: 20,
								})
								// eslint-disable-next-line
								searchCache.set(
									`${provider}-${query}-${page + 1}`,
									nextPageResponse,
								)
							} catch (error) {
								console.error('Next page prefetch failed:', error)
							}
						})()

						sendResponse(res, response, 200)
					} else {
						sendResponse(res, { error: 'Invalid provider' }, 400)
					}
					return
				}

				res.writeHead(404)
				res.end('Not found')
			} catch (error) {
				console.error('Server error:', error)
				sendResponse(res, { error: 'Internal server error' }, 500)
			}
		})()
	},
)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`)
})
