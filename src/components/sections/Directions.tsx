import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import heroMetal from "@/assets/hero-metal.jpg";
import heroMedical from "@/assets/hero-medical.jpg";
import heroIndustrial from "@/assets/hero-industrial.jpg";
import categoryChemicals from "@/assets/category-chemicals.jpg";
import categoryWelding from "@/assets/category-welding.jpg";
import categoryPipes from "@/assets/category-pipes.jpg";
import { Link } from "react-router-dom";
import { catalogApi } from "@/lib/api";
import type { CategoryNode } from "@/types/catalog";
import SEO from "@/components/SEO";
import { slugify } from "@/lib/utils";

// Описания для направлений
const directionDescriptions: Record<string, string> = {
  "metalloprokat": "Поставляем металлопрокат различного назначения для промышленного и коммерческого применения. Обеспечиваем подбор продукции под технические требования, объёмы и сроки заказчика.",
  "elektrika-i-avtomatika": "Осуществляем поставки электротехнической продукции и компонентов автоматики для промышленного оборудования и инженерных систем. Помогаем с подбором решений под конкретные задачи и условия эксплуатации.",
  "promyshlennoe-oborudovanie": "Поставляем оборудование и узлы для производственных и технологических процессов. Подбираем оптимальные решения с учётом технических требований, условий эксплуатации и бюджета.",
  "podshipniki-i-mekhanika": "Предлагаем широкий ассортимент подшипников и механических компонентов для различного оборудования. Подбираем аналоги и обеспечиваем поставки для надёжной и бесперебойной работы механизмов.",
  "polimernye-materialy": "Поставляем полимерные материалы и изделия для промышленного применения. Подбираем продукцию с учётом условий эксплуатации, нагрузок и специфики использования.",
};

// Fallback изображения для направлений
const directionImages: Record<string, string> = {
  "metalloprokat": heroMetal,
  "elektrika-i-avtomatika": heroIndustrial,
  "promyshlennoe-oborudovanie": heroIndustrial,
  "podshipniki-i-mekhanika": heroIndustrial,
  "polimernye-materialy": categoryChemicals,
};

const Directions = () => {
  const [directions, setDirections] = useState<Array<CategoryNode & { description: string; image: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDirections = async () => {
      try {
        const response = await catalogApi.getCategoryTree();
        if (response.success && response.tree) {
          // Берем первые 5 родительских категорий (где parentId === null или undefined)
          const parentCategories = response.tree
            .filter((cat: CategoryNode) => !cat.parentId)
            .slice(0, 5);

          const mappedDirections = parentCategories.map((cat: CategoryNode) => {
            const rawSlug = cat.slug || "";
            const normalizedSlug = rawSlug || slugify(cat.name);

            return {
              ...cat,
              // Пытаемся найти описание по нормализованному slug, иначе берём имя
              description: directionDescriptions[normalizedSlug] || directionDescriptions[rawSlug] || cat.name,
              image: (cat as any).image || directionImages[normalizedSlug] || directionImages[rawSlug] || heroIndustrial,
            };
          });

          setDirections(mappedDirections);
        }
      } catch (error) {
        console.error("Ошибка загрузки направлений:", error);
        // Fallback на статические данные
        const fallbackDirections = [
          {
            _id: "metalloprokat",
            name: "Металлопрокат",
            slug: "metalloprokat",
            description: directionDescriptions["metalloprokat"],
            image: directionImages["metalloprokat"],
          },
          {
            _id: "elektrika-i-avtomatika",
            name: "Электрика и автоматика",
            slug: "elektrika-i-avtomatika",
            description: directionDescriptions["elektrika-i-avtomatika"],
            image: directionImages["elektrika-i-avtomatika"],
          },
          {
            _id: "promyshlennoe-oborudovanie",
            name: "Промышленное оборудование",
            slug: "promyshlennoe-oborudovanie",
            description: directionDescriptions["promyshlennoe-oborudovanie"],
            image: directionImages["promyshlennoe-oborudovanie"],
          },
          {
            _id: "podshipniki-i-mekhanika",
            name: "Подшипники и механика",
            slug: "podshipniki-i-mekhanika",
            description: directionDescriptions["podshipniki-i-mekhanika"],
            image: directionImages["podshipniki-i-mekhanika"],
          },
          {
            _id: "polimernye-materialy",
            name: "Полимерные материалы",
            slug: "polimernye-materialy",
            description: directionDescriptions["polimernye-materialy"],
            image: directionImages["polimernye-materialy"],
          },
        ];
        setDirections(fallbackDirections as any);
      } finally {
        setLoading(false);
      }
    };

    loadDirections();
  }, []);

  if (loading) {
    return (
      <section id="directions" className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex flex-col items-center gap-3 mb-12">
            <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              5 направлений для комплексных поставок
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              Наши <span className="text-primary">направления</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl">
              От металлопроката до высокоточного оборудования — выбирайте готовую вертикаль и получайте комплексное предложение
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-custom-sm border border-border/70 animate-pulse h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Разделяем на две группы: первые 3 и последние 2
  const topThree = directions.slice(0, 3);
  const bottomTwo = directions.slice(3, 5);

  const directionsList = directions.map((d) => d.name).join(", ");

  return (
    <>
      <SEO
        title="Наши направления"
        description={`5 основных направлений SUPRA TRADE: ${directionsList}. Комплексные поставки металлопроката, промышленного оборудования, электрики и автоматики, подшипников и полимерных материалов для промышленности в Казахстане и СНГ.`}
        keywords="металлопрокат, электрика и автоматика, промышленное оборудование, подшипники, механика, полимерные материалы, SUPRA TRADE, Супра трейд, поставщик, Казахстан"
      />
      <section id="directions" className="section-padding bg-background">
      <div className="container-custom">
        <div className="flex flex-col items-center gap-3 mb-12">
          <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            5 направлений для комплексных поставок
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Наши <span className="text-primary">направления</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl">
            От металлопроката до высокоточного оборудования — выбирайте готовую вертикаль и получайте комплексное предложение
          </p>
        </div>

        {/* Верхние 3 карты */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {topThree.map((direction, index) => (
            <Link
              key={direction._id}
              to={`/catalog/${direction.slug}`}
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
                      alt={direction.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors text-center">
                  {direction.name}
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs transition-all duration-300 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
                  {direction.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Нижние 2 карты */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {bottomTwo.map((direction, index) => (
            <Link
              key={direction._id}
              to={`/catalog/${direction.slug}`}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-custom-sm hover:shadow-custom-lg transition-all duration-500 border border-border/70 hover:border-primary/60 hover:-translate-y-1 opacity-0 animate-fade-in"
              style={{ animationDelay: `${(index + 3) * 80}ms` }}
            >
              <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full border border-border/60 text-foreground/80">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                  {index + 4}
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
                      alt={direction.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors text-center">
                  {direction.name}
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs transition-all duration-300 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
                  {direction.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default Directions;
