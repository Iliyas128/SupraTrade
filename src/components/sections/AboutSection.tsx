import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroIndustrial from "@/assets/hero-industrial.jpg";

const features = [
  "Сотрудничество с 700+ поставщиками",
  "Гарантия качества продукции",
  "Конкурентоспособные цены",
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src={heroIndustrial}
              alt="О компании"
              className="rounded-2xl shadow-custom-xl"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              О <span className="text-primary">компании</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
            Основная стратегическая задача нашей компании — обеспечить предприятия комплексными решениями в сфере снабжения, 
            производства и подбора промышленной продукции, закрывая ключевые потребности бизнеса в одном месте.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
            Мы специализируемся на комплексном снабжении предприятий, производстве изделий под заказ и поставке промышленной продукции для различных отраслей. 
            Организуем поставки материалов, комплектующих и оборудования, изготавливаем изделия по индивидуальным чертежам и техническим требованиям, 
            а также подбираем оптимальные решения под конкретные задачи заказчика.
            </p>

            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" asChild>
              <Link to="/about">Узнать подробнее</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
