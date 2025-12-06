import { ArrowRight } from "lucide-react";
import heroMetal from "@/assets/hero-metal.jpg";
import heroMedical from "@/assets/hero-medical.jpg";
import heroIndustrial from "@/assets/hero-industrial.jpg";
import categoryChemicals from "@/assets/category-chemicals.jpg";
import categoryWelding from "@/assets/category-welding.jpg";
import categoryPipes from "@/assets/category-pipes.jpg";
import { Link } from "react-router-dom";

const directions = [
  {
    id: "metalloprokat",
    title: "Металлопрокат",
    description: "Широкий ассортимент металлопроката: нержавеющая сталь, цветные металлы, титан, ферросплавы и специальные стали.",
    image: heroMetal,
  },
  {
    id: "meditsinskoe-oborudovanie",
    title: "Медицинское оборудование",
    description: "Современное медицинское оборудование для диагностики, хирургии, офтальмологии и лабораторных исследований.",
    image: heroMedical,
  },
  {
    id: "promyshlennoe-oborudovanie",
    title: "Промышленное оборудование",
    description: "Электродвигатели, насосное оборудование, мотор-редукторы и компрессорное оборудование для промышленности.",
    image: heroIndustrial,
  },
  {
    id: "himicheskie-reaktivy-dlya-zavodov-i-promyshlennosti",
    title: "Химические реактивы для заводов и промышленности",
    description: "Химия для добычи нефти и газа, очистки воды, энергетики и специальные технические химикаты.",
    image: categoryChemicals,
  },
  {
    id: "truboprovodnaya-i-zapornaya-armatura",
    title: "Трубопроводная и запорная арматура",
    description: "Краны шаровые, клапаны, задвижки, фланцы и фитинги для трубопроводных систем.",
    image: categoryPipes,
  },
  {
    id: "svarochnoe-oborudovanie",
    title: "Сварочное оборудование",
    description: "Сварочные аппараты MMA, MIG/MAG, TIG, а также электроды, проволока и расходные материалы.",
    image: categoryWelding,
  },
];

const Directions = () => {
  return (
    <section id="directions" className="section-padding bg-background">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Наши <span className="text-primary">направления</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          6 ключевых направлений деятельности для комплексного обеспечения вашего бизнеса
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {directions.map((direction) => (
            <Link
              key={direction.id}
              to={`/catalog/${direction.id}`}
              className="group bg-card rounded-xl overflow-hidden shadow-custom-sm hover:shadow-custom-lg transition-all duration-300 card-hover"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={direction.image}
                  alt={direction.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {direction.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {direction.description}
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <span>Подробнее</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Directions;
