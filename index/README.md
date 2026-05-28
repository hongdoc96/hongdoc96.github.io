# hongdoc96.github.io 배포 가이드

## 최종 URL

| 페이지 | URL |
|---|---|
| 스튜디오 메인 | `https://hongdoc96.github.io/` |
| 마라나타 지원 | `https://hongdoc96.github.io/maranatha/` |
| FilmGrade 지원 | `https://hongdoc96.github.io/filmgrade/` (다음 단계) |

**App Store Connect 지원 URL 입력값:**
```
https://hongdoc96.github.io/maranatha/
```

---

## 파일 구조

```
hongdoc96.github.io/
├── index.html              ← 스튜디오 메인
├── maranatha/
│   └── index.html          ← 마라나타 지원
└── filmgrade/              ← (나중에 추가)
    └── index.html
```

---

## 배포 절차 (10분)

### Step 1. GitHub에서 새 Public Repo 생성

1. https://github.com/new 접속
2. **Repository name**: `hongdoc96.github.io` (정확히 이 이름)
   > ⚠️ 사용자명과 동일해야 user site로 인식됩니다.
3. **Public** 선택 (필수)
4. **Add a README file** 체크 ❌ (체크하지 마세요)
5. **Create repository** 클릭

### Step 2. 로컬에 clone

```bash
cd ~/Projects   # 행님 작업 폴더로
git clone https://github.com/hongdoc96/hongdoc96.github.io.git
cd hongdoc96.github.io
```

### Step 3. 파일 배치

이 zip에서 받은 파일을 그대로 복사하시면 됩니다.

```bash
# 폴더 구조 만들기
mkdir -p maranatha

# 파일 복사 (다운로드 받은 위치 기준)
cp ~/Downloads/hongdoc-site/index.html .
cp ~/Downloads/hongdoc-site/maranatha/index.html ./maranatha/
```

확인:
```bash
ls -la
# index.html
# maranatha/
```

### Step 4. 커밋 & 푸시

```bash
git add .
git commit -m "feat: 홍독 스튜디오 + 마라나타 지원 페이지 초기 배포"
git push origin main
```

> ⚠️ 행님 워크플로우 규칙 따라 `git add .`을 한 건 신중하게. 이번 케이스는 새 repo라서 모든 파일이 새 파일이므로 `.` 사용이 안전합니다. 평소처럼 기존 repo에서 작업 시엔 명시적 파일만 add 하십시오.

### Step 5. GitHub Pages 활성화 확인

**user site (`사용자명.github.io`)는 자동으로 GitHub Pages가 활성화됩니다.** Settings 작업 불필요.

1. https://github.com/hongdoc96/hongdoc96.github.io/settings/pages 접속
2. "Your site is live at https://hongdoc96.github.io/" 메시지 확인
3. 1~3분 대기 후 접속:
   - https://hongdoc96.github.io/
   - https://hongdoc96.github.io/maranatha/

### Step 6. App Store Connect 입력

App 정보 페이지에서 **지원 URL** 필드에 붙여넣기:

```
https://hongdoc96.github.io/maranatha/
```

---

## 페이지 구성 요약

### 메인 페이지 (`/`)

- **헤더**: "HONGDOC STUDIO" + "매일을 더 깊게 만드는 앱을 만듭니다."
- **Works**: 마라나타 + FilmGrade 두 앱 카드 (각 지원 페이지로 링크)
- **About**: 스튜디오 소개 (솔로 인디, 정성)
- **Contact**: hongdoc96@gmail.com
- **Footer**: 사업자 정보

### 마라나타 지원 페이지 (`/maranatha/`)

- **FAQ 7개**: 큐티 챌린지, 로그인, 응원하기, 본문 저작권, 계정 삭제, Android, 버그 신고
- **Contact**: hongdoc96@gmail.com
- **Policies**: 개인정보처리방침 / 이용약관 링크 (다음 단계)
- **Footer**: 사업자 정보 + 요한계시록 22:20

---

## 디자인 일관성

| 요소 | 값 |
|---|---|
| 배경 | 차콜 #1A1A1E |
| 카드 | #25252A |
| 골드 악센트 | #DAB271 |
| 사파이어 글로우 | #1C345F (마라나타) |
| 디스플레이 폰트 | Cormorant Garamond |
| 본문 폰트 | Noto Serif KR |
| 정렬 | 좌정렬 (E design signature) |

---

## 다음 단계 (출시 전 체크리스트)

| 항목 | 상태 |
|---|---|
| 지원 URL 등록 | ☐ |
| 개인정보처리방침 URL (필수) | ☐ |
| 이용약관 페이지 (권장) | ☐ |
| FilmGrade 지원 페이지 | ☐ |

App Store 심사 통과를 위해 **개인정보처리방침은 별도 필드에 필수 입력**이라 다음에 작성이 필요합니다.

---

## 문제 해결

**Q. 푸시 후에도 404 뜨는 경우**
- DNS 전파에 1~3분 소요. 잠시 대기.
- Settings → Pages에서 "Your site is live" 메시지 확인.

**Q. CSS가 안 입혀진 경우**
- Google Fonts 차단된 환경(중국 등)이 아닌지 확인.
- 브라우저 캐시 강제 새로고침 (`Cmd+Shift+R`).

**Q. 도메인을 따로 사고 싶을 때 (예: hongdoc.studio)**
- 도메인 구매 후 Settings → Pages → Custom domain 입력.
- 마라나타 출시 후 천천히 고민하셔도 됩니다.
