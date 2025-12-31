import {
  PurchaseResearch,
  PurchaseResearchInsert,
  PurchaseResearchUpdate,
} from '@/types/api'
import { getEntryById, updateEntry } from './entries'

/**
 * Get all purchases/research items for a specific entry
 */
export async function getPurchasesByEntryId(
  entryId: string
): Promise<PurchaseResearch[]> {
  const entry = await getEntryById(entryId)
  return entry.purchases_research
}

/**
 * Update purchases/research items for a specific entry
 * This replaces all items for the entry with the provided array
 */
export async function updatePurchasesForEntry(
  entryId: string,
  purchases: (PurchaseResearchInsert | PurchaseResearchUpdate)[]
): Promise<PurchaseResearch[]> {
  const entry = await updateEntry({
    id: entryId,
    purchases_research: purchases,
  })
  return entry.purchases_research
}

/**
 * Add a new purchase/research item to an entry
 */
export async function addPurchaseToEntry(
  entryId: string,
  purchase: PurchaseResearchInsert
): Promise<PurchaseResearch[]> {
  const entry = await getEntryById(entryId)
  const updatedPurchases = [...entry.purchases_research, purchase]
  return updatePurchasesForEntry(entryId, updatedPurchases)
}

/**
 * Remove a purchase/research item from an entry
 */
export async function removePurchaseFromEntry(
  entryId: string,
  purchaseId: string
): Promise<PurchaseResearch[]> {
  const entry = await getEntryById(entryId)
  const updatedPurchases = entry.purchases_research.filter(
    (p) => p.id !== purchaseId
  )
  return updatePurchasesForEntry(entryId, updatedPurchases)
}

