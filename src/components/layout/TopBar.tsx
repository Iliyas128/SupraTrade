import { Button } from "@/components/ui/button";

interface TopBarProps {
  onCallbackClick: () => void;
}

const TopBar = ({ onCallbackClick }: TopBarProps) => {
  return (
    <div className="bg-white hidden lg:block border-b">
      <div className="container-custom p-4">
        <div className="flex items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-3">
            <img src="/favicon.ico" alt="SUPRA TRADE" className="w-20 h-10 rounded-lg" />
            <div className="leading-tight">
              <div className="text-xl font-bold text-foreground">SUPRA TRADE</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Industrial Solutions</div>
            </div>
          </a>

          <div className="flex items-center gap-10 text-sm">
            <div className="text-right">
              <div className="text-muted-foreground">Основной:</div>
              <a href="tel:+77006801500" className="font-semibold text-foreground hover:text-primary transition-colors">
                +7 700 680 15 00
              </a>
              <div>
                <a href="mailto:info@supratrade.kz" className="text-primary hover:underline">
                  info@supratrade.kz
                </a>
              </div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">Отдел продаж:</div>
              <a href="tel:+77006801501" className="font-semibold text-foreground hover:text-primary transition-colors">
                +7 700 680 15 01
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
