import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { convertToNumber, formatAmount } from './parser.js'

interface DebtRecord {
  userId: string
  creditorId: string // Người chủ nợ (người cần được trả)
  totalDebt: number
  lastUpdated: string
  history: Array<{
    amount: number
    amountFormatted: string
    timestamp: string
    creditorId: string
  }>
}

const DEBT_FILE = join(process.cwd(), 'data', 'debts.json')

// Đảm bảo thư mục data tồn tại
function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    const { mkdirSync } = require('fs')
    try {
      mkdirSync(dataDir, { recursive: true })
    } catch (error) {
      // Thư mục có thể đã được tạo bởi process khác
    }
  }
}

// Đọc dữ liệu nợ từ file
export function loadDebts(): Record<string, DebtRecord> {
  ensureDataDir()
  
  if (!existsSync(DEBT_FILE)) {
    return {}
  }

  try {
    const data = readFileSync(DEBT_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading debts:', error)
    return {}
  }
}

// Lưu dữ liệu nợ vào file
function saveDebts(debts: Record<string, DebtRecord>) {
  ensureDataDir()
  
  try {
    writeFileSync(DEBT_FILE, JSON.stringify(debts, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving debts:', error)
  }
}

// Thêm nợ mới cho user
export function addDebt(userId: string, amounts: string[], creditorId: string): {
  oldDebt: number
  newDebt: number
  totalDebt: number
  oldDebtFormatted: string
  newDebtFormatted: string
  totalDebtFormatted: string
  creditorId: string
} {
  const debts = loadDebts()
  
  // Tính tổng nợ mới
  const newDebt = amounts.reduce((sum, amount) => {
    return sum + convertToNumber(amount)
  }, 0)
  
  // Lấy nợ cũ
  const oldDebt = debts[userId]?.totalDebt || 0
  const totalDebt = oldDebt + newDebt
  
  // Giữ creditorId cũ nếu có, hoặc dùng creditorId mới
  const existingCreditorId = debts[userId]?.creditorId || creditorId
  
  // Cập nhật record
  const record: DebtRecord = {
    userId,
    creditorId: existingCreditorId,
    totalDebt,
    lastUpdated: new Date().toISOString(),
    history: [
      ...(debts[userId]?.history || []),
      ...amounts.map(amount => ({
        amount: convertToNumber(amount),
        amountFormatted: amount,
        timestamp: new Date().toISOString(),
        creditorId
      }))
    ]
  }
  
  debts[userId] = record
  saveDebts(debts)
  
  return {
    oldDebt,
    newDebt,
    totalDebt,
    oldDebtFormatted: formatAmount(oldDebt),
    newDebtFormatted: formatAmount(newDebt),
    totalDebtFormatted: formatAmount(totalDebt),
    creditorId: existingCreditorId
  }
}

// Lấy thông tin nợ hiện tại của user
export function getDebt(userId: string): {
  totalDebt: number
  totalDebtFormatted: string
  creditorId: string
  history: DebtRecord['history']
} | null {
  const debts = loadDebts()
  const record = debts[userId]
  
  if (!record) {
    return null
  }
  
  return {
    totalDebt: record.totalDebt,
    totalDebtFormatted: formatAmount(record.totalDebt),
    creditorId: record.creditorId,
    history: record.history
  }
}

// Xóa nợ (khi đã thanh toán)
export function clearDebt(userId: string): boolean {
  const debts = loadDebts()
  
  if (!debts[userId]) {
    return false
  }
  
  delete debts[userId]
  saveDebts(debts)
  
  return true
}

// Giảm nợ (khi thanh toán một phần)
export function reduceDebt(userId: string, amount: string): {
  oldDebt: number
  paidAmount: number
  remainingDebt: number
  oldDebtFormatted: string
  paidAmountFormatted: string
  remainingDebtFormatted: string
} | null {
  const debts = loadDebts()
  const record = debts[userId]
  
  if (!record) {
    return null
  }
  
  const oldDebt = record.totalDebt
  const paidAmount = convertToNumber(amount)
  const remainingDebt = Math.max(0, oldDebt - paidAmount)
  
  if (remainingDebt === 0) {
    delete debts[userId]
  } else {
    debts[userId] = {
      ...record,
      totalDebt: remainingDebt,
      lastUpdated: new Date().toISOString()
    }
  }
  
  saveDebts(debts)
  
  return {
    oldDebt,
    paidAmount,
    remainingDebt,
    oldDebtFormatted: formatAmount(oldDebt),
    paidAmountFormatted: formatAmount(paidAmount),
    remainingDebtFormatted: formatAmount(remainingDebt)
  }
}
