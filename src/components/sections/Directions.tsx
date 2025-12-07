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
        <div className="flex flex-col items-center gap-3 mb-12">
          <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            6 направлений для комплексных поставок
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Наши <span className="text-primary">направления</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl">
            От металлопроката до высокоточного оборудования — выбирайте готовую вертикаль и получайте комплексное предложение
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {directions.map((direction, index) => (
            <Link
              key={direction.id}
              to={`/catalog/${direction.id}`}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-custom-sm hover:shadow-custom-lg transition-all duration-500 border border-border/70 hover:border-primary/60 hover:-translate-y-1 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full border border-border/60 text-foreground/80">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                Направление
              </span>
              <div className="p-6 flex flex-col items-center gap-5">
                <div className="relative w-66 md:w-74 aspect-square transition-all duration-700 ease-out md:group-hover:aspect-[4/3]">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/25 animate-spin-slow" />
                  <div className="absolute inset-2 rounded-full border border-primary/20 animate-spin-slower" />
                  {/* Мобильные плавающие акценты */}
                  <span className="md:hidden absolute -left-4 top-6 w-10 h-10 rounded-full bg-primary/15 blur-sm animate-float" />
                  <span className="md:hidden absolute -right-5 bottom-4 w-12 h-12 rounded-full bg-primary/20 blur animate-pulse-glow" />
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-custom-md transform transition-all duration-700 ease-out md:group-hover:scale-[1.08] md:group-hover:rounded-xl">
                    <img
                      src={direction.image}
                      alt={direction.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors text-center">
                  {direction.title}
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs transition-all duration-300 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 line-clamp-3">
                  {direction.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Directions;
