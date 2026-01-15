import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

// SVG-флаги кладите в /public/flags/{code}.svg; эмодзи — фолбек
const languages = [
  { code: "en", name: "English", flagEmoji: "🇺🇸", flagSrc: "/flags/en.svg" },
  { code: "ru", name: "Русский", flagEmoji: "🇷🇺", flagSrc: "/flags/ru.svg" },
  { code: "zh", name: "中文", flagEmoji: "🇨🇳", flagSrc: "/flags/zh.svg" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lng);
      document.documentElement.lang = lng;
    }
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const renderFlag = (lang: (typeof languages)[number]) => (
    <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded">
      {lang.flagSrc ? (
        <img
          src={lang.flagSrc}
          alt={`${lang.code} flag`}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = "block";
          }}
        />
      ) : null}
      <span className={lang.flagSrc ? "hidden text-lg leading-none" : "text-lg leading-none"}>
        {lang.flagEmoji}
      </span>
    </span>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 px-2 sm:px-3"
          aria-label="Change language"
        >
          {renderFlag(currentLanguage)}
          <span className="hidden sm:inline">{currentLanguage.name}</span>
          <Globe className="hidden h-4 w-4 sm:inline" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 sm:w-64 p-1">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center gap-2 py-2 ${i18n.language === lang.code ? "bg-accent" : ""}`}
          >
            {renderFlag(lang)}
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
