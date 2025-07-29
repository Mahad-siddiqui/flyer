// // src/components/templates/template-filters.tsx
// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Calendar,
//   Megaphone,
//   Briefcase,
//   Mail,
//   Grid3X3,
//   Crown,
// } from "lucide-react";
// import { useState, useEffect } from "react";

// const categories = [
//   { id: "all", label: "All Templates", icon: Grid3X3, count: 0 },
//   { id: "Event", label: "Events", icon: Calendar, count: 0 },
//   { id: "Promo", label: "Promotions", icon: Megaphone, count: 0 },
//   { id: "Job", label: "Job Postings", icon: Briefcase, count: 0 },
//   { id: "Newsletter", label: "Newsletters", icon: Mail, count: 0 },
// ];

// export function TemplateFilters({ templates }: { templates: any }) {
//   const [data, setData] = useState({});

//   useEffect(() => {
//     if (!templates) return;
//     setData(templates);
//   }, [templates]);

//   console.log("props data", data);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const currentCategory = searchParams.get("category") || "all";

//   const handleCategoryChange = (categoryId: string) => {
//     const params = new URLSearchParams(searchParams.toString());

//     if (categoryId === "all") {
//       setData(templates);
//       params.delete("category");
//     } else {
//       params.set("category", categoryId);
//     }

//     const queryString = params.toString();
//     const url = queryString ? `/templates?${queryString}` : "/templates";
//     router.push(url);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Category Filters */}
//       <Card className="p-6">
//         <div className="flex flex-col space-y-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold">Categories</h3>
//             <Badge variant="outline" className="text-xs">
//               <Crown className="h-3 w-3 mr-1" />
//               Premium Available
//             </Badge>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {categories.map((category) => {
//               const Icon = category.icon;
//               const isActive = currentCategory === category.id;

//               return (
//                 <Button
//                   key={category.id}
//                   variant={isActive ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => handleCategoryChange(category.id)}
//                   className="flex items-center gap-2"
//                 >
//                   <Icon className="h-4 w-4" />
//                   {category.label}
//                   {category.count > 0 && (
//                     <Badge variant="secondary" className="ml-1 text-xs">
//                       {category.count}
//                     </Badge>
//                   )}
//                 </Button>
//               );
//             })}
//           </div>
//         </div>
//       </Card>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Card className="p-4 text-center">
//           <div className="text-2xl font-bold text-primary">
//             {data.stats?.total}
//           </div>
//           <div className="text-sm text-muted-foreground">Total Templates</div>
//         </Card>
//         <Card className="p-4 text-center">
//           <div className="text-2xl font-bold text-green-600">
//             {data.stats?.free}
//           </div>
//           <div className="text-sm text-muted-foreground">Free Templates</div>
//         </Card>
//         <Card className="p-4 text-center">
//           <div className="text-2xl font-bold text-yellow-600">
//             {data.stats?.premium}
//           </div>
//           <div className="text-sm text-muted-foreground">Premium Templates</div>
//         </Card>
//         <Card className="p-4 text-center">
//           <div className="text-2xl font-bold text-blue-600">
//             {Object.keys(data.stats?.categories || {}).length}
//           </div>
//           <div className="text-sm text-muted-foreground">Categories</div>
//         </Card>
//       </div>
//     </div>
//   );
// }
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Megaphone,
  Briefcase,
  Mail,
  Grid3X3,
  Crown,
} from "lucide-react";
import { useState, useEffect } from "react";

interface stats {
  free: number;
  premium: number;
  categories: {
    [key: string]: number;
  };
}


interface TemplateFilterProps {
  stats: stats;
}

export default function TemplateFilter({ stats }: TemplateFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>
}

const baseCategories = [
  { id: "all", label: "All Templates", icon: Grid3X3 },
  { id: "Event", label: "Events", icon: Calendar },
  { id: "Promo", label: "Promotions", icon: Megaphone },
  { id: "Job", label: "Job Postings", icon: Briefcase },
  { id: "Newsletter", label: "Newsletters", icon: Mail },
];

export function TemplateFilters({ templates }: { templates: any }) {
  const [data, setData] = useState({});
  const [categories, setCategories] = useState(
    baseCategories.map((cat) => ({ ...cat, count: 0 }))
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  useEffect(() => {
    if (!templates) return;

    setData(templates);

    const categoryStats = templates?.stats?.categories || {};
    const totalCount = templates?.stats?.total || 0;

    const updated = baseCategories.map((cat) => {
      if (cat.id === "all") {
        return { ...cat, count: totalCount };
      } else {
        return { ...cat, count: categoryStats[cat.id] || 0 };
      }
    });

    setCategories(updated);
  }, [templates]);

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId === "all") {
      setData(templates);
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }

    const queryString = params.toString();
    const url = queryString ? `/templates?${queryString}` : "/templates";
    router.push(url);
  };

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <Card className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Categories</h3>
            <Badge variant="outline" className="text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Premium Available
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = currentCategory === category.id;

              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                  {category.count > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {category.count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {data.stats?.total}
          </div>
          <div className="text-sm text-muted-foreground">Total Templates</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.stats?.free}
          </div>
          <div className="text-sm text-muted-foreground">Free Templates</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {data.stats?.premium}
          </div>
          <div className="text-sm text-muted-foreground">
            Premium Templates
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Object.keys(data.stats?.categories || {}).length}
          </div>
          <div className="text-sm text-muted-foreground">Categories</div>
        </Card>
      </div>
    </div>
  );
}
