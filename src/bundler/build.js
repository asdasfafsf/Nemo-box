#!/usr/bin/env node

import { execSync } from 'child_process';
import { rimrafSync } from 'rimraf';

// 커맨드 라인 인수 가져오기
const fileName = process.argv[2];

if (!fileName) {
  console.error('Error: File name is required');
  console.error('Usage: pnpm build:file <fileName>');
  process.exit(1);
}

// dist 디렉토리 비우기
console.log('Cleaning dist directory...');
rimrafSync('dist');

// 환경 변수 설정 및 빌드 실행
console.log(`Building file: ${fileName}`);
try {
  execSync(`cross-env FILE_NAME=${fileName} rollup -c src/bundler/rollup.config.js`, {
    stdio: 'inherit'
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 