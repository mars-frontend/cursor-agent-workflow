import { Message, ChannelType, TextChannel, PublicThreadChannel, PrivateThreadChannel, User } from "discord.js"
import { AmountSummary } from "./parser.js"

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

  // Tạo nội dung thông báo
  let content = `💰 **Nhắc thanh toán**\n`
  
  // Thêm mentions nếu có
  if (mentionedUsers.length > 0) {
    const mentions = mentionedUsers.map(user => `<@${user.id}>`).join(' ')
    content += `${mentions}\n\n`
  }
  
  if (summary.amounts.length > 1) {
    // Nếu có nhiều khoản, hiển thị chi tiết và tổng
    content += `**Các khoản:** ${summary.amounts.join(', ')}\n`
    content += `**Tổng cộng: ${summary.totalFormatted}**\n`
  } else {
    // Nếu chỉ có 1 khoản, hiển thị đơn giản
    content += `Số tiền được đề cập: **${summary.totalFormatted}**\n`
  }
  
  content += `👉 Vui lòng thanh toán đúng hạn.`

  // Gửi thông báo vào thread với allowedMentions để đảm bảo mentions hoạt động
  await debitThread.send({ 
    content,
    allowedMentions: { users: mentionedUsers.map(user => user.id) }
  })
}
