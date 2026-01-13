import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface TopBarProps {
  onCallbackClick: () => void;
}

const TopBar = ({ onCallbackClick }: TopBarProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white hidden lg:block border-b">
      <div className="p-2 px-[5vw]">
        <div className="flex items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-3">
            <img src="/faviconFull.ico" alt="SUPRA TRADE" className="w-32 h-14" />
            <div className="leading-tight">
              <div className="text-lg font-bold text-foreground">{t("topbar.tagline1")}</div>
              <div className="text-sm text-muted-foreground uppercase">{t("topbar.tagline2")}</div>
            </div>
          </a>

          <div className="flex items-center gap-10 text-sm">
            <div className="text-right">
              <div className="text-muted-foreground">{t("topbar.sales")}</div>
              <a href="tel:+77083767189" className="font-semibold text-foreground hover:text-primary transition-colors">
                {t("topbar.phone")}
              </a>
              <div>
                <a href="mailto:sales@supratrade.kz" className="text-primary hover:underline">
                  {t("topbar.email")}
                </a>
              </div>
            </div>
            <Button variant="callback" onClick={onCallbackClick} className="whitespace-nowrap">
              {t("topbar.orderCallback")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
