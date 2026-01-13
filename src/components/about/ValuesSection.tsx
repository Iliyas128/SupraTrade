import { CheckCircle2, Clock, Award, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const ValuesSection = () => {
  const { t } = useTranslation();
  const values = [
    { icon: Award, title: t("about.values.cards.0.title"), description: t("about.values.cards.0.desc") },
    { icon: Clock, title: t("about.values.cards.1.title"), description: t("about.values.cards.1.desc") },
    { icon: CheckCircle2, title: t("about.values.cards.2.title"), description: t("about.values.cards.2.desc") },
    { icon: Users, title: t("about.values.cards.3.title"), description: t("about.values.cards.3.desc") },
  ];
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              {t("about.values.badge")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("about.values.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("about.values.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-5 py-3 rounded-full bg-primary/10 text-primary font-medium text-sm">
                {t("about.values.pill1")}
              </div>
              <div className="px-5 py-3 rounded-full bg-primary/10 text-primary font-medium text-sm">
                {t("about.values.pill2")}
              </div>
              <div className="px-5 py-3 rounded-full bg-primary/10 text-primary font-medium text-sm">
                {t("about.values.pill3")}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;


