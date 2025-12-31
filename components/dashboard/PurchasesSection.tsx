'use client'

import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui'
import { Button, Input, TextArea, Badge, Select } from '@/components/ui'
import type { PurchaseResearch, PurchaseResearchInsert } from '@/types/api'

interface PurchasesSectionProps {
  purchases: PurchaseResearch[]
  onUpdate: (purchases: (Omit<PurchaseResearchInsert, 'entry_id'> | PurchaseResearch)[]) => void
  disabled?: boolean
}

const categoryOptions = [
  { value: 'purchase', label: 'Purchase' },
  { value: 'research', label: 'Research' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const statusOptions = [
  { value: 'researching', label: 'Researching' },
  { value: 'decided', label: 'Decided' },
  { value: 'purchased', label: 'Purchased' },
  { value: 'dropped', label: 'Dropped' },
]

export function PurchasesSection({
  purchases,
  onUpdate,
  disabled = false,
}: PurchasesSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newPurchase, setNewPurchase] = useState({
    item_name: '',
    category: 'purchase' as const,
    priority: 'medium' as const,
    status: 'researching' as const,
    notes: '',
  })

  const handleAdd = () => {
    if (!newPurchase.item_name.trim()) return

    const purchaseToAdd: Omit<PurchaseResearchInsert, 'entry_id'> = {
      item_name: newPurchase.item_name.trim(),
      category: newPurchase.category,
      priority: newPurchase.priority,
      status: newPurchase.status,
      notes: newPurchase.notes.trim() || null,
      order_index: purchases.length,
    }

    onUpdate([...purchases, purchaseToAdd])
    setNewPurchase({
      item_name: '',
      category: 'purchase',
      priority: 'medium',
      status: 'researching',
      notes: '',
    })
    setIsAdding(false)
  }

  const handleRemove = (purchaseId: string) => {
    onUpdate(purchases.filter((p) => p.id !== purchaseId))
  }

  const handleUpdate = (
    purchaseId: string,
    updates: Partial<PurchaseResearch>
  ) => {
    onUpdate(
      purchases.map((p) => (p.id === purchaseId ? { ...p, ...updates } : p))
    )
  }

  const getPriorityBadgeVariant = (
    priority: string
  ): 'default' | 'warning' | 'error' => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusBadgeVariant = (status: string): 'default' | 'success' | 'warning' => {
    switch (status) {
      case 'purchased':
        return 'success'
      case 'decided':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Purchases & Research
          </h3>
          {!isAdding && !disabled && (
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              variant="secondary"
            >
              + Add Item
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="p-4 border border-[var(--border)] rounded-lg bg-[var(--background)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-[var(--foreground)]">
                      {purchase.item_name}
                    </h4>
                    <Badge variant="default">
                      {categoryOptions.find((o) => o.value === purchase.category)
                        ?.label}
                    </Badge>
                    <Badge variant={getPriorityBadgeVariant(purchase.priority)}>
                      {priorityOptions.find((o) => o.value === purchase.priority)
                        ?.label}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(purchase.status)}>
                      {statusOptions.find((o) => o.value === purchase.status)
                        ?.label}
                    </Badge>
                  </div>
                  {!disabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Select
                        value={purchase.category}
                        onChange={(e) =>
                          handleUpdate(purchase.id, {
                            category: e.target.value as PurchaseResearch['category'],
                          })
                        }
                        options={categoryOptions}
                        placeholder="Category"
                      />
                      <Select
                        value={purchase.priority}
                        onChange={(e) =>
                          handleUpdate(purchase.id, {
                            priority: e.target.value as PurchaseResearch['priority'],
                          })
                        }
                        options={priorityOptions}
                        placeholder="Priority"
                      />
                      <Select
                        value={purchase.status}
                        onChange={(e) =>
                          handleUpdate(purchase.id, {
                            status: e.target.value as PurchaseResearch['status'],
                          })
                        }
                        options={statusOptions}
                        placeholder="Status"
                      />
                    </div>
                  )}
                  {purchase.notes && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {purchase.notes}
                    </p>
                  )}
                  {!disabled && (
                    <TextArea
                      placeholder="Add notes or links..."
                      value={purchase.notes || ''}
                      onChange={(e) =>
                        handleUpdate(purchase.id, { notes: e.target.value })
                      }
                      rows={2}
                    />
                  )}
                </div>
                {!disabled && (
                  <Button
                    onClick={() => handleRemove(purchase.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}

          {isAdding && (
            <div className="p-4 border-2 border-dashed border-[var(--border)] rounded-lg">
              <div className="space-y-3">
                <Input
                  placeholder="Item name"
                  value={newPurchase.item_name}
                  onChange={(e) =>
                    setNewPurchase({ ...newPurchase, item_name: e.target.value })
                  }
                  autoFocus
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Select
                    value={newPurchase.category}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        category: e.target.value as PurchaseResearch['category'],
                      })
                    }
                    options={categoryOptions}
                    placeholder="Category"
                  />
                  <Select
                    value={newPurchase.priority}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        priority: e.target.value as PurchaseResearch['priority'],
                      })
                    }
                    options={priorityOptions}
                    placeholder="Priority"
                  />
                  <Select
                    value={newPurchase.status}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        status: e.target.value as PurchaseResearch['status'],
                      })
                    }
                    options={statusOptions}
                    placeholder="Status"
                  />
                </div>
                <TextArea
                  placeholder="Notes or links (optional)"
                  value={newPurchase.notes}
                  onChange={(e) =>
                    setNewPurchase({ ...newPurchase, notes: e.target.value })
                  }
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAdd} size="sm">
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAdding(false)
                      setNewPurchase({
                        item_name: '',
                        category: 'purchase',
                        priority: 'medium',
                        status: 'researching',
                        notes: '',
                      })
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {purchases.length === 0 && !isAdding && (
            <p className="text-center text-[var(--muted-foreground)] py-8">
              No items added yet. Click "Add Item" to get started.
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

