/**
 * Configuration interface for the application
 */
export interface IConfig {
	posting: {
		/** Whether posting functionality is enabled */
		enabled: boolean
		/** Cron expression for post scheduling interval */
		interval: string
	}
}
