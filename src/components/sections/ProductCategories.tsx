import { ArrowRight } from "lucide-react";
import heroMetal from "@/assets/hero-metal.jpg";
import heroMedical from "@/assets/hero-medical.jpg";
import heroIndustrial from "@/assets/hero-industrial.jpg";
import categoryChemicals from "@/assets/category-chemicals.jpg";
import categoryWelding from "@/assets/category-welding.jpg";
import categoryPipes from "@/assets/category-pipes.jpg";

const categories = [
  {
    id: 1,
    title: "Металлопрокат",
    image: heroMetal,
    href: "#metal",
  },
  {
    id: 2,
    title: "Медицинское оборудование",
    image: heroMedical,
    href: "#medical",
  },
  {
    id: 3,
    title: "Промышленное оборудование",
    image: heroIndustrial,
    href: "#industrial",
  },
  {
    id: 4,
    title: "Химические реактивы",
    image: categoryChemicals,
    href: "#chemicals",
  },
  {
    id: 5,
    title: "Трубопроводная арматура",
    image: categoryPipes,
    href: "#pipes",
  },
  {
    id: 6,
    title: "Сварочное оборудование",
    image: categoryWelding,
    href: "#welding",
  },
];

const ProductCategories = () => {
  return (
    <section id="catalog" className="section-padding bg-section-alt">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Наша <span className="text-primary">продукция</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Широкий ассортимент качественной продукции от ведущих производителей
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href={category.href}
              className="group relative h-64 rounded-xl overflow-hidden card-hover"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-primary-foreground mb-2">
                  {category.title}
                </h3>
                <div className="flex items-center gap-2 text-primary font-semibold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span>подробнее</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
