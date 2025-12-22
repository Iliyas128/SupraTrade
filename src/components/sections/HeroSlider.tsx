import { Button } from "@/components/ui/button";
import heroMetal from "@/assets/goupgo.jpg";
import { useNavigate } from "react-router-dom";
import defenseMiniIcon from "@/assets/HeroIcons/defenseMiniIcon.png";
import rostMiniIcon from "@/assets/HeroIcons/RostMiniIcon.png";
import transferIcon from "@/assets/HeroIcons/transferIcon.png";

const features = [
  {
    icon: defenseMiniIcon,
    title: "Гарантия качества",
    description: "Вся продукция сертифицирована",
  },
  {
    icon: rostMiniIcon,
    title: "Рост продаж",
    description: "Более 1400 видов продукции",
  },
  {
    icon: transferIcon,
    title: "Быстрая доставка",
    description: "По всему Казахстану и СНГ",
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[500px] sm:h-[600px] md:h-[700px] mb-0 sm:mb-24 md:mb-28">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroMetal}
          alt="Цветной металлопрокат"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container-custom">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-primary">
              Поставка материалов, комплектующих и оборудования
              <span className="block text-primary">для промышленных и коммерческих предприятий</span>
            </h1>
            <p className="text-sm md:text-base text-primary-foreground/90 mb-8">
            Мы предоставляем комплексные решения для предприятий: снабжение, производство под заказ и подбор промышленной продукции. Работаем с проверенными партнёрами, обеспечиваем качество, надёжность и удобный сервис «под ключ».
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/catalog")}
                variant="hero" 
                size="xl"
              >
                Смотреть каталог
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature Boxes - выходят за Hero, скрыты на мобильных */}
      <div className="absolute -bottom-16 md:-bottom-20 left-0 right-0 z-10 hidden sm:block">
        <div className="container-custom">
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-white rounded-xl px-6 py-6 md:px-8 md:py-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 mb-3">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-[#1E1E1E] font-semibold text-sm md:text-base mb-1">
                  {feature.title}
                </h3>
                <p className="text-[#1E1E1E]/60 text-xs md:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
