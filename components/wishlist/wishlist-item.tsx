
import { WishlistItem, WishlistStatus } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MoreVertical, Trash2, Edit2, ExternalLink, ShoppingCart, Tag } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown'
import { Button } from '@/components/ui/button'

interface WishlistItemProps {
  item: WishlistItem
  onDelete: (id: string) => void
  onEdit: (item: WishlistItem) => void
  onStatusChange: (id: string, status: WishlistStatus) => void
}

export function WishlistItemCard({ item, onDelete, onEdit, onStatusChange }: WishlistItemProps) {
  const isPurchased = item.status === 'purchased'

  return (
    <Card className={cn(
      "group relative flex flex-col p-4 transition-all hover:shadow-md",
      isPurchased && "opacity-60"
    )}>
      <div className="flex justify-between items-start gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] uppercase h-5 font-bold">
              {item.category}
            </Badge>
            <div className="flex items-center">
              {[...Array(3)].map((_, i) => (
                <Tag
                  key={i}
                  className={cn(
                    "w-2.5 h-2.5 ml-0.5",
                    i < (item.priority || 1) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
          <h3 className={cn(
            "font-bold text-lg leading-tight line-clamp-1",
            isPurchased && "line-through text-muted-foreground"
          )}>
            {item.name}
          </h3>
          {item.price && (
            <p className="text-sm font-semibold text-primary mt-0.5">
              ${item.price.toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex gap-1">
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isPurchased ? (
                <DropdownMenuItem onClick={() => onStatusChange(item.id, 'purchased')}>
                  <ShoppingCart className="w-4 h-4 mr-2" /> Mark as Purchased
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onStatusChange(item.id, 'decided')}>
                  <ShoppingCart className="w-4 h-4 mr-2" /> Mark as Wanted
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(item.id)}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {item.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
          {item.description}
        </p>
      )}

      {isPurchased && (
        <div className="mt-auto pt-2 border-t border-border/50 text-center">
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] py-0 h-5">
            PURCHASED
          </Badge>
        </div>
      )}
    </Card>
  )
}
