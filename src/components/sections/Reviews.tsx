import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    company: "ТОО \"АМДГ\"",
    author: "Симончик А.Н.",
    text: "Благодарим компанию SNG Group KZ за качественное и своевременное выполнение заказов. Рекомендуем как надёжного поставщика.",
    logo: "АМДГ",
  },
  {
    id: 2,
    company: "АО \"Тыныс\"",
    author: "А. Шаврин",
    text: "Отличное качество продукции и сервиса. Все поставки осуществляются в срок. Будем продолжать сотрудничество.",
    logo: "Тыныс",
  },
  {
    id: 3,
    company: "ТОО \"BATYSKENT GROUP\"",
    author: "Мухамбетяр А.М.",
    text: "Профессиональный подход к работе, гибкие условия сотрудничества. Благодарим за долгосрочное партнёрство.",
    logo: "BG",
  },
  {
    id: 4,
    company: "ТОО \"АС Құрылыс\"",
    author: "Адилбеков Ж. З.",
    text: "Высокое качество металлопроката и оперативная доставка. Рекомендуем для строительных проектов.",
    logo: "АСК",
  },
  {
    id: 5,
    company: "ТОО \"2020 Строй KZ\"",
    author: "Сулейменов Д. Д.",
    text: "Надёжный партнёр с конкурентными ценами. Персональный менеджер всегда на связи.",
    logo: "2020",
  },
];

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Отзывы о <span className="text-primary">компании</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Что говорят о нас наши партнёры и клиенты
        </p>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-custom-lg border border-border">
            <Quote className="w-12 h-12 text-primary/20 mb-6" />
            
            <p className="text-lg md:text-xl text-foreground/90 mb-8 leading-relaxed">
              "{reviews[currentIndex].text}"
            </p>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {reviews[currentIndex].logo}
              </div>
              <div>
                <div className="font-bold text-lg">{reviews[currentIndex].author}</div>
                <div className="text-muted-foreground">{reviews[currentIndex].company}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevReview}
              className="p-3 bg-card hover:bg-primary hover:text-primary-foreground rounded-full shadow-custom-md transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-border hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextReview}
              className="p-3 bg-card hover:bg-primary hover:text-primary-foreground rounded-full shadow-custom-md transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="text-center mt-6">
            <a href="#all-reviews" className="text-primary font-semibold hover:underline">
              Все отзывы
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
