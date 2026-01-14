import "dotenv/config"
import { Client, GatewayIntentBits, ChannelType, REST, Routes } from "discord.js"
import { parseAmountSummary } from "./parser.js"
import { shouldNotify } from "./rules.js"
import { notify } from "./notifier.js"
import { isPaymentCommand, handlePaymentCommand } from "./payment-handler.js"
import { commands, handleCommand } from "./commands.js"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

// Đăng ký slash commands
async function registerCommands() {
  const token = process.env.DISCORD_BOT_TOKEN
  const clientId = process.env.DISCORD_CLIENT_ID
  const guildId = process.env.DISCORD_GUILD_ID

  if (!token || !clientId) {
    console.error("❌ Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID")
    return
  }

  const rest = new REST({ version: '10' }).setToken(token)

  try {
    if (guildId) {
      console.log(`🔄 Đang đăng ký slash commands (scope: guild ${guildId})...`)

      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      )

      console.log('✅ Đã đăng ký slash commands cho guild thành công (hiệu lực gần như ngay lập tức).')
    } else {
      console.log('🔄 Đang đăng ký slash commands (scope: global)...')

      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      )

      console.log('✅ Đã đăng ký slash commands global. Lưu ý: có thể mất đến 1 giờ để Discord hiển thị.')
    }
  } catch (error) {
    console.error('❌ Lỗi khi đăng ký commands:', error)
  }
}

// Xử lý interactions (slash commands)
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  try {
    await handleCommand(interaction)
  } catch (error) {
    console.error('Error handling command:', error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: '❌ Có lỗi xảy ra khi xử lý command.',
        ephemeral: true
      })
    } else {
      await interaction.reply({
        content: '❌ Có lỗi xảy ra khi xử lý command.',
        ephemeral: true
      })
    }
  }
})

client.on("messageCreate", async (msg) => {
  // Bỏ qua messages từ bot
  if (msg.author.bot) return

  // Chỉ đọc/parse messages trong thread "Debit"
  // (và thread đó phải thuộc parent channel đúng)
  if (
    msg.channel.type !== ChannelType.PublicThread &&
    msg.channel.type !== ChannelType.PrivateThread
  ) {
    return
  }

  if (msg.channel.name !== "Debit") {
    return
  }

  const parentChannel = msg.channel.parent
  if (!parentChannel || parentChannel.type !== ChannelType.GuildText) {
    return
  }

  const channelName = parentChannel.name

  // Kiểm tra xem có phải command xóa nợ không
  if (isPaymentCommand(msg.content)) {
    const mentionedUsers = Array.from(msg.mentions.users.values())
    const handled = await handlePaymentCommand(msg, mentionedUsers)
    if (handled) return
  }

  // Xử lý thêm nợ như bình thường
  const summary = parseAmountSummary(msg.content)

  const ok = shouldNotify({
    isBot: false,
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

// Đăng ký commands khi bot ready
client.once("ready", async () => {
  console.log(`✅ Bot đã đăng nhập với tên: ${client.user?.tag}`)
  await registerCommands()
})

client.login(token).catch((error) => {
  console.error("❌ Failed to login to Discord:", error.message)
  process.exit(1)
})
