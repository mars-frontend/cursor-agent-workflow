import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  ChannelType,
  TextChannel,
  PublicThreadChannel,
  PrivateThreadChannel
} from "discord.js"
import { addDebt, getDebt, clearDebt, reduceDebt } from "./debt-manager.js"
import { parseAmountSummary, formatAmount } from "./parser.js"
import { loadDebts } from "./debt-manager.js"

// Helper để lấy parent channel
function getParentChannel(interaction: ChatInputCommandInteraction): TextChannel | null {
  if (interaction.channel?.type === ChannelType.GuildText) {
    return interaction.channel as TextChannel
  } else if (
    interaction.channel?.type === ChannelType.PublicThread ||
    interaction.channel?.type === ChannelType.PrivateThread
  ) {
    const threadChannel = interaction.channel as PublicThreadChannel | PrivateThreadChannel
    if (threadChannel.parent && threadChannel.parent.type === ChannelType.GuildText) {
      return threadChannel.parent as TextChannel
    }
  }
  return null
}

// Helper để lấy hoặc tạo Debit thread
async function getDebitThread(parentChannel: TextChannel) {
  let debitThread = parentChannel.threads.cache.find(
    thread => thread.name === "Debit" && !thread.archived
  )

  if (!debitThread) {
    debitThread = await parentChannel.threads.create({
      name: "Debit",
      reason: "Thread để thông báo các khoản thanh toán"
    })
  }

  return debitThread
}

// Định nghĩa các commands
export const commands = [
  new SlashCommandBuilder()
    .setName("debt")
    .setDescription("Xem nợ của một người")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Người cần xem nợ")
        .setRequired(false)
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("add-debt")
    .setDescription("Thêm nợ cho người khác")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Người nợ")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("amount")
        .setDescription("Số tiền (ví dụ: 50k, 2tr, 1000000)")
        .setRequired(true)
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Thanh toán nợ")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Người thanh toán (để trống nếu là bạn)")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("amount")
        .setDescription("Số tiền đã trả (để trống để trả hết)")
        .setRequired(false)
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("clear-debt")
    .setDescription("Xóa toàn bộ nợ")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Người cần xóa nợ (để trống nếu là bạn)")
        .setRequired(false)
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("list-debts")
    .setDescription("Liệt kê tất cả nợ")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Hiển thị hướng dẫn sử dụng bot")
    .toJSON(),
]

// Xử lý các commands
export async function handleCommand(interaction: ChatInputCommandInteraction) {
  const commandName = interaction.commandName

  // Kiểm tra channel
  const parentChannel = getParentChannel(interaction)
  if (!parentChannel || parentChannel.name !== "đại-gia-bđs") {
    await interaction.reply({
      content: "❌ Bot chỉ hoạt động trong channel `đại-gia-bđs`",
      ephemeral: true
    })
    return
  }

  switch (commandName) {
    case "debt":
      await handleDebtCommand(interaction, parentChannel)
      break
    case "add-debt":
      await handleAddDebtCommand(interaction, parentChannel)
      break
    case "pay":
      await handlePayCommand(interaction, parentChannel)
      break
    case "clear-debt":
      await handleClearDebtCommand(interaction, parentChannel)
      break
    case "list-debts":
      await handleListDebtsCommand(interaction, parentChannel)
      break
    case "help":
      await handleHelpCommand(interaction)
      break
  }
}

// Command: /debt
async function handleDebtCommand(
  interaction: ChatInputCommandInteraction,
  parentChannel: TextChannel
) {
  const targetUser = interaction.options.getUser("user") || interaction.user
  const debtInfo = getDebt(targetUser.id)

  if (!debtInfo) {
    await interaction.reply({
      content: `✅ <@${targetUser.id}> không có nợ nào.`,
      ephemeral: true
    })
    return
  }

  const creditorMention = debtInfo.creditorId ? `<@${debtInfo.creditorId}>` : "Không rõ"

  const embed = new EmbedBuilder()
    .setColor(0xFF6B6B)
    .setTitle(`💰 Thông tin nợ`)
    .setDescription(`**Người nợ:** <@${targetUser.id}>\n**Người chủ nợ:** ${creditorMention}`)
    .addFields(
      { name: "Tổng nợ", value: `**${debtInfo.totalDebtFormatted}**`, inline: true },
      { name: "Số khoản", value: `${debtInfo.history.length}`, inline: true }
    )
    .setTimestamp()

  await interaction.reply({ embeds: [embed] })
}

