---
name: check
description: 선생님이 만든 수업 도구 HTML 파일을 앱 인 동아에 올리기 전에 규칙에 맞는지 검사할 때 쓴다. "올려도 돼?", "검사해 줘", "규칙에 맞는지 봐 줘", 또는 앱 인 동아 검사 결과를 붙여 넣었을 때. Use when a teacher wants to check an HTML classroom tool before uploading it to 앱 인 동아.
---

# 올리기 전 검사

선생님의 도구(HTML 파일 하나)가 앱 인 동아 규칙(`references/rules.md`)에 맞는지 미리 본다. 앱 인 동아의 자동 검사와 같은 규칙이다.

## 1. 검사할 파일 정하기

- 선생님이 올린 파일, 또는 이 대화에서 방금 만든 HTML을 검사한다.
- 대화에서 만든 것이면 그 HTML 전체를 파일로 저장한 뒤 검사한다.
- 파일이 없으면 "검사할 HTML 파일을 올려 주세요"라고 한 줄로 부탁한다.

## 2. 검사하기

**코드 실행이 되고 Node가 있으면** 이 스킬의 스크립트를 실행한다.

```
node scripts/check.mjs <파일 경로>
```

- 이 스킬 폴더의 `scripts/check.mjs`를 쓴다(`checks.js`·`package.json`이 같은 폴더에 있어야 한다). 스크립트를 고치지 않는다.
- 출력의 줄 번호·고치는 법을 그대로 쓴다. 종료 코드 1이면 꼭 고쳐야 하는 것이 있다는 뜻이다.

**Node가 없으면** `references/rules.md`의 자동 검사 표를 기준으로 파일을 직접 찾아본다. 주석(`<!-- -->`, `/* */`, 줄 맨 앞 `//`) 안의 글자는 빼고 본다.

| id | 단계 | 파일에서 찾을 것 |
|---|---|---|
| `not-html` | 꼭 | `<!doctype html>`·`<html`·`<body` 중 하나도 없음 |
| `too-big` | 꼭 | 5MB 넘음 |
| `outside-code` | 꼭 | `<script src=`(data: 제외), `<link rel="stylesheet"`·`preload`·`modulepreload`의 `href` |
| `network` | 꼭 | `fetch(`, `XMLHttpRequest`, `new WebSocket`, `sendBeacon(`, `new EventSource`, `$.ajax(`·`$.get(`·`$.post(`·`$.getJSON(` |
| `eval` | 꼭 | `eval(`, `new Function(`, `setTimeout("…")`·`setInterval("…")`처럼 글자를 넘김 |
| `iframe` | 꼭 | `<iframe` |
| `personal-info` | 꼭 | `type="tel"`·`type="email"` 입력, 입력 칸·라벨에 전화·휴대폰·연락처·이메일·주소·생년월일·생일·주민 |
| `device-access` | 꼭 | `getUserMedia(`, `geolocation`, `getDisplayMedia(` |
| `outside-media` | 살펴봄 | `src="https://…"`·`src="//…"` 그림·소리·영상, `https://`로 시작하는 `<link href>`, CSS `url(https://…)`, `@import "https://…"` |
| `leave-site` | 살펴봄 | `window.open(`, `location.href =`, `location.assign(`·`location.replace(`, `<a href="https://…">` |
| `storage` | 살펴봄 | `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie` |
| `popup-dialog` | 살펴봄 | `alert(`, `confirm(`, `prompt(` |
| `no-viewport` | 살펴봄 | `<meta name="viewport"` 없음 |
| `no-title` | 살펴봄 | 내용 있는 `<title>` 없음 |

걸린 것마다 줄 번호와 해당 글자를 적는다. 고치는 법은 `references/rules.md`의 '왜'를 쉬운 말로 바꿔 쓴다.

## 3. 알려 주기(선생님 말로)

- 걸린 것이 없으면: "✅ 올릴 수 있어요. 고칠 곳이 없어요."
- 있으면: "고칠 곳 N개"로 시작하고, 항목마다 **규칙 제목**(예: "인터넷으로 정보를 주고받는 코드가 있어요")과 **고치는 법** 한 줄. 꼭 고쳐야 하는 것(오류)을 먼저, 살펴볼 것(경고)을 뒤에 둔다. 경고만 있으면 "올릴 수는 있지만 검수하는 분이 함께 봐요"라고 덧붙인다.
- 끝에 "제가 고쳐 드릴까요?"라고 묻는다. 고쳐 달라고 하면 걸린 곳**만** 고치고(내용·디자인·동작은 그대로), 파일 하나 전체를 아티팩트로 다시 보여 준 뒤 다시 검사한다.
- 자동 검사로는 못 보는 것(글자 크기, 버튼 크기, 정답이 맞는지)은 눈에 띄는 문제가 있을 때만 "검수 때 함께 볼 것"으로 한두 줄 덧붙인다.
- 개발 용어(배포·번들·MCP·sandbox·CSP·API 등)를 쓰지 않는다. 해요체로 짧게.

## 하지 않는 것

- 올렸다, 검수를 통과했다, 공개했다, 학생에게 보냈다고 말하지 않는다. 이 검사는 미리 보기일 뿐이다. 올리기·검수 요청은 선생님이 앱 인 동아에서 하고, 검수 승인과 공개는 사람이 한다.
- 검사를 통과했다고 "검수도 통과할 거예요"라고 약속하지 않는다.

통과하면 이렇게 안내한다:

```
앱 인 동아에서 [+ 올리기]를 누르고 파일을 끌어다 놓아 주세요. 자동 검사가 끝나면 [검수 요청]을 누르면 돼요.
```
