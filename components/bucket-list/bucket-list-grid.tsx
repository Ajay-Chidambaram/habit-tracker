
import { BucketListItem } from '@/types'
import { BucketItem } from './bucket-item'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusCircle, Search } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface BucketListGridProps {
  items: BucketListItem[]
  loading?: boolean
  onToggle: (id: string, isCompleted: boolean) => void
  onDelete: (id: string) => void
  onEdit: (item: BucketListItem) => void
}

export function BucketListGrid({ items, loading, onToggle, onDelete, onEdit }: BucketListGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active')

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTab = activeTab === 'all' ||
        (activeTab === 'active' && !item.is_completed) ||
        (activeTab === 'completed' && item.is_completed)

      return matchesSearch && matchesTab
    })
  }, [items, searchQuery, activeTab])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Done</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search adventures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl border-muted">
          <div className="bg-bg-elevated p-4 rounded-full mb-3">
            <PlusCircle className="h-8 w-8 opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No matches found</h3>
          <p className="text-sm max-w-xs mx-auto mt-1">
            {searchQuery ? "Try refining your search terms." : "Time to add something to your bucket list!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <BucketItem
              key={item.id}
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
