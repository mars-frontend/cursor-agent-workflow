// Regex để loại bỏ Discord mentions và IDs
const MENTION_REGEX = /<@!?\d+>/g
const CODE_BLOCK_REGEX = /```[\s\S]*?```/g

// Convert số tiền có đơn vị sang số thực (VND)
export function convertToNumber(amount: string): number {
  const lower = amount.toLowerCase().trim()

  // Bỏ suffix tiền tệ phổ biến (đ, d, vnd)
  // Lưu ý: JS \\b không coi 'đ' là word-char, nên dùng lookahead whitespace/end thay vì \\b
  const withoutCurrency = lower.replace(/\s*(vnd|đ|d)\s*$/gi, '').trim()

  const unitMatch = withoutCurrency.match(/^(.*?)(k|tr|m)\b$/i)
  if (unitMatch) {
    const rawNum = unitMatch[1].trim()
    const unit = unitMatch[2].toLowerCase()
    const num = parseLocalizedNumber(rawNum)
    if (!Number.isFinite(num)) return 0
    if (unit === 'k') return num * 1000
    if (unit === 'tr' || unit === 'm') return num * 1_000_000
  }

  // Không có đơn vị: parse dạng number thường/format có dấu
  const num = parseLocalizedNumber(withoutCurrency)
  return Number.isFinite(num) ? num : 0
}

function parseLocalizedNumber(input: string): number {
  // Giữ lại số và dấu phân cách thường gặp
  let s = input.trim().replace(/\s+/g, '')
  if (!s) return NaN

  // Cho phép dạng "1.000.000" hoặc "1,000,000" hoặc "1,5" hoặc "1.5"
  // - Nếu có cả '.' và ',' thì assume ký tự xuất hiện cuối cùng là dấu thập phân
  const hasDot = s.includes('.')
  const hasComma = s.includes(',')

  if (hasDot && hasComma) {
    const lastDot = s.lastIndexOf('.')
    const lastComma = s.lastIndexOf(',')
    const decimalSep = lastDot > lastComma ? '.' : ','
    const thousandSep = decimalSep === '.' ? ',' : '.'
    s = s.replaceAll(thousandSep, '')
    s = s.replace(decimalSep, '.')
  } else if (hasComma) {
    // Nếu chỉ có ',':
    // - Nếu pattern giống thousand separators => bỏ hết ','
    // - Nếu giống decimal => đổi ',' thành '.'
    if (/^\d{1,3}(?:,\d{3})+(?:,\d+)?$/.test(s)) {
      s = s.replaceAll(',', '')
    } else {
      // coi ',' là thập phân
      // nếu có nhiều ',' thì bỏ hết trừ cái cuối cùng
      const parts = s.split(',')
      if (parts.length > 2) {
        const dec = parts.pop()
        s = parts.join('') + '.' + dec
      } else {
        s = s.replace(',', '.')
      }
    }
  } else if (hasDot) {
    if (/^\d{1,3}(?:\.\d{3})+(?:\.\d+)?$/.test(s)) {
      s = s.replaceAll('.', '')
    } else {
      const parts = s.split('.')
      if (parts.length > 2) {
        const dec = parts.pop()
        s = parts.join('') + '.' + dec
      }
      // else: single '.' already ok as decimal
    }
  }

  // Bỏ mọi ký tự lạ còn lại (phòng trường hợp dính ký tự)
  s = s.replace(/[^\d.]/g, '')
  if (!s || s === '.') return NaN

  const n = Number(s)
  return Number.isFinite(n) ? n : NaN
}

// Format số tiền để hiển thị
export function formatAmount(num: number): string {
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
  const cleanText = text
    .replace(CODE_BLOCK_REGEX, ' ')
    .replace(MENTION_REGEX, ' ')
  const amounts: string[] = []
  
  // 1) Ưu tiên: số tiền có đơn vị (k, tr, m) — hỗ trợ thập phân: 1,5tr / 1.5tr
  // Giới hạn độ dài để tránh match IDs cực dài
  const matchesWithUnit = cleanText.matchAll(/\b\d{1,9}(?:[.,]\d{1,3})?\s?(?:k|tr|m)\b/gi)
  for (const match of matchesWithUnit) amounts.push(match[0])
  
  // Nếu đã tìm thấy số có đơn vị, chỉ trả về những số đó
  if (amounts.length > 0) {
    return amounts
  }
  
  // 2) Số có format phân tách nghìn: 1.000.000 / 1,000,000 (có thể kèm đ/vnd)
  const matchesWithFormat = cleanText.matchAll(/\b\d{1,3}(?:[.,]\d{3})+\s?(?:đ|d|vnd)?(?=\s|$)/gi)
  for (const match of matchesWithFormat) amounts.push(match[0])
  
  // Nếu đã tìm thấy số có format, chỉ trả về những số đó
  if (amounts.length > 0) {
    return amounts
  }

  // 3) Số liền kèm đơn vị tiền: 1000000đ / 1000000 vnd
  const matchesWithCurrency = cleanText.matchAll(/\b\d{4,12}\s?(?:đ|d|vnd)(?=\s|$)/gi)
  for (const match of matchesWithCurrency) amounts.push(match[0])

  if (amounts.length > 0) {
    return amounts
  }
  
  // 4) Cuối cùng: số đơn giản, nhưng:
  // - yêu cầu >= 4 chữ số để giảm match nhầm (ví dụ "2024", "123")
  // - loại số năm phổ biến 1900-2099
  const simpleMatches = cleanText.matchAll(/\b([1-9]\d{3,11})\b/g)
  for (const match of simpleMatches) {
    const raw = match[1]
    const num = Number(raw)
    if (!Number.isFinite(num)) continue
    if (num >= 1900 && num <= 2099) continue
    amounts.push(raw)
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
