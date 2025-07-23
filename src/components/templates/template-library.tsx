// src/components/templates/template-library.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  previewImage: string;
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function TemplateLibrary() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    fetchTemplates();
  }, [categoryFilter]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/templates", window.location.origin);
      if (categoryFilter && categoryFilter !== "all") {
        url.searchParams.set("category", categoryFilter);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-muted" />
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-9 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Error loading templates: {error}
        </p>
        <Button onClick={fetchTemplates} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          No templates found for the selected category.
        </p>
        <Button asChild variant="outline">
          <Link href="/templates">View All Templates</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="overflow-hidden hover:shadow-lg transition-shadow group"
        >
          {/* Preview Image */}
          <div className="relative aspect-[4/3] bg-muted overflow-hidden">
            {template.previewImage ? (
              <Image
                src={template.previewImage}
                alt={template.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-primary/40" />
              </div>
            )}

            {/* Premium Badge */}
            {template.isPremium && (
              <div className="absolute top-3 right-3">
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/90 text-yellow-900 border-0"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="outline" className="bg-white/90 border-white/20">
                {template.category}
              </Badge>
            </div>

            {/* Hover Preview Button */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button asChild size="sm" variant="secondary">
                <Link href={`/templates/${template.id}/preview`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
            </div>
          </div>

          {/* Content */}
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg leading-tight">
                  {template.name}
                </CardTitle>
                <CardDescription className="mt-1 text-sm">
                  {template.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href={`/templates/${template.id}/preview`}>
                  Use Template
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/templates/${template.id}/preview`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
