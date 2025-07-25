import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TemplatePreview } from "@/components/templates/template-preview";
import { TemplateEditor } from "@/components/templates/template-editor";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    flyerId?: string;
  }>;
}

async function getTemplate(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/templates/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching template:", error);
    return null;
  }
}

async function getFlyerData(flyerId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/flyers/${flyerId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching flyer:", error);
    return null;
  }
}

function PreviewSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Editor Skeleton */}
      <div className="space-y-6">
        <Card className="p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Preview Skeleton */}
      <div className="space-y-6">
        <Card className="p-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="aspect-[3/4] bg-muted rounded-lg" />
        </Card>
      </div>
    </div>
  );
}

export default async function TemplatePreviewPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { flyerId } = await searchParams;

  const [template, flyerData] = await Promise.all([
    getTemplate(id),
    flyerId ? getFlyerData(flyerId) : null,
  ]);

  if (!template) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{template.name}</h1>
          <p className="text-muted-foreground">{template.description}</p>
        </div>

        {/* Preview & Editor */}
        <Suspense fallback={<PreviewSkeleton />}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Template Editor */}
            <div className="order-2 lg:order-1">
              <TemplateEditor template={template} flyerData={flyerData} />
            </div>

            {/* Template Preview */}
            <div className="order-1 lg:order-2">
              <TemplatePreview template={template} flyerData={flyerData} templateId={id}/>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}