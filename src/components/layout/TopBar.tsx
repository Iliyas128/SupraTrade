import { Mail, Phone, MapPin } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-primary text-primary-foreground py-2 text-sm hidden md:block">
      <div className="container-custom flex justify-between items-center">
        <p className="text-primary-foreground/90">
          Организуем всесторонние поставки техники и материалов в одном удобном сервисе
        </p>
        <div className="flex items-center gap-6">
          <a 
            href="mailto:sales@supratrade.kz" 
            className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors"
          >
            <Mail size={14} />
            <span>sales@supratrade.kz</span>
          </a>
          <a 
            href="tel:" 
            className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors font-semibold"
          >
            <Phone size={14} />
            <span>Единый номер</span>
          </a>
          <span className="flex items-center gap-2 text-primary-foreground/80">
            <MapPin size={14} />
            <span>Кокшетау, ул. М. Абулкасымова 115</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
