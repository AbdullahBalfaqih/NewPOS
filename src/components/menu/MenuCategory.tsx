
"use client";
import type { Category as CategoryType, MenuItem as MenuItemType } from '@/lib/types';
import { MenuItemCard } from './MenuItemCard';
import { useLocale } from '@/contexts/LocaleContext';

interface MenuCategoryProps {
  category: CategoryType;
  items: MenuItemType[];
}

export function MenuCategory({ category, items }: MenuCategoryProps) {
  const { direction } = useLocale();
  if (items.length === 0) {
    return null;
  }

  return (
    <section id={category.id} className="mb-12 scroll-mt-20">
      <h2 className={`font-headline text-3xl font-semibold text-primary mb-6 pb-2 border-b-2 border-primary/30 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
        {category.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
