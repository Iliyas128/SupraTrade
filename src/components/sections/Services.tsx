import { ArrowRight, Wrench, Settings, Package } from "lucide-react";

const services = [
  {
    id: 1,
    icon: Wrench,
    title: "Изготовление деталей из металла на заказ",
    description: "Производство металлических деталей любой сложности по вашим чертежам",
    href: "#service-1",
  },
  {
    id: 2,
    icon: Settings,
    title: "Профессиональная металлообработка",
    description: "Резка, гибка, сварка и другие виды обработки металла",
    href: "#service-2",
  },
  {
    id: 3,
    icon: Package,
    title: "Комплексная поставка",
    description: "Полный цикл снабжения вашего производства необходимыми материалами",
    href: "#service-3",
  },
];

const Services = () => {
  return (
    <section id="services" className="section-padding bg-section-alt">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Наши <span className="text-primary">услуги</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Комплексные решения для вашего бизнеса
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <a
              key={service.id}
              href={service.href}
              className="group bg-card rounded-xl p-8 card-hover border border-border"
            >
              <div className="w-16 h-16 mb-6 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                <service.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {service.description}
              </p>
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span>перейти</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
