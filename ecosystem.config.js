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
      // Next.js는 process.send('ready')를 보내지 않으므로 wait_ready 사용 시
      // listen_timeout마다 PM2가 프로세스를 죽이고 재시작 → 무한 재시작 루프 발생.
      // wait_ready/listen_timeout 제거하여 재시작 루프 방지.

      // 무한 루프/멈춤 시 자동 복구용 안전장치
      max_memory_restart: '600M',   // 메모리 600MB 초과 시 재시작 (메모리 누수·폭증 시 복구)
      cron_restart: '0 4 * * *',    // 매일 새벽 4시 재시작 (주기적으로 새 프로세스로 갱신)
    },
  ],
};

