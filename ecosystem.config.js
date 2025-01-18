module.exports = {
	apps: [
		{
			name: 'ahe-bot',
			script: './dist/index.js',
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			error_file: 'logs/err.log',
			out_file: 'logs/out.log',
			node_args: '--enable-source-maps',
			restart_delay: 3000, // 3 seconds
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
}