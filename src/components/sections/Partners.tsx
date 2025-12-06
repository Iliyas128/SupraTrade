const partners = [
  { id: 1, name: "PartnerCo 1", initials: "P1" },
  { id: 2, name: "PartnerCo 2", initials: "P2" },
  { id: 3, name: "PartnerCo 3", initials: "P3" },
  { id: 4, name: "PartnerCo 4", initials: "P4" },
  { id: 5, name: "PartnerCo 5", initials: "P5" },
  { id: 6, name: "PartnerCo 6", initials: "P6" },
  { id: 7, name: "PartnerCo 7", initials: "P7" },
  { id: 8, name: "PartnerCo 8", initials: "P8" },
];

const Partners = () => {
  return (
    <section className="py-16 bg-section-alt overflow-hidden">
      <div className="container-custom mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Наши <span className="text-primary">партнёры</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          Сотрудничаем с ведущими компаниями по всему миру
        </p>
      </div>

      <div className="relative">
        <div className="flex animate-slide-left">
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 mx-8"
            >
              <div className="w-40 h-20 bg-card rounded-lg flex items-center justify-center border border-border hover:border-primary transition-colors shadow-custom-sm">
                <span className="text-2xl font-bold text-muted-foreground">
                  {partner.initials}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
