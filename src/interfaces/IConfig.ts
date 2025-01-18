/**
 * Configuration interface for the application
 */
export interface IConfig {
	posting: {
		/** Whether posting functionality is enabled */
		enabled: boolean
		/** Cron expression for post scheduling interval */
		interval: string
		/** Percentage chance (0-100) to get a SFW post. Set to 0 for NSFW only, 100 for SFW only */
		sfwChance: number
	}
}