// Command: /add-debt
async function handleAddDebtCommand(
  interaction: ChatInputCommandInteraction,
  parentChannel: TextChannel
) {
  const targetUser = interaction.options.getUser("user", true)
  const amountStr = interaction.options.getString("amount", true)

  const summary = parseAmountSummary(amountStr)
  if (!summary || summary.amounts.length === 0) {
    await interaction.reply({
      content: "❌ Số tiền không hợp lệ. Ví dụ: 50k, 2tr, 1000000",
      ephemeral: true
    })
    return
  }

  const creditor = interaction.user
  const debt = addDebt(targetUser.id, summary.amounts, creditor.id)

  const debitThread = await getDebitThread(parentChannel)

  let content = `💰 **Nhắc thanh toán**\n`
  content += `**👤 Người chủ nợ:** <@${creditor.id}> (${creditor.username})\n\n`
  content += `**📋 Người nợ:** <@${targetUser.id}>\n\n`

  if (debt.oldDebt > 0) {
    content += `**<@${targetUser.id}>:**\n`
    if (summary.amounts.length > 1) {
      content += `  • Khoản mới: ${summary.amounts.join(', ')} (${debt.newDebtFormatted})\n`
    } else {
      content += `  • Khoản mới: ${debt.newDebtFormatted}\n`
    }
    content += `  • Nợ cũ: ${debt.oldDebtFormatted}\n`
    content += `  • **Tổng nợ: ${debt.totalDebtFormatted}**\n\n`
  } else {
    content += `**<@${targetUser.id}>:**\n`
    if (summary.amounts.length > 1) {
      content += `  • Khoản nợ: ${summary.amounts.join(', ')}\n`
      content += `  • **Tổng: ${debt.totalDebtFormatted}**\n\n`
    } else {
      content += `  • **Số tiền: ${debt.totalDebtFormatted}**\n\n`
    }
  }

  content += `👉 Vui lòng thanh toán đúng hạn.`

  await interaction.reply({
    content: `✅ Đã thêm nợ **${debt.totalDebtFormatted}** cho <@${targetUser.id}>`,
    ephemeral: true
  })

  await debitThread.send({
    content,
    allowedMentions: { users: [targetUser.id] }
  })
}

// Command: /pay
async function handlePayCommand(
  interaction: ChatInputCommandInteraction,
  parentChannel: TextChannel
) {
  const targetUser = interaction.options.getUser("user") || interaction.user
  const amountStr = interaction.options.getString("amount")

  const debtInfo = getDebt(targetUser.id)

  if (!debtInfo) {
    await interaction.reply({
      content: `❌ <@${targetUser.id}> không có nợ nào để thanh toán.`,
      ephemeral: true
    })
    return
  }

  const debitThread = await getDebitThread(parentChannel)
  const creditorMention = debtInfo.creditorId ? `<@${debtInfo.creditorId}>` : "Người chủ nợ"

  if (!amountStr) {
    // Chỉ chủ nợ mới được xóa toàn bộ nợ bằng command
    const actorId = interaction.user.id
    const isCreditor = !!debtInfo.creditorId && actorId === debtInfo.creditorId
    if (!isCreditor) {
      await interaction.reply({
        content: `❌ Bạn không có quyền xóa toàn bộ nợ của <@${targetUser.id}>. Chỉ **chủ nợ** mới được xóa bằng command.`,
        ephemeral: true
      })
      return
    }

    // Thanh toán hết
    clearDebt(targetUser.id)
    await interaction.reply({
      content: `✅ Đã xóa toàn bộ nợ của <@${targetUser.id}>`,
      ephemeral: true
    })

    await debitThread.send({
      content: `✅ **Đã xóa nợ**\n<@${targetUser.id}> đã thanh toán hết nợ: **${debtInfo.totalDebtFormatted}**\n**👤 Người chủ nợ:** ${creditorMention}\n🎉 Không còn nợ!`,
      allowedMentions: { users: [targetUser.id] }
    })
  } else {
    // Thanh toán một phần
    const summary = parseAmountSummary(amountStr)
    if (!summary) {
      await interaction.reply({
        content: "❌ Số tiền không hợp lệ. Ví dụ: 50k, 2tr",
        ephemeral: true
      })
      return
    }

    const result = reduceDebt(targetUser.id, summary.totalFormatted)
    if (!result) {
      await interaction.reply({
        content: "❌ Không thể xử lý thanh toán.",
        ephemeral: true
      })
      return
    }

    await interaction.reply({
      content: `✅ Đã ghi nhận thanh toán **${result.paidAmountFormatted}** của <@${targetUser.id}>`,
      ephemeral: true
    })

    if (result.remainingDebt === 0) {
      await debitThread.send({
        content: `✅ **Đã thanh toán**\n<@${targetUser.id}> đã trả: **${result.paidAmountFormatted}**\n**👤 Người chủ nợ:** ${creditorMention}\n🎉 Đã thanh toán hết nợ!`,
        allowedMentions: { users: [targetUser.id] }
      })
    } else {
      await debitThread.send({
        content: `✅ **Đã thanh toán một phần**\n<@${targetUser.id}>:\n  • Đã trả: **${result.paidAmountFormatted}**\n  • Nợ cũ: ${result.oldDebtFormatted}\n  • **Còn lại: ${result.remainingDebtFormatted}**\n**👤 Người chủ nợ:** ${creditorMention}`,
        allowedMentions: { users: [targetUser.id] }
      })
    }
  }
}

