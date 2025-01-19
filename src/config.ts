import { IConfig } from '@/interfaces/IConfig';

export const config: IConfig = {
	posting: {
		enabled: true,
		interval: '*/15 * * * *', 
		sfwChance: 10,
	},
};
