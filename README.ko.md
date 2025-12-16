<div align="center">

> ⚠️ **번역 안내:** 이 문서는 AI에 의해 번역되었습니다. 오류를 발견하시면 알려주시기 바랍니다. 감사합니다!

이 프로젝트는 <b>star-history/star-history</b>에서 포크되어 개선되었습니다. 원본 프로젝트로 코드를 병합하지 않습니다.
프로젝트가 차트 구현을 업데이트하고 MongoDB를 도입해 데이터 캐시를 수행합니다. 이를 통해 GitHub API 호출을 줄이고 성능을 개선합니다.
다크 테마를 추가했습니다.

# :sparkles: gitdata analysis :sparkles:

[**gitdata.xuanhun520.com**](https://gitdata.xuanhun520.com), **GitHub 저장소에 대한 누락된 데이터 통계 및 시각화 기능을 제공합니다. 스타 히스토리 차트 기능 등.**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>

👆 **이것**은 다음 HTML 코드로 생성된 **`라이브`** 차트입니다: 👇

<div align="left">

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>
```

</div>

</div>

---

## ✨ 기능

- [VChart](https://github.com/VisActor/VChart) 기반.
- 상세 데이터 보기 지원
- **원클릭**으로 **고품질** 차트 이미지 생성;
- **날짜 또는 타임라인** 기반의 **다중 차트 보기** 모드 지원;
- **`GitHub readme 또는 기타 웹사이트`**에 **실시간 차트** **임베드** **(상단에 임베드한 예시처럼)**;
- 그리고 **다양한** 유용한 **기능**:
  - **저장소 가시성** 토글;
  - 저장소 이름 입력 **단축키**;
  - **`소셜 네트워크`**로 **빠른 공유**;
  - **여러 저장소** 입력 **지원**;
  - ...더 많은 기능이 **발견**되기를 기다립니다!

## 🌠 스크린샷

<a href="https://gitdata.xuanhun520.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391264-312b448b-f851-41bf-bb8d-4c21ec6795b6.gif" />
</a>



## 🏗 개발

**`Star-history`**는 **현대적인 기술 스택**을 사용하여 구축되었습니다: **`Vue`** + **`Vite`** + **`TailwindCSS`** + **`@Visactor/VChart`**.

### 필수 조건

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/)

### 종속성 설치

```shell
pnpm i
```

### 개발 시작

- **메인 웹사이트**는 gitdata의 홈페이지로, **`VisActor 오픈소스`**에 대한 대부분의 **유용한 기능과 블로그**를 포함합니다.

  ```shell
  pnpm dev
  ```

  웹사이트는 http://localhost:3000에서 제공됩니다.

- **API 서버**는 **`실험적 기능`**입니다. 주로 **`GitHub readme`**에 임베드할 수 있는 차트 **`SVG` 또는 `PNG`** 이미지 파일을 **생성**하는 데 사용됩니다.

  #### API 서버 필수 조건

  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (저장소 데이터 캐싱용)

  #### MongoDB Community Server 설치

  **참고:** 비밀번호를 변경한 후 `.env` 파일 또는 환경 변수의 연결 문자열을 업데이트하는 것을 잊지 마세요.

  **환경 변수 설정:**

  MongoDB 구성은 실제 상황에 따라 수정할 수 있습니다.

  ```shell
  # MongoDB 연결 문자열 설정
  export MONGODB_URI="mongodb://[username]:[password]@localhost:27017/gitdata"
  export MONGODB_DB_NAME="gitdata"
  export MONGODB_COLLECTION_NAME="repo_cache"
  ```

  또는 `server` 디렉토리에 `.env` 파일을 생성합니다:

  ```env
  MONGODB_URI=mongodb://xuanhun:xuanhun@localhost:27017/gitdata
  MONGODB_DB_NAME=gitdata
  MONGODB_COLLECTION_NAME=repo_cache
  ```

  #### API 서버 시작

  ```shell
  cd server
  pnpm i && pnpm dev
  ```

  API 서버는 http://localhost:8080에서 실행됩니다 (HTTPS가 활성화된 경우 https://localhost:8080).

  #### 토큰

  백엔드 서비스에는 `token.env` 파일에 배치된 자체 GitHub 토큰이 필요합니다.

  ### HTTPS 지원 활성화

  프론트엔드에서 HTTPS를 활성화하려면:

  1. **SSL 인증서 생성** (개발용):

     ```shell
     ./scripts/generate-ssl-cert.sh
     ```

     이것은 `certs/` 디렉토리에 자체 서명된 인증서를 생성합니다.

  2. **프론트엔드 (Vite)의 경우**:

     `certs/` 디렉토리에 인증서 파일이 있으면 Vite 개발 서버가 자동으로 HTTPS를 사용하거나 사용자 정의 경로를 지정할 수 있습니다:

     ```shell
     export SSL_CERT_PATH=/path/to/cert.crt
     export SSL_KEY_PATH=/path/to/key.key
     pnpm dev
     ```

## 향후 계획

- 더 많은 편집 및 주석 기능 추가
- VChart 코드 보기 및 편집, VChart 공식 편집기로 내보내기
- 스타 히스토리 애니메이션 비디오 (GIF) 생성
- 더 많은 GitHub 데이터 통계 및 분석 기능
