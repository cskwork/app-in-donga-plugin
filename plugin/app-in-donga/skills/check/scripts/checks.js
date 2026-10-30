// 이 파일은 `npm run apps:plugin`이 src/apps/checks.js에서 복사해 만들어요. 여기서 고치지 말고 정본을 고치세요.
// 선생님 도구(HTML 한 파일) 자동 검사.
// 올리기 화면(브라우저)과 플러그인 점검 스크립트(Node)가 이 파일 하나를 같이 쓴다. 의존성 없음.
// 규칙의 뜻과 이유는 docs/apps/rules.md가 정본이고, 여기 id는 그 문서의 id와 같다.
// fix는 선생님이 화면에서 읽는 쉬운 말, ask는 Claude에게 붙여 넣는 고치기 부탁(기술 용어 허용)이다.
//
// level
//   error: 올릴 수 없다(검수 요청 버튼이 막힘). 학생 정보가 새거나, 학생 화면에서 아예 동작하지 않는 것.
//   warn : 올릴 수는 있다. 학생 화면에서 일부가 안 보이거나 불편한 것. 검수하는 사람이 함께 본다.

export const MAX_BYTES = 5 * 1024 * 1024

/** @type {import('./checks').Rule[]} */
export const RULES = [
  {
    id: 'not-html',
    level: 'error',
    title: 'HTML 파일이 아니에요',
    fix: '학생 화면은 HTML 파일만 열어요. Claude에게 "HTML 파일 하나로 만들어 줘"라고 말한 뒤 받은 파일을 올려 주세요.',
    ask: 'HTML 파일 하나(.html)로 다시 만들어 주세요.',
    missing: /<(!doctype\s+html|html|body)\b/i,
  },
  {
    id: 'outside-code',
    level: 'error',
    title: '다른 곳의 코드를 불러와요',
    fix: '도구의 일부를 인터넷이나 다른 파일에서 가져와요. 학생 화면은 파일 하나만 받고 인터넷을 막아서 이대로는 동작하지 않아요.',
    ask: '<script src>·외부 스타일시트·CDN을 쓰지 말고, 모든 스크립트와 스타일을 HTML 파일 하나 안에 넣어 주세요.',
    pattern: [
      /<script\b[^>]*\bsrc\s*=\s*["']?(?!data:)[^"'\s>]+/gi,
      /<link\b(?=[^>]*\brel\s*=\s*["']?(stylesheet|modulepreload|preload)\b)(?=[^>]*\bhref\s*=\s*["']?(?!data:)[^"'\s>]+)[^>]*>/gi,
    ],
  },
  {
    id: 'network',
    level: 'error',
    title: '인터넷으로 정보를 주고받는 코드가 있어요',
    fix: '학생 화면은 인터넷에 연결하지 않아요. 점수 보내기·내용 불러오기처럼 인터넷이 필요한 부분을 빼야 해요.',
    ask: 'fetch·XMLHttpRequest·WebSocket·sendBeacon 같은 네트워크 코드를 빼고, 필요한 내용은 파일 안에 넣어 주세요.',
    pattern: [/\bfetch\s*\(/g, /\bXMLHttpRequest\b/g, /\bnew\s+WebSocket\b/g, /\bsendBeacon\s*\(/g, /\bnew\s+EventSource\b/g, /\$\.(ajax|get|post|getJSON)\s*\(/g],
  },
  {
    id: 'eval',
    level: 'error',
    title: '글자를 코드로 바꿔 실행해요',
    fix: '검수할 때 보이지 않던 동작이 나중에 생길 수 있는 방식이라 쓸 수 없어요.',
    ask: 'eval·new Function·글자를 넘기는 setTimeout/setInterval을 쓰지 말고 일반 함수로 바꿔 주세요.',
    pattern: [/\beval\s*\(/g, /\bnew\s+Function\s*\(/g, /\bset(Timeout|Interval)\s*\(\s*["'`]/g],
  },
  {
    id: 'iframe',
    level: 'error',
    title: '다른 화면을 안에 끼워 넣었어요',
    fix: '검수하지 않은 다른 화면이 들어올 수 있어 쓸 수 없어요.',
    ask: 'iframe을 빼고, 필요한 화면은 이 파일 안에서 직접 그려 주세요.',
    pattern: [/<iframe\b/gi],
  },
  {
    id: 'personal-info',
    level: 'error',
    title: '학생 개인정보를 묻는 칸이 있어요',
    fix: '전화번호·이메일·주소·생년월일 같은 칸은 빼야 해요. 학생 이름이 필요하면 선생님이 화면에 붙여 넣는 방식으로 바꿔요.',
    ask: '전화번호·이메일·주소·생년월일 입력 칸을 빼 주세요. 학생 이름이 필요하면 선생님이 이름 목록을 붙여 넣는 칸 하나로 해 주세요.',
    pattern: [
      /<input\b[^>]*\btype\s*=\s*["']?(tel|email)\b[^>]*>/gi,
      /<(input|textarea)\b[^>]*(전화|휴대폰|핸드폰|연락처|이메일|e-?mail|주소|생년월일|생일|주민)[^>]*>/gi,
      /<label\b[^>]*>[^<]*(전화|휴대폰|핸드폰|연락처|이메일|주소|생년월일|주민)[^<]*</gi,
    ],
  },
  {
    id: 'device-access',
    level: 'error',
    title: '카메라·마이크·위치를 쓰려고 해요',
    fix: '학생 화면에서는 카메라·마이크·위치를 쓸 수 없어요. 이 기능을 빼야 해요.',
    ask: '카메라·마이크·화면 공유·위치(getUserMedia·getDisplayMedia·geolocation)를 쓰는 기능을 빼 주세요.',
    pattern: [/\bgetUserMedia\s*\(/g, /\bgeolocation\b/g, /\bgetDisplayMedia\s*\(/g],
  },
  {
    id: 'outside-media',
    level: 'warn',
    title: '인터넷의 그림·글꼴·소리를 써요',
    fix: '인터넷에 있는 그림·글꼴·소리는 학생 화면에서 빈칸으로 보여요.',
    ask: '외부 그림·글꼴·소리 주소를 쓰지 말고, 그림은 이모지나 인라인 SVG로, 글꼴은 기본 글꼴로 바꿔 주세요.',
    pattern: [
      /<(img|audio|video|source)\b[^>]*\bsrc\s*=\s*["']?(https?:)?\/\/[^"'\s>]+/gi,
      /<link\b[^>]*\bhref\s*=\s*["']?(https?:)?\/\/[^"'\s>]+[^>]*>/gi,
      /url\(\s*["']?(https?:)?\/\/[^)]+\)/gi,
      /@import\s+["'](https?:)?\/\//gi,
    ],
  },
  {
    id: 'leave-site',
    level: 'warn',
    title: '다른 사이트로 나가는 링크가 있어요',
    fix: '학생 화면에서는 다른 사이트로 나갈 수 없어서, 눌러도 아무 일이 일어나지 않아요.',
    ask: '외부 링크와 window.open·location 이동을 빼 주세요.',
    pattern: [/\bwindow\.open\s*\(/g, /\blocation\.(href\s*=|assign\s*\(|replace\s*\()/g, /<a\b[^>]*\bhref\s*=\s*["']?(https?:)?\/\/[^"'\s>]+/gi],
  },
  {
    id: 'storage',
    level: 'warn',
    title: '기록을 저장해요',
    fix: '학생 화면은 기록을 저장하지 않아요. 화면을 닫으면 점수·설정이 사라져요.',
    ask: 'localStorage·sessionStorage·indexedDB·쿠키를 쓰지 말고, 화면을 닫으면 기록이 사라져도 괜찮게 만들어 주세요.',
    pattern: [/\blocalStorage\b/g, /\bsessionStorage\b/g, /\bindexedDB\b/g, /\bdocument\.cookie\b/g],
  },
  {
    id: 'popup-dialog',
    level: 'warn',
    title: '알림 창을 띄워요',
    fix: '알림 창은 학생 화면에서 뜨지 않을 수 있어요. 안내는 화면 안에 글로 보여 주는 게 좋아요.',
    ask: 'alert·confirm·prompt를 쓰지 말고, 안내는 화면 안에 글로 보여 주세요.',
    pattern: [/(^|[^.\w])(window\.)?(alert|confirm|prompt)\s*\(/g],
  },
  {
    id: 'no-viewport',
    level: 'warn',
    title: '태블릿 화면 설정이 없어요',
    fix: '태블릿에서 글자가 아주 작게 보일 수 있어요.',
    ask: '<head> 안에 <meta name="viewport" content="width=device-width, initial-scale=1">을 넣어 주세요.',
    missing: /<meta\b[^>]*\bname\s*=\s*["']?viewport\b/i,
  },
  {
    id: 'no-title',
    level: 'warn',
    title: '제목이 없어요',
    fix: '올릴 때 이름 칸에 직접 적으면 돼요.',
    ask: '<head> 안에 <title>도구 이름</title>을 넣어 주세요.',
    missing: /<title\b[^>]*>\s*[^<\s][^<]*<\/title>/i,
  },
]

// 주석 속 글자는 검사하지 않는다. 줄 번호가 그대로 남도록 주석을 같은 길이의 빈칸으로 바꾼다.
// 줄 끝 주석(코드 뒤 // ...)은 주소(https://)와 구분하기 어려워 줄 맨 앞 주석만 지운다.
function blankComments(src) {
  const blank = (m) => m.replace(/[^\n]/g, ' ')
  return src
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/^[ \t]*\/\/[^\n]*/gm, blank)
}

function lineOf(src, index) {
  let line = 1
  for (let i = 0; i < index; i++) if (src.charCodeAt(i) === 10) line++
  return line
}

/**
 * HTML 한 파일을 검사한다.
 * @param {string} html
 * @param {{ bytes?: number }} [opts] 파일 크기(바이트). 없으면 UTF-8 길이로 잰다.
 * @returns {import('./checks').CheckReport}
 */
export function checkApp(html, opts = {}) {
  const bytes = opts.bytes ?? new TextEncoder().encode(html).length
  const src = blankComments(html)
  const results = []

  if (bytes > MAX_BYTES) {
    results.push({
      id: 'too-big',
      level: 'error',
      title: '파일이 너무 커요',
      fix: `파일은 ${MAX_BYTES / 1024 / 1024}MB까지 올릴 수 있어요. 큰 그림·소리를 빼거나 줄여야 해요.`,
      ask: `큰 그림·소리를 빼거나 줄여서 파일을 ${MAX_BYTES / 1024 / 1024}MB 아래로 만들어 주세요.`,
      count: 1,
      where: [],
    })
  }

  for (const rule of RULES) {
    if (rule.missing) {
      if (!rule.missing.test(src)) results.push({ id: rule.id, level: rule.level, title: rule.title, fix: rule.fix, ask: rule.ask, count: 1, where: [] })
      continue
    }
    const where = []
    let count = 0
    for (const re of rule.pattern) {
      re.lastIndex = 0
      for (const m of src.matchAll(re)) {
        count++
        if (where.length < 3) where.push({ line: lineOf(src, m.index), text: html.slice(m.index, m.index + m[0].length).trim().slice(0, 80) })
      }
    }
    if (count > 0) results.push({ id: rule.id, level: rule.level, title: rule.title, fix: rule.fix, ask: rule.ask, count, where })
  }

  // HTML이 아니면 나머지 결과는 뜻이 없다
  if (results.some((r) => r.id === 'not-html')) {
    const keep = results.filter((r) => r.id === 'not-html' || r.id === 'too-big')
    results.length = 0
    results.push(...keep)
  }

  const title = html.match(/<title\b[^>]*>([^<]*)<\/title>/i)?.[1].trim() || ''
  const errors = results.filter((r) => r.level === 'error').length
  const warnings = results.length - errors
  return { ok: errors === 0, errors, warnings, results, title, bytes }
}

/**
 * 검사에서 걸린 것을 Claude에게 그대로 붙여 넣을 고치기 부탁 글로 만든다.
 * 선생님은 이 글을 복사해 만들던 대화에 붙여 넣기만 하면 된다.
 * @param {import('./checks').CheckReport} report
 */
export function fixPrompt(report) {
  if (report.results.length === 0) return ''
  const lines = report.results.map((r, i) => {
    const at = r.where.length ? ` (${r.where.map((w) => `${w.line}번째 줄`).join(', ')})` : ''
    return `${i + 1}. ${r.title}${at}: ${r.ask}`
  })
  return [
    '앱 인 동아에 올리려고 검사했더니 아래 문제가 나왔어요. 고쳐서 HTML 파일 하나로 다시 만들어 주세요.',
    '다른 부분(내용·디자인·동작)은 그대로 두세요.',
    '',
    ...lines,
  ].join('\n')
}
