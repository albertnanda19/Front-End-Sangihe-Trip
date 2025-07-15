"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

interface Props {
  filters: string[];
}

const SearchDestination: React.FC<Props> = ({ filters }) => {
  if (!filters || filters.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Cari destinasi wisata..."
              className="pl-12 py-4 text-lg border-2 border-sky-200 focus:border-sky-500 rounded-xl"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 justify-center">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={filter.toLowerCase() === "semua" ? "default" : "outline"}
                className={
                  filter.toLowerCase() === "semua"
                    ? "bg-sky-500 hover:bg-sky-600"
                    : "border-sky-200 text-slate-600 hover:bg-sky-50"
                }
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchDestination;