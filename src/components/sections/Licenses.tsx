import { FileCheck, Eye } from "lucide-react";

const licenses = [
  {
    id: 1,
    title: "Лицензия на оптовую торговлю",
    description: "Государственная лицензия на осуществление оптовой торговли",
  },
  {
    id: 2,
    title: "Сертификат ISO 9001",
    description: "Международный сертификат системы менеджмента качества",
  },
  {
    id: 3,
    title: "Разрешение на мед. оборудование",
    description: "Разрешение на реализацию медицинских изделий",
  },
  {
    id: 4,
    title: "Лицензия на химреактивы",
    description: "Лицензия на работу с химическими реактивами",
  },
];

const Licenses = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Наши лицензии и <span className="text-primary">разрешения</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Вся наша деятельность полностью лицензирована и сертифицирована
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {licenses.map((license) => (
            <div
              key={license.id}
              className="group relative bg-card rounded-xl p-6 border border-border card-hover cursor-pointer"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <FileCheck className="w-16 h-16 text-primary/30" />
                <div className="absolute inset-0 bg-foreground/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="font-bold text-sm mb-1">{license.title}</h3>
              <p className="text-xs text-muted-foreground">{license.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Licenses;
