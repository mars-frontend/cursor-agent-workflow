// Regex để loại bỏ Discord mentions và IDs
const MENTION_REGEX = /<@!?\d+>/g

// Convert số tiền có đơn vị sang số thực (VND)
function convertToNumber(amount: string): number {
  const lower = amount.toLowerCase()
  
  if (lower.endsWith('k')) {
    const num = parseFloat(lower.replace('k', '').trim())
    return num * 1000
  } else if (lower.endsWith('tr')) {
    const num = parseFloat(lower.replace('tr', '').trim())
    return num * 1000000
  } else if (lower.endsWith('m')) {
    const num = parseFloat(lower.replace('m', '').trim())
    return num * 1000000
  } else {
    // Xóa dấu phẩy/chấm và parse
    const cleaned = lower.replace(/[.,]/g, '')
    return parseFloat(cleaned) || 0
  }
}

// Format số tiền để hiển thị
function formatAmount(num: number): string {
  if (num >= 1000000) {
    const tr = num / 1000000
    if (tr % 1 === 0) {
      return `${tr}tr`
    }
    return `${tr.toFixed(1)}tr`
  } else if (num >= 1000) {
    const k = num / 1000
    if (k % 1 === 0) {
      return `${k}k`
    }
    return `${k.toFixed(1)}k`
  }
  return num.toLocaleString('vi-VN')
}

// Parse tất cả các số tiền trong text
export function parseAllAmounts(text: string): string[] {
  // Loại bỏ mentions để tránh match với user IDs
  const cleanText = text.replace(MENTION_REGEX, '')
  const amounts: string[] = []
  
  // Tìm tất cả số tiền có đơn vị (k, tr, m)
  const matchesWithUnit = cleanText.matchAll(/(\d{1,6})\s?(k|tr|m)/gi)
  for (const match of matchesWithUnit) {
    amounts.push(match[0])
  }
  
  // Nếu đã tìm thấy số có đơn vị, chỉ trả về những số đó
  if (amounts.length > 0) {
    return amounts
  }
  
  // Tìm số có format tiền tệ (có dấu phẩy/chấm)
  const matchesWithFormat = cleanText.matchAll(/\d{1,3}(?:[.,]\d{3})+/g)
  for (const match of matchesWithFormat) {
    amounts.push(match[0])
  }
  
  // Nếu đã tìm thấy số có format, chỉ trả về những số đó
  if (amounts.length > 0) {
    return amounts
  }
  
  // Cuối cùng: Tìm số đơn giản nhưng giới hạn
  const simpleMatches = cleanText.matchAll(/\b([1-9]\d{0,7})\b/g)
  for (const match of simpleMatches) {
    const num = parseInt(match[1])
    if (num > 0 && num < 100000000) {
      amounts.push(match[1])
    }
  }
  
  return amounts
}

// Parse và tính tổng số tiền
export function parseAmount(text: string): string | null {
  const amounts = parseAllAmounts(text)
  if (amounts.length === 0) {
    return null
  }
  
  // Nếu chỉ có 1 số tiền, trả về số đó
  if (amounts.length === 1) {
    return amounts[0]
  }
  
  // Tính tổng
  const total = amounts.reduce((sum, amount) => {
    return sum + convertToNumber(amount)
  }, 0)
  
  // Format tổng
  return formatAmount(total)
}

// Export function để lấy tất cả số tiền và tổng
export interface AmountSummary {
  amounts: string[]
  total: number
  totalFormatted: string
}

export function parseAmountSummary(text: string): AmountSummary | null {
  const amounts = parseAllAmounts(text)
  if (amounts.length === 0) {
    return null
  }
  
  const total = amounts.reduce((sum, amount) => {
    return sum + convertToNumber(amount)
  }, 0)
  
  return {
    amounts,
    total,
    totalFormatted: formatAmount(total)
  }
}
