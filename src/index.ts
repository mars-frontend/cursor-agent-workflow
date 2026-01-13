import "dotenv/config"
import { Client, GatewayIntentBits, ChannelType } from "discord.js"
import { parseAmountSummary } from "./parser.js"
import { shouldNotify } from "./rules.js"
import { notify } from "./notifier.js"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

client.on("messageCreate", async (msg) => {
  const summary = parseAmountSummary(msg.content)

  // Lấy channel name từ text channel hoặc parent channel của thread
  let channelName = ""
  
  if (msg.channel.type === ChannelType.GuildText) {
    channelName = msg.channel.name
  } else if (
    msg.channel.type === ChannelType.PublicThread ||
    msg.channel.type === ChannelType.PrivateThread
  ) {
    // Nếu message từ thread, lấy parent channel name
    const threadChannel = msg.channel
    if ('parent' in threadChannel && threadChannel.parent) {
      const parentChannel = threadChannel.parent
      if (parentChannel.type === ChannelType.GuildText) {
        channelName = parentChannel.name
      }
    }
  }

  const ok = shouldNotify({
    isBot: msg.author.bot,
    channelName,
    amount: summary ? summary.totalFormatted : null
  })

  if (!ok || !summary) return

  // Lấy danh sách người được mention
  const mentionedUsers = Array.from(msg.mentions.users.values())

  await notify(msg, summary, mentionedUsers)
})

const token = process.env.DISCORD_BOT_TOKEN
if (!token) {
  console.error("❌ Error: DISCORD_BOT_TOKEN environment variable is not set")
  console.error("💡 Please set DISCORD_BOT_TOKEN in your .env file or environment")
  process.exit(1)
}

client.login(token).catch((error) => {
  console.error("❌ Failed to login to Discord:", error.message)
  process.exit(1)
})
