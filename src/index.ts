import 'dotenv/config'
import cron from 'node-cron'
import { PostingService } from '@/services/posting'

async function main() {
	const postingService = new PostingService()
	await postingService.init()

	// Run every 10 minutes
	cron.schedule('*/10 * * * *', async () => {
		console.log('Running scheduled post...')
		await postingService.createPost()
	})

	console.log('Bot started! Posts will be created every 10 minutes.')
}

main().catch(console.error)
