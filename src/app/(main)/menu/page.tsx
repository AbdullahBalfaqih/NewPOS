
"use client";
import { menuItems as allMenuItems, categories as allCategories } from '@/lib/mockData';
import type { MenuItem, Category } from '@/lib/types';
import { MenuCategory } from '@/components/menu/MenuCategory';
import { CartSidebar } from '@/components/menu/CartSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useLocale } from '@/contexts/LocaleContext';
import { useEffect, useState } from 'react';

// export const metadata = { // Metadata should be handled by RootLayout for dynamic titles
//   title: 'قائمة الطعام - مطعم POS أونلاين',
//   description: 'تصفح قائمة طعامنا اللذيذة واطلب الآن.',
// };

async function getMenuDataServer() {
    try {
        // استدعاء نقطة النهاية الصحيحة
        const menuRes = await fetch('/api/menuItems');

        if (!menuRes.ok) {
            const errorText = await menuRes.text();
            throw new Error(`Failed to fetch data: ${menuRes.status} ${menuRes.statusText} - ${errorText}`);
        }

        const categoriesWithItems = await menuRes.json();

        // بناء مصفوفة الفئات
        const categoriesData = categoriesWithItems.map((cat: any) => ({
            id: cat.id,
            name: cat.name
        }));

        // بناء مصفوفة العناصر مع ربط كل عنصر بفئة
        const menuItemsData = categoriesWithItems.flatMap((cat: any) =>
            cat.items.map((item: any) => ({
                ...item,
                categoryId: cat.id
            }))
        );

        return { menuItemsData, categoriesData };
    } catch (error) {
        console.error('Error fetching menu data:', error);
        return { menuItemsData: [], categoriesData: [] };
    }
}



export default function MenuPage() {
  const { translate, translateData, locale } = useLocale();
  const [menuItemsData, setMenuItemsData] = useState<MenuItem[]>([]);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const { menuItemsData: rawMenuItems, categoriesData: rawCategories } = await getMenuDataServer();

            setMenuItemsData(rawMenuItems.map((item: MenuItem) => translateData(item) as MenuItem));
            setCategoriesData(rawCategories.map((cat: Category) => translateData(cat) as Category));


            setIsLoading(false);
        }
        loadData();
    }, [locale, translateData]);




  if (isLoading) {
     return (
        <div className="text-center py-10">
            <h1 className="font-headline text-3xl text-primary mb-4">{translate("جاري تحميل القائمة...", "Loading Menu...")}</h1>
        </div>
     );
  }


  return (
    <div className="relative">
      <h1 className="font-headline text-4xl font-bold text-primary mb-8 text-center">
        {translate("قائمة الطعام لدينا", "Our Menu")}
      </h1>
      
      <Tabs defaultValue={categoriesData[0]?.id || 'all'} className="w-full">
        <div className="flex justify-center mb-8">
          <ScrollArea className="max-w-full whitespace-nowrap">
            <TabsList className="inline-flex h-auto p-1 bg-muted rounded-lg">
                <TabsTrigger value="all" className="font-body px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
                  {translate("الكل", "All")}
                </TabsTrigger>
              {categoriesData.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="font-body px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <TabsContent value="all">
           {categoriesData.map((category) => {
            const itemsForCategory = menuItemsData.filter(
              (item) => item.categoryId === category.id
            );
            return (
              <MenuCategory
                key={category.id}
                category={category}
                items={itemsForCategory}
              />
            );
          })}
        </TabsContent>

        {categoriesData.map((category) => {
          const itemsForCategory = menuItemsData.filter(
            (item) => item.categoryId === category.id
          );
          return (
            <TabsContent key={category.id} value={category.id}>
              <MenuCategory category={category} items={itemsForCategory} />
            </TabsContent>
          );
        })}
      </Tabs>
      
      <CartSidebar />
    </div>
  );
}
