# 니모 박스 (Nemo-Box)

**Nemo-Box는 [Nemo 런타임 플랫폼](https://github.com/asdasfafsf/nemo)에서 동적으로 로드하여 사용할 스크립트(`nemo.*.ts`)를 표준화된 형식으로 빌드하고 AWS S3에 배포하는 시스템입니다.**

`nemo.*.ts` 파일을 빌드하는 시스템입니다.

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
S3_SECRET_KEY=your-secret-key       # AWS S3 접근을 위한 Secret Key
S3_ACCESS_KEY=your-access-key       # AWS S3 접근을 위한 Access Key
S3_BUCKET_NAME=your-bucket-name     # 스크립트를 업로드할 S3 버킷 이름
S3_REGION=ap-northeast-2            # 대상 S3 버킷의 리전 (예: ap-northeast-2)
S3_ENDPOINT=your-s3-endpoint        # S3 호환 스토리지 또는 VPC 엔드포인트 사용 시 지정 (선택 사항)
```

## 사용 방법

### 파일 생성

`src/script` 디렉토리 아래에 `nemo.[파일이름].ts` 이름 패턴의 파일을 생성합니다.

### 모듈 작성 규칙

각 모듈은 반드시 `nemo` 함수를 export해야 합니다:

- 입력 타입: `NemoRequest<T>` 타입의 인자가 전달됩니다. `T`는 Nemo 런타임 플랫폼의 `data` 부분에 해당합니다.
- 출력 타입: `NemoResponse<T>` 또는 `Promise<NemoResponse<T>>` 타입을 반환해야 합니다. `T`는 스크립트 실행 결과로 반환할 데이터의 타입을 나타냅니다.

#### 타입 정의

프로젝트에서 사용하는 실제 타입 정의는 다음과 같습니다:

```typescript
// src/types/common.ts

// 요청 타입 - 런타임에서 전달하는 파라미터 객체
export type NemoRequest<T> = T;

// 응답 타입
export type NemoResponse<T> = {
  code: NemoResponseCode; // 실행 결과 코드 (규칙 참조)
  message: NemoResponseMessage; // 사용자를 위한 결과 메시지
  techMessage: NemoResponseTechMessage; // 개발자를 위한 기술적 메시지
  data: T; // 실제 결과 데이터
};

// 응답 코드 타입 (정규식 패턴: '1'로 시작하는 5자리 숫자)
// 규칙: '1xxxx' 범위는 각 스크립트에서 특정 성공/오류 상황을 나타내기 위한 사용자 정의 코드로 사용됩니다.
// (예: '10000' - 일반 성공, '10001' - 특정 조건 실패 등)
export type NemoResponseCode = string &
  (typia.tags.Pattern<"^[1][0-9]{5}$"> &
    typia.tags.MinLength<5> &
    typia.tags.MaxLength<5>);

export type NemoResponseMessage = string;
export type NemoResponseTechMessage = string;
```

### 예제

```typescript
// src/script/nemo.example.ts
import { NemoResponse } from "../../types/common";

export async function nemo(): Promise<NemoResponse<any>> {
  const response = await axios.get("https://example.com/api");

  return {
    code: "10000",
    message: "성공",
    techMessage: "",
    data: response.data,
  };
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
pnpm publish example
```

이 명령어는 **지정된 파일을 빌드하는 과정을 포함하여** (`pnpm build:file [filename]` 실행), 빌드가 성공하면 그 결과물(`[filename].js`)을 `.env` 파일에 설정된 S3 버킷의 `script/` 경로에 업로드합니다. 따라서 `publish` 명령어 실행 전에 별도로 빌드 명령어를 실행할 필요가 없습니다. Nemo 런타임 플랫폼은 이 S3 경로에서 스크립트를 다운로드하여 실행하게 됩니다.

## 빌드 결과

빌드된 파일은 `dist` 디렉토리에 직접 생성됩니다. 원본 파일의 경로 구조는 유지되지 않습니다.

예를 들어 `src/script/nemo.example.ts` 파일은 `dist/example.js`로 빌드됩니다.

## S3 배포

배포된 파일은 `.env`에 설정된 S3 버킷의 `script/` 디렉토리에 저장됩니다.
접근 URL 형식은 일반적으로 다음과 같습니다 (설정에 따라 다를 수 있음):

```
[S3_ENDPOINT]/[S3_BUCKET_NAME]/script/[FILE_NAME].js
# 또는 S3 기본 URL 형식:
# https://[S3_BUCKET_NAME].s3.[S3_REGION].amazonaws.com/script/[FILE_NAME].js
```
