// @ts-nocheck - TypeScript types not needed for runtime execution with tsx

const messages = [
  "☀️ Chào buổi sáng! Chúc một ngày code mượt ✨",
  "🚀 Good morning! Ship something meaningful today",
  "☕ Coffee first, bugs later",
  "🔥 Morning! Refactor with confidence"
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function run() {
  const webhook = process.env.DISCORD_WEBHOOK
  if (!webhook) throw new Error("Missing DISCORD_WEBHOOK")

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Daily Bot",
      embeds: [{
        title: "🌅 Good Morning",
        description: pick(messages),
        color: 16705372,
        footer: {
          text: new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
          })
        }
      }]
    })
  })
}

run()
