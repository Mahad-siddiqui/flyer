// src/app/templates/page.tsx
import { Suspense } from "react";
import { TemplateLibrary } from "@/components/templates/template-library";
import { TemplateFilters } from "@/components/templates/template-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function TemplateLibrarySkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-[4/3] bg-muted">
            <Skeleton className="w-full h-full" />
          </div>
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Template Library</h1>
          <p className="text-muted-foreground">
            Choose from our collection of professionally designed templates for
            your flyers
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Suspense
            fallback={
              <div className="h-16 bg-muted rounded-lg animate-pulse" />
            }
          >
            <TemplateFilters />
          </Suspense>
        </div>

        {/* Templates Grid */}
        <Suspense fallback={<TemplateLibrarySkeleton />}>
          <TemplateLibrary />
        </Suspense>
      </div>
    </div>
  );
}
