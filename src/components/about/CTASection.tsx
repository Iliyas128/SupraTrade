import { ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onCallbackClick: () => void;
}

const CTASection = ({ onCallbackClick }: CTASectionProps) => {
  return (
    <section className="py-20 lg:py-28 bg-section-gradient">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Готовы к сотрудничеству?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Свяжитесь с нами, чтобы обсудить ваши потребности и получить индивидуальное предложение для вашего
            предприятия.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2 text-base px-8" onClick={onCallbackClick}>
              <Phone className="w-5 h-5" />
              Связаться с нами
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 text-base px-8">
              <a href="mailto:sales@supratrade.kz">
                <Mail className="w-5 h-5" />
                Написать письмо
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;


