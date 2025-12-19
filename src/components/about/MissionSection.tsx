import { Cog, Package, Wrench, TrendingUp } from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Комплексное снабжение",
    description:
      "Организуем поставки материалов, комплектующих и оборудования для бесперебойной работы вашего предприятия.",
  },
  {
    icon: Cog,
    title: "Производство под заказ",
    description: "Изготавливаем изделия по индивидуальным чертежам и техническим требованиям заказчика.",
  },
  {
    icon: Wrench,
    title: "Подбор решений",
    description: "Подбираем оптимальные решения под конкретные задачи и потребности вашего бизнеса.",
  },
  {
    icon: TrendingUp,
    title: "Долгосрочное партнёрство",
    description:
      "Выстраиваем долгосрочные деловые отношения, постоянно совершенствуя уровень сервиса.",
  },
];

const MissionSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-section-gradient">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Наша миссия
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Закрываем ключевые потребности бизнеса в одном месте
          </h2>
          <p className="text-lg text-muted-foreground">
            Мы специализируемся на комплексном снабжении предприятий, производстве изделий под заказ и поставке
            промышленной продукции для различных отраслей.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group p-6 rounded-2xl bg-card-gradient border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;


