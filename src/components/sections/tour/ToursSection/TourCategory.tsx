"use client";
import React from "react";
import { categories } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface TourCategoryProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function TourCategory({
  selectedCategory,
  onSelectCategory,
}: TourCategoryProps) {
  return (
    <Card className="border-t">
      <CardContent className="py-4">
        <h3 className="mb-4 text-lg font-bold">Danh mục</h3>
        <ScrollArea className="">
          <div className="flex flex-col gap-y-4">
            {categories.map((category) => (
              <div className="space-x-2" key={category.id}>
                <Checkbox
                  className="data-[state=checked]:bg-core"
                  id={category.id}
                  checked={selectedCategory === category.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(category.id);
                  }}
                />
                <Label htmlFor={category.id} className="text-base">
                  {" "}
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
