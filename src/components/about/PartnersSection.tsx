import { Factory, Truck, Handshake, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const PartnersSection = () => {
  const { t } = useTranslation();
  const features = [
    { icon: Factory, text: t("about.partners.list.0") },
    { icon: ShieldCheck, text: t("about.partners.list.1") },
    { icon: Truck, text: t("about.partners.list.2") },
    { icon: Handshake, text: t("about.partners.list.3") },
  ];
  return (
    <section className="py-20 lg:py-28 bg-hero-gradient relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-primary-foreground/80 uppercase tracking-wider mb-4">
              {t("about.partners.badge")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              {t("about.partners.title")}
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {t("about.partners.subtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/15 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <p className="text-primary-foreground font-medium text-sm leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 p-8 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10 text-center">
            <p className="text-primary-foreground/90 text-lg leading-relaxed">
              {t("about.partners.note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;


