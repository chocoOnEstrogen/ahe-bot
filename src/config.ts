import { IConfig } from '@/interfaces/IConfig';

export const config: IConfig = {
	posting: {
		enabled: true,
		interval: '*/2 * * * *', 
		sfwChance: 10,
	},
};
