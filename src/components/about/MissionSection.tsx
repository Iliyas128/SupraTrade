import { Cog, Package, Wrench, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const MissionSection = () => {
  const { t } = useTranslation();
  const services = [
    { icon: Package, title: t("about.mission.cards.0.title"), description: t("about.mission.cards.0.desc") },
    { icon: Cog, title: t("about.mission.cards.1.title"), description: t("about.mission.cards.1.desc") },
    { icon: Wrench, title: t("about.mission.cards.2.title"), description: t("about.mission.cards.2.desc") },
    { icon: TrendingUp, title: t("about.mission.cards.3.title"), description: t("about.mission.cards.3.desc") },
  ];
  return (
    <section className="py-20 lg:py-28 bg-section-gradient">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            {t("about.mission.badge")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t("about.mission.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("about.mission.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group p-6 rounded-2xl bg-card-gradient border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;


