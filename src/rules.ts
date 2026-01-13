export function shouldNotify(ctx: {
    isBot: boolean
    channelName: string
    amount: string | null
  }) {
    if (ctx.isBot) return false
    if (ctx.channelName !== "đại-gia-bđs") return false
    if (!ctx.amount) return false
    return true
  }
  