
import { WishlistItem, WishlistStatus } from '@/types'
import { WishlistItemCard } from './wishlist-item'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, ShoppingBag } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface WishlistGridProps {
  items: WishlistItem[]
  loading?: boolean
  onDelete: (id: string) => void
  onEdit: (item: WishlistItem) => void
  onStatusChange: (id: string, status: WishlistStatus) => void
}

export function WishlistGrid({ items, loading, onDelete, onEdit, onStatusChange }: WishlistGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'wanted' | 'purchased' | 'all'>('wanted')

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const isPurchased = item.status === 'purchased'
      const matchesTab = activeTab === 'all' ||
        (activeTab === 'wanted' && !isPurchased) ||
        (activeTab === 'purchased' && isPurchased)

      return matchesSearch && matchesTab
    })
  }, [items, searchQuery, activeTab])

  const totalPrice = useMemo(() => {
    return filteredItems.reduce((acc, item) => acc + (item.price || 0), 0)
  }, [filteredItems])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
            <TabsTrigger value="wanted">Wanted</TabsTrigger>
            <TabsTrigger value="purchased">Got It</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg border border-primary/20 text-primary whitespace-nowrap">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-bold">${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl border-muted">
          <h3 className="text-lg font-medium text-foreground">Nothing on your wishlist</h3>
          <p className="text-sm max-w-xs mx-auto mt-1">
            &quot;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&quot;
            <br />
            <span className="opacity-50">— but sometimes we just want cool stuff.</span>
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <WishlistItemCard
              key={item.id}
              item={item}
              onDelete={onDelete}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
