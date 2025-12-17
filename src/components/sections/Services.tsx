import { Link } from "react-router-dom";
import complexImage from "@/assets/complex.png";
import selectmentImage from "@/assets/selectment.jpg";
import industrializationImage from "@/assets/industrialization.jpg";

const services = [
  {
    id: 1,
    title: "Комплексное снабжение предприятий",
    description:
      "Организуем полный цикл поставок для вашего бизнеса: подбор, закупку и доставку необходимых материалов, комплектующих и оборудования для стабильной и бесперебойной работы производства.",
    image: complexImage,
    href: "#",
  },
  {
    id: 2,
    title: "Производство изделий под заказ",
    description:
      "Изготавливаем изделия и компоненты по индивидуальным чертежам и техническим требованиям. Работаем с различными материалами, обеспечивая точность, качество и соблюдение сроков.",
    image: industrializationImage,
    href: "#",
  },
  {
    id: 3,
    title: "Подбор промышленной продукции",
    description:
      "Подберем широкий ассортимент промышленной продукции: подшипники, электротехнические компоненты, герметики и расходные материалы для различных отраслей.",
    image: selectmentImage,
    href: "#",
  },
];

const Services = () => {
  return (
    <section id="services" className="section-padding bg-section-alt">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Наши <span className="text-primary">услуги</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Решения под ключ для задач вашего производства
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => (
            <Link
              key={service.id}
              to={service.href}
              className="service-item group relative overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat min-h-[550px] flex flex-col justify-end transition-all duration-300 hover:shadow-xl"
              style={{ backgroundImage: `url(${service.image})` }}
            >
              {/* Red overlay on hover */}
              <div className="absolute inset-0 bg-green-600/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]" />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300 z-[2]" />

              {/* Content */}
              <div className="itemtext relative z-10 p-6 text-white">
                <div className="title text-xl md:text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                  {service.title}
                </div>
                <div className="hidden-text opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-96 overflow-hidden">
                  <p className="text-sm md:text-base text-white/90 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
