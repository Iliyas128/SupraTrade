import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import heroIndustrial from "@/assets/hero-industrial.jpg";

const features = [
  "Более 1400 видов продукции",
  "Сотрудничество с 700+ поставщиками",
  "Собственная лаборатория в Китае",
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
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-custom-lg hidden md:block">
              <div className="text-4xl font-bold">2022</div>
              <div className="text-sm">год основания</div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              О <span className="text-primary">компании</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
            Наша компания занимается поставками промышленной продукции различных категорий,
            обеспечивая предприятия надежными материалами и современными технологическими решениями. 
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
            Мы выстроили устойчивые партнерские отношения с производителями в разных странах, 
            что позволяет нам оперативно обеспечивать поставки как стандартных позиций, так и редких или специализированных товаров под запрос.
            </p>

            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button size="lg">
              Узнать подробнее
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
