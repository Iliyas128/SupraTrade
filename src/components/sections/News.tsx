import { ArrowRight, Calendar } from "lucide-react";

const news = [
  {
    id: 1,
    title: "Открытие дочерней компании Chemical Solutions",
    excerpt: "В целях укрепления позиций на рынке и дальнейшего развития химического направления была учреждена дочерняя компания.",
    date: "15 ноября 2024",
    image: null,
  },
  {
    id: 2,
    title: "Партнёрство с Cleverest Defense Systems",
    excerpt: "Наша компания стала авторизованным партнёром Cleverest Defense Systems.",
    date: "10 октября 2024",
    image: null,
  },
  {
    id: 3,
    title: "Лауреат номинации \"ДОСТОЯНИЕ ОТРАСЛИ 2023\"",
    excerpt: "ТОО «SNG Group KZ» стало лауреатом престижной номинации в сфере промышленных поставок.",
    date: "20 сентября 2024",
    image: null,
  },
  {
    id: 4,
    title: "Расширение складской сети",
    excerpt: "Открыты новые склады в Астане и Шымкенте для ускорения доставки клиентам.",
    date: "1 августа 2024",
    image: null,
  },
];

const News = () => {
  return (
    <section id="news" className="section-padding bg-background">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Новости <span className="text-primary">компании</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Следите за последними событиями и достижениями нашей компании
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item) => (
            <a
              key={item.id}
              href="#"
              className="group bg-card rounded-xl overflow-hidden border border-border card-hover"
            >
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-muted-foreground mb-2">{item.date}</div>
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <span>подробнее</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
