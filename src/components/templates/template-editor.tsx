// src/components/templates/template-editor.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  RotateCcw,
  Palette,
  Type,
  Link,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";

interface TemplateEditorProps {
  template: {
    id: string;
    name: string;
    category: string;
    htmlContent: string;
    cssContent: string;
  };
  flyerData?: {
    id: string;
    extractedData: any;
    editableFields?: any;
  } | null;
}

interface EditableFields {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  buttonText: string;
  buttonUrl: string;
}

export function TemplateEditor({ template, flyerData }: TemplateEditorProps) {
  const [fields, setFields] = useState<EditableFields>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    buttonText: "Learn More",
    buttonUrl: "#",
  });

  const [originalFields, setOriginalFields] = useState<EditableFields>(fields);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (flyerData?.extractedData) {
      const extractedData = flyerData.extractedData;
      const editableFields = flyerData.editableFields || {};

      const initialFields: EditableFields = {
        title: editableFields.title || extractedData.title || "",
        description:
          editableFields.description || extractedData.description || "",
        date: editableFields.date || extractedData.date || "",
        time: editableFields.time || extractedData.time || "",
        location: editableFields.location || extractedData.location || "",
        address: editableFields.address || extractedData.address || "",
        phone: editableFields.phone || extractedData.phone || "",
        email: editableFields.email || extractedData.email || "",
        website: editableFields.website || extractedData.website || "",
        buttonText: editableFields.buttonText || "Learn More",
        buttonUrl: editableFields.buttonUrl || extractedData.website || "#",
      };

      setFields(initialFields);
      setOriginalFields(initialFields);
    } else {
      // Set sample data for preview
      const sampleFields: EditableFields = {
        title: "Sample Event Title",
        description: "This is a sample description of your event or promotion.",
        date: "December 25, 2024",
        time: "7:00 PM",
        location: "Community Center",
        address: "123 Main Street, City, State",
        phone: "(555) 123-4567",
        email: "info@example.com",
        website: "www.example.com",
        buttonText: "Get Tickets",
        buttonUrl: "#",
      };

      setFields(sampleFields);
      setOriginalFields(sampleFields);
    }
  }, [flyerData]);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(fields) !== JSON.stringify(originalFields);
    setHasChanges(hasChanged);
  }, [fields, originalFields]);

  const handleFieldChange = (field: keyof EditableFields, value: string) => {
    setFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!flyerData) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/flyers/${flyerData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editableFields: fields,
          templateId: template.id,
        }),
      });

      if (response.ok) {
        setOriginalFields(fields);
        setHasChanges(false);
        // Show success message
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFields(originalFields);
    setHasChanges(false);
  };

  const fieldGroups = [
    {
      id: "content",
      label: "Content",
      icon: FileText,
      fields: [
        {
          key: "title" as keyof EditableFields,
          label: "Title",
          type: "input",
          icon: Type,
        },
        {
          key: "description" as keyof EditableFields,
          label: "Description",
          type: "textarea",
          icon: FileText,
        },
        {
          key: "buttonText" as keyof EditableFields,
          label: "Button Text",
          type: "input",
          icon: Type,
        },
        {
          key: "buttonUrl" as keyof EditableFields,
          label: "Button URL",
          type: "input",
          icon: Link,
        },
      ],
    },
    {
      id: "datetime",
      label: "Date & Time",
      icon: Calendar,
      fields: [
        {
          key: "date" as keyof EditableFields,
          label: "Date",
          type: "input",
          icon: Calendar,
        },
        {
          key: "time" as keyof EditableFields,
          label: "Time",
          type: "input",
          icon: Clock,
        },
      ],
    },
    {
      id: "location",
      label: "Location",
      icon: MapPin,
      fields: [
        {
          key: "location" as keyof EditableFields,
          label: "Location Name",
          type: "input",
          icon: MapPin,
        },
        {
          key: "address" as keyof EditableFields,
          label: "Address",
          type: "input",
          icon: MapPin,
        },
      ],
    },
    {
      id: "contact",
      label: "Contact",
      icon: Phone,
      fields: [
        {
          key: "phone" as keyof EditableFields,
          label: "Phone",
          type: "input",
          icon: Phone,
        },
        {
          key: "email" as keyof EditableFields,
          label: "Email",
          type: "input",
          icon: Mail,
        },
        {
          key: "website" as keyof EditableFields,
          label: "Website",
          type: "input",
          icon: Link,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Edit Template
            </CardTitle>
            <Badge variant="outline">{template.category}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Editor Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="content" className="w-full">
            <div className="border-b px-6 pt-6">
              <TabsList className="grid w-full grid-cols-4">
                {fieldGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <TabsTrigger
                      key={group.id}
                      value={group.id}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{group.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {fieldGroups.map((group) => (
              <TabsContent
                key={group.id}
                value={group.id}
                className="p-6 space-y-4"
              >
                <div className="space-y-4">
                  {group.fields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.key} className="space-y-2">
                        <Label
                          htmlFor={field.key}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {field.label}
                        </Label>
                        {field.type === "textarea" ? (
                          <Textarea
                            id={field.key}
                            value={fields[field.key]}
                            onChange={(e) =>
                              handleFieldChange(field.key, e.target.value)
                            }
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            rows={3}
                          />
                        ) : (
                          <Input
                            id={field.key}
                            value={fields[field.key]}
                            onChange={(e) =>
                              handleFieldChange(field.key, e.target.value)
                            }
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            type={
                              field.key === "email"
                                ? "email"
                                : field.key === "website" ||
                                  field.key === "buttonUrl"
                                ? "url"
                                : "text"
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving || !flyerData}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {!flyerData && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              Upload a flyer to enable editing and saving
            </p>
          )}

          {hasChanges && flyerData && (
            <p className="text-sm text-orange-600 mt-3 text-center">
              You have unsaved changes
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
