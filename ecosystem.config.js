module.exports = {
  apps: [
    {
      name: 'palworld-forum',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PM2_DISABLE_DOCKER: 'true', // 도커 통합 비활성화
      },
      // Graceful shutdown을 위한 설정
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};

