import 'module-alias/register';
import 'dotenv/config'
import cron from 'node-cron'
import { PostingService } from '@/services/posting'
import { config } from './config';

async function main() {
	const postingService = new PostingService()
	await postingService.init()

	cron.schedule(config.posting.interval, async () => {
		console.log('Running scheduled post...')
		await postingService.createPost()
	})

	console.log(`Bot started! Posts will be created every ${config.posting.interval} interval.`)
}

main().catch(console.error)
