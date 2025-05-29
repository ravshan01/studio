"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";
import type { Language as LangType } from "@/types";
import { LANGUAGES } from "@/lib/constants";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
       <Globe className="h-5 w-5 text-muted-foreground" />
      <Select value={language} onValueChange={(value) => setLanguage(value as LangType)}>
        <SelectTrigger className="w-auto min-w-[120px] border-0 shadow-none focus:ring-0 focus:ring-offset-0" aria-label={t("language", "Language")}>
          <SelectValue placeholder={t("language", "Language")} />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
