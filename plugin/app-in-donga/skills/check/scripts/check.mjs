#!/usr/bin/env node
// 앱 인 동아에 올리기 전 검사.
// 사용: node check.mjs <도구.html>
// 결과를 선생님 말로 보여 주고, 고칠 곳이 있으면 Claude에게 붙여 넣을 고치기 부탁 글도 보여 준다.
// 오류(올릴 수 없는 것)가 하나라도 있으면 종료 코드 1.
// checks.js는 앱 인 동아 자동 검사와 같은 파일의 사본이다(직접 고치지 않는다).
import { readFileSync } from 'node:fs'
import { checkApp, fixPrompt } from './checks.js'

const file = process.argv[2]
if (!file) {
  console.error('사용법: node check.mjs <도구.html>')
  process.exit(2)
}

let buf
try {
  buf = readFileSync(file)
} catch {
  console.error(`파일을 열 수 없어요: ${file}`)
  process.exit(2)
}

const report = checkApp(buf.toString('utf8'), { bytes: buf.length })
const kb = (report.bytes / 1024).toFixed(1)

console.log(`검사한 파일: ${file} (${kb}KB)${report.title ? ` · 제목: ${report.title}` : ''}`)
if (report.results.length === 0) {
  console.log('✅ 올릴 수 있어요. 고칠 곳이 없어요.')
} else if (report.ok) {
  console.log(`🟡 올릴 수 있어요. 다만 살펴볼 곳이 ${report.warnings}개 있어요(검수하는 분이 함께 봐요).`)
} else {
  console.log(`⛔ 고칠 곳 ${report.results.length}개 (꼭 고쳐야 올릴 수 있는 것 ${report.errors}개, 살펴볼 것 ${report.warnings}개)`)
}

report.results.forEach((r, i) => {
  const mark = r.level === 'error' ? '꼭 고쳐요' : '살펴봐요'
  console.log(`\n${i + 1}. [${mark}] ${r.title}  (id: ${r.id}, ${r.count}군데)`)
  for (const w of r.where) console.log(`   - ${w.line}번째 줄: ${w.text}`)
  console.log(`   고치는 법: ${r.fix}`)
})

if (report.results.length) {
  console.log('\n--- Claude에게 붙여 넣을 고치기 부탁 ---')
  console.log(fixPrompt(report))
}

process.exit(report.ok ? 0 : 1)
