import { Message, ChannelType, TextChannel, PublicThreadChannel, PrivateThreadChannel, User } from "discord.js"
import { AmountSummary } from "./parser.js"
import { addDebt } from "./debt-manager.js"

export async function notify(msg: Message, summary: AmountSummary, mentionedUsers: User[] = []) {
  // Lấy parent channel (text channel) từ message
  // Nếu message từ thread, lấy parent channel
  // Nếu message từ text channel, dùng chính nó
  let parentChannel: TextChannel | null = null

  if (msg.channel.type === ChannelType.GuildText) {
    parentChannel = msg.channel as TextChannel
  } else if (
    msg.channel.type === ChannelType.PublicThread ||
    msg.channel.type === ChannelType.PrivateThread
  ) {
    // Nếu message từ thread, lấy parent channel
    const threadChannel = msg.channel as PublicThreadChannel | PrivateThreadChannel
    if (threadChannel.parent && threadChannel.parent.type === ChannelType.GuildText) {
      parentChannel = threadChannel.parent as TextChannel
    }
  }

  if (!parentChannel) {
    return // Không thể tạo thread nếu không có parent text channel
  }

  // Tìm thread "Debit" đã tồn tại trong parent channel
  let debitThread = parentChannel.threads.cache.find(
    thread => thread.name === "Debit" && !thread.archived
  )

  // Nếu chưa có, tạo thread mới
  if (!debitThread) {
    debitThread = await parentChannel.threads.create({
      name: "Debit",
      reason: "Thread để thông báo các khoản thanh toán"
    })
  }

  // Xử lý nợ cho từng user được mention
  const debtInfo: Array<{
    user: User
    oldDebt: number
    newDebt: number
    totalDebt: number
    oldDebtFormatted: string
    newDebtFormatted: string
    totalDebtFormatted: string
  }> = []

  // Thông tin người chủ nợ (người gửi message)
  const creditor = msg.author

  if (mentionedUsers.length > 0) {
    // Cộng dồn nợ cho từng user
    for (const user of mentionedUsers) {
      const debt = addDebt(user.id, summary.amounts, creditor.id)
      debtInfo.push({ user, ...debt })
    }
  }

  // Tạo nội dung thông báo
  let content = `💰 **Nhắc thanh toán**\n`
  
  // Thông tin người chủ nợ
  content += `**👤 Người chủ nợ:** <@${creditor.id}> (${creditor.username})\n\n`
  
  // Thêm mentions nếu có
  if (mentionedUsers.length > 0) {
    const mentions = mentionedUsers.map(user => `<@${user.id}>`).join(' ')
    content += `**📋 Người nợ:** ${mentions}\n\n`
  }
  
  // Hiển thị thông tin nợ
  if (debtInfo.length > 0) {
    // Nếu có user được mention, hiển thị nợ cũ + mới = tổng
    for (const info of debtInfo) {
      if (info.oldDebt > 0) {
        // Có nợ cũ, hiển thị cộng dồn
        content += `**<@${info.user.id}>:**\n`
        if (summary.amounts.length > 1) {
          content += `  • Khoản mới: ${summary.amounts.join(', ')} (${info.newDebtFormatted})\n`
        } else {
          content += `  • Khoản mới: ${info.newDebtFormatted}\n`
        }
        content += `  • Nợ cũ: ${info.oldDebtFormatted}\n`
        content += `  • **Tổng nợ: ${info.totalDebtFormatted}**\n\n`
      } else {
        // Không có nợ cũ, chỉ hiển thị khoản mới
        content += `**<@${info.user.id}>:**\n`
        if (summary.amounts.length > 1) {
          content += `  • Khoản nợ: ${summary.amounts.join(', ')}\n`
          content += `  • **Tổng: ${info.totalDebtFormatted}**\n\n`
        } else {
          content += `  • **Số tiền: ${info.totalDebtFormatted}**\n\n`
        }
      }
    }
  } else {
    // Không có user được mention, hiển thị như cũ
    if (summary.amounts.length > 1) {
      content += `**Các khoản:** ${summary.amounts.join(', ')}\n`
      content += `**Tổng cộng: ${summary.totalFormatted}**\n\n`
    } else {
      content += `**Số tiền:** ${summary.totalFormatted}\n\n`
    }
  }
  
  content += `👉 Vui lòng thanh toán đúng hạn.`

  // Gửi thông báo vào thread với allowedMentions để đảm bảo mentions hoạt động
  await debitThread.send({ 
    content,
    allowedMentions: { users: mentionedUsers.map(user => user.id) }
  })
}
