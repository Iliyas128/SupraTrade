import { useEffect, useState, useRef } from "react";

const stats = [
  { id: 1, value: 700, suffix: "+", label: "Сотрудничаем с более чем 700 поставщиками" },
  { id: 2, value: 1400, suffix: "+", label: "видов продукции от ведущих производителей" },
  { id: 3, value: 15, suffix: "+", label: "лет средний опыт работы сотрудников" },
  { id: 4, value: 20, suffix: "+", label: "складов на территории Казахстана и СНГ" },
];

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-primary text-primary-foreground">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          О нас в цифрах
        </h2>
        <p className="text-primary-foreground/80 text-center mb-12 max-w-2xl mx-auto">
          Результаты нашей работы говорят сами за себя
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="text-center"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-5xl md:text-6xl font-bold mb-2">
                {isVisible ? (
                  <CountUp end={stat.value} duration={2000} />
                ) : (
                  0
                )}
                <span>{stat.suffix}</span>
              </div>
              <p className="text-primary-foreground/80 text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface CountUpProps {
  end: number;
  duration: number;
}

const CountUp = ({ end, duration }: CountUpProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <>{count}</>;
};

export default Stats;
