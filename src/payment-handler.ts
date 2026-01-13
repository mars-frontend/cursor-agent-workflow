import { Message, ChannelType, TextChannel, PublicThreadChannel, PrivateThreadChannel, User } from "discord.js"
import { clearDebt, reduceDebt, getDebt } from "./debt-manager.js"
import { parseAmountSummary, convertToNumber, formatAmount } from "./parser.js"

// Keywords để nhận diện command xóa nợ
const PAYMENT_KEYWORDS = ['đã trả', 'đã trả hết', 'đã thanh toán', 'đã thanh toán hết', 'paid', 'clear debt', 'xóa nợ']
const FULL_PAYMENT_KEYWORDS = ['đã trả hết', 'đã thanh toán hết', 'clear all', 'xóa hết']

// Kiểm tra xem message có phải là command xóa nợ không
export function isPaymentCommand(content: string): boolean {
  const lower = content.toLowerCase()
  return PAYMENT_KEYWORDS.some(keyword => lower.includes(keyword))
}

// Xử lý command xóa nợ
export async function handlePaymentCommand(
  msg: Message,
  mentionedUsers: User[]
): Promise<boolean> {
  const content = msg.content.toLowerCase()
  const isFullPayment = FULL_PAYMENT_KEYWORDS.some(keyword => content.includes(keyword))
  
  // Lấy parent channel và channel name
  let parentChannel: TextChannel | null = null
  let channelName = ""

  if (msg.channel.type === ChannelType.GuildText) {
    parentChannel = msg.channel as TextChannel
    channelName = parentChannel.name
  } else if (
    msg.channel.type === ChannelType.PublicThread ||
    msg.channel.type === ChannelType.PrivateThread
  ) {
    const threadChannel = msg.channel as PublicThreadChannel | PrivateThreadChannel
    if (threadChannel.parent && threadChannel.parent.type === ChannelType.GuildText) {
      parentChannel = threadChannel.parent as TextChannel
      channelName = parentChannel.name
    }
  }

  if (!parentChannel) {
    return false
  }

  // Chỉ xử lý trong channel đúng
  if (channelName !== "đại-gia-bđs") {
    return false
  }

  // Tìm thread "Debit"
  let debitThread = parentChannel.threads.cache.find(
    thread => thread.name === "Debit" && !thread.archived
  )

  if (!debitThread) {
    // Nếu không có thread, tạo mới
    debitThread = await parentChannel.threads.create({
      name: "Debit",
      reason: "Thread để thông báo các khoản thanh toán"
    })
  }

  // Parse số tiền đã trả (nếu có)
  const summary = parseAmountSummary(msg.content)
  const paidAmount = summary ? summary.total : null

  if (mentionedUsers.length === 0) {
    // Không có mention, xử lý cho chính người gửi
    const user = msg.author
    const debtInfo = getDebt(user.id)
    
    if (!debtInfo) {
      await debitThread.send({
        content: `❌ <@${user.id}> không có nợ nào để xóa.`
      })
      return true
    }

    const creditorMention = debtInfo.creditorId ? `<@${debtInfo.creditorId}>` : 'Người chủ nợ'
    
    if (isFullPayment || !paidAmount) {
      // Xóa toàn bộ nợ
      clearDebt(user.id)
      await debitThread.send({
        content: `✅ **Đã xóa nợ**\n<@${user.id}> đã thanh toán hết nợ: **${debtInfo.totalDebtFormatted}**\n**👤 Người chủ nợ:** ${creditorMention}\n🎉 Không còn nợ!`
      })
    } else {
      // Giảm nợ một phần
      const result = reduceDebt(user.id, summary!.totalFormatted)
      if (result) {
        if (result.remainingDebt === 0) {
          await debitThread.send({
            content: `✅ **Đã thanh toán**\n<@${user.id}> đã trả: **${result.paidAmountFormatted}**\n**👤 Người chủ nợ:** ${creditorMention}\n🎉 Đã thanh toán hết nợ!`
          })
        } else {
          await debitThread.send({
            content: `✅ **Đã thanh toán một phần**\n<@${user.id}>:\n  • Đã trả: **${result.paidAmountFormatted}**\n  • Nợ cũ: ${result.oldDebtFormatted}\n  • **Còn lại: ${result.remainingDebtFormatted}**\n**👤 Người chủ nợ:** ${creditorMention}`
          })
        }
      }
    }
    return true
  }

  // Xử lý cho từng user được mention
  let responseContent = `✅ **Thông báo thanh toán**\n\n`

  for (const user of mentionedUsers) {
    const debtInfo = getDebt(user.id)
    
    if (!debtInfo) {
      responseContent += `❌ <@${user.id}> không có nợ nào.\n\n`
      continue
    }

    const creditorMention = debtInfo.creditorId ? `<@${debtInfo.creditorId}>` : 'Người chủ nợ'
    
    if (isFullPayment || !paidAmount) {
      // Xóa toàn bộ nợ
      clearDebt(user.id)
      responseContent += `✅ <@${user.id}> đã thanh toán hết: **${debtInfo.totalDebtFormatted}**\n**👤 Người chủ nợ:** ${creditorMention}\n🎉 Không còn nợ!\n\n`
    } else {
      // Giảm nợ một phần
      const result = reduceDebt(user.id, summary!.totalFormatted)
      if (result) {
        if (result.remainingDebt === 0) {
          responseContent += `✅ <@${user.id}> đã trả: **${result.paidAmountFormatted}**\n**👤 Người chủ nợ:** ${creditorMention}\n🎉 Đã thanh toán hết nợ!\n\n`
        } else {
          responseContent += `✅ <@${user.id}>:\n  • Đã trả: **${result.paidAmountFormatted}**\n  • Nợ cũ: ${result.oldDebtFormatted}\n  • **Còn lại: ${result.remainingDebtFormatted}**\n**👤 Người chủ nợ:** ${creditorMention}\n\n`
        }
      }
    }
  }

  await debitThread.send({
    content: responseContent.trim(),
    allowedMentions: { users: mentionedUsers.map(user => user.id) }
  })

  return true
}
