// src/components/templates/template-selector.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Eye,
  Check,
  Calendar,
  Megaphone,
  Briefcase,
  Mail,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  previewImage: string;
  isPremium: boolean;
}

interface TemplateSelectorProps {
  flyerId?: string;
  suggestedCategory?: string;
  onTemplateSelect?: (templateId: string) => void;
}

const categoryIcons = {
  Event: Calendar,
  Promo: Megaphone,
  Job: Briefcase,
  Newsletter: Mail,
};

export function TemplateSelector({
  flyerId,
  suggestedCategory,
  onTemplateSelect,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(
    suggestedCategory || "Event"
  );
  const router = useRouter();

  useEffect(() => {
    fetchTemplates();
  }, [activeCategory]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/templates", window.location.origin);
      if (activeCategory !== "all") {
        url.searchParams.set("category", activeCategory);
      }

      const response = await fetch(url.toString());
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    }
  };

  const handlePreview = (templateId: string) => {
    const params = new URLSearchParams();
    if (flyerId) {
      params.set("flyerId", flyerId);
    }

    const url = `/templates/${templateId}/preview${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(url);
  };

  const categories = ["Event", "Promo", "Job", "Newsletter"];

  const filteredTemplates = templates.filter(
    (t) => activeCategory === "all" || t.category === activeCategory
  );

  const suggestedTemplates = suggestedCategory
    ? templates.filter((t) => t.category === suggestedCategory).slice(0, 3)
    : [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select a Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Select a Template
          {suggestedCategory && (
            <Badge variant="secondary" className="ml-2">
              {suggestedCategory} suggested
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Suggested Templates */}
        {suggestedTemplates.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              Suggested for your content
            </h4>
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              {suggestedTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={handleTemplateSelect}
                  onPreview={handlePreview}
                  size="small"
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {categories.map((category) => {
              const Icon =
                categoryIcons[category as keyof typeof categoryIcons];
              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    onSelect={handleTemplateSelect}
                    onPreview={handlePreview}
                  />
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No templates available in this category
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
  onPreview: (templateId: string) => void;
  size?: "normal" | "small";
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
  onPreview,
  size = "normal",
}: TemplateCardProps) {
  const aspectRatio = size === "small" ? "aspect-[4/3]" : "aspect-[3/4]";

  return (
    <div
      className={`group relative ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer">
        {/* Preview Image */}
        <div className={`${aspectRatio} bg-muted overflow-hidden relative`}>
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary/40" />
          </div>

          {/* Premium Badge */}
          {template.isPremium && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="bg-yellow-500/90 text-yellow-900 border-0"
              >
                <Crown className="h-3 w-3 mr-1" />
                Pro
              </Badge>
            </div>
          )}

          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-2 left-2">
              <div className="bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(template.id);
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
              {!isSelected && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(template.id);
                  }}
                >
                  Select
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Template Info */}
        <div className="p-3" onClick={() => onSelect(template.id)}>
          <h4 className="font-semibold text-sm mb-1 truncate">
            {template.name}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {template.description}/
          </p>
        </div>

        {/* Quick Actions */}
        <div className="p-3 pt-0 flex gap-2">
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            className="flex-1"
            onClick={() => onSelect(template.id)}
          >
            {isSelected ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Selected
              </>
            ) : (
              "Select"
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPreview(template.id)}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