// Command: /clear-debt
async function handleClearDebtCommand(
  interaction: ChatInputCommandInteraction,
  parentChannel: TextChannel
) {
  const targetUser = interaction.options.getUser("user") || interaction.user
  const debtInfo = getDebt(targetUser.id)

  if (!debtInfo) {
    await interaction.reply({
      content: `❌ <@${targetUser.id}> không có nợ nào để xóa.`,
      ephemeral: true
    })
    return
  }

  // Chỉ chủ nợ mới được xóa toàn bộ nợ bằng command
  const actorId = interaction.user.id
  const isCreditor = !!debtInfo.creditorId && actorId === debtInfo.creditorId
  if (!isCreditor) {
    await interaction.reply({
      content: `❌ Bạn không có quyền xóa toàn bộ nợ của <@${targetUser.id}>. Chỉ **chủ nợ** mới được xóa bằng command.`,
      ephemeral: true
    })
    return
  }

  clearDebt(targetUser.id)
  const creditorMention = debtInfo.creditorId ? `<@${debtInfo.creditorId}>` : "Người chủ nợ"

  await interaction.reply({
    content: `✅ Đã xóa toàn bộ nợ của <@${targetUser.id}>`,
    ephemeral: true
  })

  const debitThread = await getDebitThread(parentChannel)
  await debitThread.send({
    content: `✅ **Đã xóa nợ**\n<@${targetUser.id}> đã thanh toán hết nợ: **${debtInfo.totalDebtFormatted}**\n**👤 Người chủ nợ:** ${creditorMention}\n🎉 Không còn nợ!`,
    allowedMentions: { users: [targetUser.id] }
  })
}

// Command: /list-debts
async function handleListDebtsCommand(
  interaction: ChatInputCommandInteraction,
  parentChannel: TextChannel
) {
  const { loadDebts } = await import('./debt-manager.js')
  const debts = loadDebts()
  const debtEntries = Object.values(debts) as Array<{
    userId: string
    creditorId: string
    totalDebt: number
  }>

  if (debtEntries.length === 0) {
    await interaction.reply({
      content: "✅ Không có nợ nào trong hệ thống.",
      ephemeral: true
    })
    return
  }

  const embed = new EmbedBuilder()
    .setColor(0xFF6B6B)
    .setTitle("📋 Danh sách nợ")
    .setDescription(`Tổng cộng: **${debtEntries.length}** người có nợ`)

  const fields = debtEntries.slice(0, 25).map(debt => ({
    name: `<@${debt.userId}>`,
    value: `**${formatAmount(debt.totalDebt)}**\nChủ nợ: <@${debt.creditorId}>`,
    inline: true
  }))

  embed.addFields(fields)

  if (debtEntries.length > 25) {
    embed.setFooter({ text: `Hiển thị 25/${debtEntries.length} người` })
  }

  await interaction.reply({ embeds: [embed] })
}

// Command: /help
async function handleHelpCommand(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x4ECDC4)
    .setTitle("📖 Hướng dẫn sử dụng Bot Quản Lý Nợ")
    .setDescription("Bot giúp quản lý nợ trong Discord server")
    .addFields(
      {
        name: "💰 /debt [user]",
        value: "Xem nợ của một người (để trống để xem nợ của bạn)",
        inline: false
      },
      {
        name: "➕ /add-debt <user> <amount>",
        value: "Thêm nợ cho người khác\nVí dụ: `/add-debt @user 50k`",
        inline: false
      },
      {
        name: "💳 /pay [user] [amount]",
        value: "Thanh toán nợ\n- Để trống amount để trả hết\n- Ví dụ: `/pay @user 50k`",
        inline: false
      },
      {
        name: "🗑️ /clear-debt [user]",
        value: "Xóa toàn bộ nợ (để trống để xóa nợ của bạn)",
        inline: false
      },
      {
        name: "📋 /list-debts",
        value: "Liệt kê tất cả nợ trong hệ thống",
        inline: false
      },
      {
        name: "💬 Cách sử dụng tự động",
        value: "Bạn cũng có thể chat bình thường:\n- `anh @user 50k` → Tự động thêm nợ\n- `đã trả 50k @user` → Thanh toán nợ",
        inline: false
      }
    )
    .setFooter({ text: "Bot chỉ hoạt động trong channel 'đại-gia-bđs'" })

  await interaction.reply({ embeds: [embed] })
}
