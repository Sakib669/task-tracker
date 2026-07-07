module.exports = {
  apps: [
    {
      name: 'nextjs',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'ai-worker',
      script: 'node',
      args: 'dist/lib/ai-worker.js',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'webhook-worker',
      script: 'node',
      args: 'dist/lib/webhook-worker.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};