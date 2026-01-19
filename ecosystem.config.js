module.exports = {
    apps: [
        {
            name: 'nifes-api',
            script: './server.js',
            instances: 'max', // Use all CPU cores
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: 5000
            },
            // Restart strategies
            max_memory_restart: '500M', // Restart if exceeds 500MB
            max_restarts: 10,
            min_uptime: '30s',
            // Logging
            error_file: './logs/error.log',
            out_file: './logs/out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            // Graceful shutdown
            kill_timeout: 5000,
            listen_timeout: 3000,
            // Watch for changes (disable in production)
            watch: false,
            ignore_watch: ['node_modules', 'logs', '.git']
        }
    ]
};
