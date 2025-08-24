# @uturi/uturi

Uturi 조직의 소개 페이지이자 접근성 도구들의 체험 공간입니다.

## 소개

이 프로젝트는 Uturi 조직의 미션과 비전을 소개하고, 개발한 접근성 도구들을 직접 체험해볼 수 있는 웹 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Accessibility Tools**: @uturi/sonification

## 주요 기능

- 🏠 **조직 소개**: Uturi의 미션, 비전, 기술 스택 소개
- 🎵 **Sonification 체험**: 수치 데이터를 음악으로 변환하는 기능 직접 체험
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- ♿ **접근성 고려**: WCAG 가이드라인을 준수한 접근성 설계

## 개발 환경 설정

### 필수 요구사항

- Node.js 18.0.0 이상
- pnpm 8.0.0 이상

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린트 검사
pnpm lint

# 타입 체크
pnpm type-check
```

## 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # 루트 레이아웃
│   ├── page.tsx        # 메인 페이지
│   └── globals.css     # 전역 스타일
├── components/         # 재사용 가능한 컴포넌트
│   └── SonificationDemo.tsx  # Sonification 체험 컴포넌트
```

## Sonification 체험하기

1. 메인 페이지의 "체험" 섹션으로 이동
2. 숫자 데이터를 입력하거나 샘플 데이터 선택
3. "Sonification 재생" 버튼 클릭
4. 데이터가 음악으로 변환되어 재생되는 것을 확인

### 샘플 데이터 예시

- **오름차순**: `1,2,3,4,5,6,7,8,9,10`
- **내림차순**: `10,9,8,7,6,5,4,3,2,1`
- **랜덤**: `1,5,2,8,3,9,4,7,6,10`
- **반복 패턴**: `1,1,1,5,5,5,10,10,10,1`

## 접근성

이 웹사이트는 다음과 같은 접근성 기능을 제공합니다:

- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 적절한 색상 대비
- 의미있는 HTML 구조
- ARIA 라벨 및 역할

## 라이선스

MIT License

## 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 연락처

- GitHub: [https://github.com/ksr20612/uturi](https://github.com/ksr20612/uturi)
- Email: ksr20612@gmail.com

