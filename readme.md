# 네모 박스 (Nemo-Box)

nemo.\*.ts 파일을 빌드하는 시스템입니다.

## 설치

```bash
pnpm install
```

## 사용 방법

### 파일 생성

`src/script/*` 디렉토리 아래에 `*.nemo.ts` 이름 패턴의 파일을 생성합니다.

예제:

```typescript
// src/scrip/example/example.nemo.ts
export const helloNemo = () => {
  console.log("Hello from Nemo!");
  return "Hello from Nemo!";
};
```

### 빌드

```bash
# 모든 nemo.*.ts 파일 빌드
pnpm run build

# 변경사항 감지하며 빌드
pnpm run build:watch
```

## 빌드 결과

빌드된 파일은 `dist` 디렉토리에 직접 생성됩니다. 원본 파일의 경로 구조는 유지되지 않습니다.

예를 들어 `src/script/example.nemo.ts` 파일은 `dist/example.js`로 빌드됩니다.
