import { DollarSign, Users, Package, Truck } from "lucide-react";

const advantages = [
  {
    id: 1,
    icon: DollarSign,
    title: "Индивидуальная цена",
    description: "Снизим цену специально для Вас! Пришлите расчет от другой компании, и мы сделаем предложение выгодней.",
  },
  {
    id: 2,
    icon: Users,
    title: "Индивидуальный подход",
    description: "Наши менеджеры подберут именно то, что соответствует вашим потребностям и требованиям.",
  },
  {
    id: 3,
    icon: Package,
    title: "Комплексный подход",
    description: "Решаем задачи комплексного оснащения по поставкам металла, оборудования и химических реактивов.",
  },
  {
    id: 4,
    icon: Truck,
    title: "Любой объём поставки",
    description: "Оформим поставки продукции в любых объёмах. Скидки для производителей и постоянных клиентов.",
  },
];

const Advantages = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Наши <span className="text-primary">преимущества</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Почему клиенты выбирают нас для долгосрочного сотрудничества
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={advantage.id}
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <advantage.icon className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
