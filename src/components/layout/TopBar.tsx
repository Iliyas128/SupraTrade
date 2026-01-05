import { Button } from "@/components/ui/button";

interface TopBarProps {
  onCallbackClick: () => void;
}

const TopBar = ({ onCallbackClick }: TopBarProps) => {
  return (
    <div className="bg-white hidden lg:block border-b">
      <div className="p-2 px-[5vw]">
        <div className="flex items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-3">
            <img src="/faviconFull.ico" alt="SUPRA TRADE" className="w-32 h-14" />
            <div className="leading-tight">
              <div className="text-lg font-bold text-foreground">Комплексные решения</div>
              <div className="text-sm text-muted-foreground uppercase">снабжения и производства</div>
            </div>
          </a>

          <div className="flex items-center gap-10 text-sm">
            <div className="text-right">
              <div className="text-muted-foreground">Отдел продаж:</div>
              <a href="tel:+77083767189" className="font-semibold text-foreground hover:text-primary transition-colors">
                +7 708 376 71 89
              </a>
              <div>
                <a href="mailto:sales@supratrade.kz" className="text-primary hover:underline">
                  sales@supratrade.kz
                </a>
              </div>
            </div>
            <Button variant="callback" onClick={onCallbackClick} className="whitespace-nowrap">
              Заказать звонок
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
