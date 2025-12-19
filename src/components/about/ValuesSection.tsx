import { CheckCircle2, Clock, Award, Users } from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Качество",
    description:
      "Сотрудничаем с проверенными поставщиками и производственными партнёрами, гарантируя стабильные характеристики продукции.",
  },
  {
    icon: Clock,
    title: "Соблюдение сроков",
    description:
      "Обеспечиваем бесперебойность поставок и точное соблюдение согласованных сроков выполнения заказов.",
  },
  {
    icon: CheckCircle2,
    title: "Надёжность",
    description: "Работаем только с надёжными производителями и поставщиками промышленной продукции.",
  },
  {
    icon: Users,
    title: "Партнёрство",
    description: "Ценим каждого партнёра и выстраиваем долгосрочные деловые отношения.",
  },
];

const ValuesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Наши ценности
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Акцент на качестве, надёжности и соблюдении сроков
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Предлагаем удобные условия комплектации, оплаты и доставки заказов с учётом требований и пожеланий клиента.
              Постоянно совершенствуем уровень сервиса и расширяем возможности для наших клиентов.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-5 py-3 rounded-full bg-primary/10 text-primary font-medium text-sm">
                Индивидуальный подход
              </div>
              <div className="px-5 py-3 rounded-full bg-primary/10 text-primary font-medium text-sm">
                Гибкие условия
              </div>
              <div className="px-5 py-3 rounded-full bg-primary/10 text-primary font-medium text-sm">
                Широкий ассортимент
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;


