# 네모 박스 (Nemo-Box)

nemo.\*.ts 파일을 빌드하는 시스템입니다.

## 설치

```bash
pnpm install
```

## 환경 설정

S3 배포를 위해 `.env` 파일을 생성하고 S3 자격 증명을 설정해야 합니다.
`.env.example` 파일을 복사하여 `.env` 파일을 만들고 실제 값을 입력하세요.

```bash
cp .env.example .env
```

필요한 환경 변수:

```
S3_SECRET_KEY=your-secret-key
S3_ACCESS_KEY=your-access-key
S3_BUCKET_NAME=your-bucket-name
S3_REGION=ap-northeast-2
S3_ENDPOINT=your-s3-endpoint
```

## 사용 방법

### 파일 생성

`src/script` 디렉토리 아래에 `nemo.[파일이름].ts` 이름 패턴의 파일을 생성합니다.

예제:

```typescript
// src/script/nemo.example.ts
export const helloNemo = () => {
  console.log("Hello from Nemo!");
  return "Hello from Nemo!";
};

if (import.meta.url === import.meta.resolve(process.argv[1])) {
  helloNemo();
}
```

### 빌드

```bash
# 모든 nemo.*.ts 파일 빌드
pnpm build

# 변경사항 감지하며 빌드
pnpm build:watch

# 특정 파일만 빌드 (예: nemo.example.ts의 경우 'example'만 입력)
pnpm build:file example
```

### 배포

```bash
# 특정 파일 빌드 후 S3에 배포 (example 파일의 경우)
pnpm upload example
```

## 빌드 결과

빌드된 파일은 `dist` 디렉토리에 직접 생성됩니다. 원본 파일의 경로 구조는 유지되지 않습니다.

예를 들어 `src/script/nemo.example.ts` 파일은 `dist/example.js`로 빌드됩니다.

## S3 배포

배포된 파일은 S3 버킷의 `script/` 디렉토리에 저장됩니다.
접근 URL은 다음과 같습니다:

```
[S3_ENDPOINT]/[S3_BUCKET_NAME]/scripts/[FILE_NAME].js
```
