import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-6">
              <div className="w-15 h-10  rounded-lg flex items-center justify-center">
              <img src="/favicon.ico" alt="SUPRA TRADE" className="w-15 h-10 rounded-lg" />
              </div>
              <div>
                <span className="text-primary font-bold text-xl">SUPRA</span>
                <span className="text-primary-foreground font-bold text-xl ml-1">TRADE</span>
              </div>
            </a>
            <p className="text-primary-foreground/70 mb-6">
              Надёжный поставщик металлопроката, химических реактивов, 
              медицинского и промышленного оборудования
            </p>
          </div>

          {/* Каталог */}
          <div>
            <h3 className="font-bold text-lg mb-6">Каталог</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  Металлопрокат
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  Медицинское оборудование
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  Промышленное оборудование
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  Химические реактивы
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  Сварочное оборудование
                </a>
              </li>
            </ul>
          </div>

          {/* О компании */}
          <div>
            <h3 className="font-bold text-lg mb-6">О компании</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  О нас
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  Услуги
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  Вакансии
                </a>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="font-bold text-lg mb-6">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/70">
                г. Кокшетау, ул.Магзи Абулкасымова, 115
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a href="tel:+77006801500" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  +7 700 680 15 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <a href="mailto:sales@supratrade.kz " className="text-primary-foreground/70 hover:text-primary transition-colors">
                  sales@supratrade.kz 
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/70">
                  Пн-Пт: 9:00 - 18:00<br />
                  Сб: 10:00 - 15:00
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
            <p>© {currentYear} SUPRA TRADE. Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
