import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroIndustrial from "@/assets/hero-industrial.jpg";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation();
  const features = t("aboutSection.features", { returnObjects: true }) as string[] | undefined;
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src={heroIndustrial}
              alt={t("aboutSection.title")}
              className="rounded-2xl shadow-custom-xl"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("aboutSection.title")}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {t("aboutSection.text1")}
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {t("aboutSection.text2")}
            </p>

            <ul className="space-y-3 mb-8">
              {features?.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" asChild>
              <Link to="/about">{t("aboutSection.button")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
