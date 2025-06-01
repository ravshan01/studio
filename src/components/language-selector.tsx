
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import type { Language as LangType } from "@/types";
import { LANGUAGES } from "@/lib/constants";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as LangType)}>
      <SelectTrigger asChild className="w-10 p-0">
        <Button variant="ghost" size="icon" aria-label={t("language", "Language")}>
          <Globe className="h-5 w-5" />
        </Button>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

