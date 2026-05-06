const { Client } = require('@notionhq/client')

const DB_IDS = {
  otList:    '8e259892-53c4-4a87-b234-84a7eae474a6', // 🎯 원씽 목록
  tasks:     'd218e51a-e1ce-4f1a-9aa6-188df35bb214', // 🎯 원씽 태스크
  decisions: '5287cdd0-6e25-4343-b62e-159b7aa6299b', // 📋 결정 로그
  planning:  '5ce2ae51-568c-41fb-ba65-9878064b7c90', // 📅 플래닝
  daily:     'fef439c1-5118-42f0-a264-920613b98cdf', // 📊 데일리 기록
  projects:  '41363756-d582-4363-bf0e-418b869f9c67', // 📁 프로젝트
}

function txt(prop) {
  if (!prop) return ''
  const arr = prop.title || prop.rich_text || []
  return arr.map(b => b.plain_text || '').join('')
}

async function syncFromNotion(token) {
  const notion = new Client({ auth: token })

  const [otListRes, decisionsRes, planningRes, dailyRes, projectsRes] = await Promise.all([
    notion.databases.query({
      database_id: DB_IDS.otList,
      sorts: [{ property: '번호', direction: 'ascending' }],
    }),
    notion.databases.query({
      database_id: DB_IDS.decisions,
      sorts: [{ property: '날짜', direction: 'descending' }],
    }),
    notion.databases.query({
      database_id: DB_IDS.planning,
      filter: { property: '현재세션', checkbox: { equals: true } },
      sorts: [{ property: '순서', direction: 'ascending' }],
    }),
    notion.databases.query({
      database_id: DB_IDS.daily,
      sorts: [{ property: '날짜', direction: 'ascending' }],
    }),
    notion.databases.query({
      database_id: DB_IDS.projects,
      sorts: [{ property: '순서', direction: 'ascending' }],
    }),
  ])

  // 🎯 원씽 목록
  const otList = otListRes.results.map(p => ({
    id:     txt(p.properties['번호']),
    title:  txt(p.properties['제목']),
    period: txt(p.properties['기간']),
    status: p.properties['상태']?.select?.name || '',
  }))
  const currentOT = otList.find(o => o.status === '진행중') || otList[0] || null

  // 🎯 원씽 태스크 (현재 원씽 라벨로 필터 + pageId 포함)
  const tasksRes = await notion.databases.query({
    database_id: DB_IDS.tasks,
    ...(currentOT ? { filter: { property: '원씽', select: { equals: currentOT.id } } } : {}),
    sorts: [{ property: '순서', direction: 'ascending' }],
  })
  const weekChecks = tasksRes.results.map(p => ({
    notionPageId: p.id,
    text: txt(p.properties['태스크']),
    done: !!p.properties['완료']?.checkbox,
  })).filter(t => t.text)

  // 📋 결정 로그
  const decisions = decisionsRes.results.map(p => {
    const dateStart = p.properties['날짜']?.date?.start || ''
    const raw = txt(p.properties['내용'])
    return {
      date:    dateStart.replace(/-/g, '.'),
      title:   txt(p.properties['제목']),
      bullets: raw.split('\n').map(s => s.trim()).filter(Boolean),
    }
  }).filter(d => d.title)

  // 📅 플래닝
  const planningRange = planningRes.results.length
    ? txt(planningRes.results[0].properties['기간'])
    : ''
  const planningItems = planningRes.results.map(p => ({
    notionPageId: p.id,
    time: txt(p.properties['시간']) || '--:--',
    text: txt(p.properties['태스크']),
    done: !!p.properties['완료']?.checkbox,
  })).filter(i => i.text)

  // 📊 데일리 기록
  const daily = {}
  for (const p of dailyRes.results) {
    const dateStart = p.properties['날짜']?.date?.start
    if (!dateStart) continue
    const raw = txt(p.properties['항목'])
    daily[dateStart] = {
      done:      p.properties['완료수']?.number || 0,
      focus:     p.properties['포커스']?.number || 0,
      condition: p.properties['컨디션']?.number || 0,
      items:     raw.split('\n').map(s => s.trim()).filter(Boolean),
    }
  }

  // 📁 프로젝트
  const projects = projectsRes.results.map(p => ({
    name:   txt(p.properties['이름']),
    meta:   txt(p.properties['메모']),
    status: p.properties['상태']?.select?.name || '',
    dot:    txt(p.properties['dot색상']) || '#71717a',
  })).filter(p => p.name)

  return {
    currentOT,
    otList,
    weekChecks,
    decisions,
    planning: { range: planningRange, items: planningItems },
    daily,
    projects,
    syncTime: Date.now(),
  }
}

async function updateTaskDone(token, pageId, done) {
  const notion = new Client({ auth: token })
  await notion.pages.update({
    page_id: pageId,
    properties: { '완료': { checkbox: done } },
  })
}

async function updatePlanningDone(token, pageId, done) {
  const notion = new Client({ auth: token })
  await notion.pages.update({
    page_id: pageId,
    properties: { '완료': { checkbox: done } },
  })
}

module.exports = { syncFromNotion, updateTaskDone, updatePlanningDone }
