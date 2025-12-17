import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";

interface ContactCTAProps {
  onCallbackClick: () => void;
}

const ContactCTA = ({ onCallbackClick }: ContactCTAProps) => {
  return (
    <section id="contacts" className="py-20 bg-primary text-primary-foreground">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            У вас есть вопросы?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
              Оставьте заявку и наши менеджеры свяжутся с вами в ближайшее время и ответят на все ваши вопросы.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="mailto:sales@supratrade.kz"
              className="flex items-center gap-2 text-lg hover:text-primary-foreground/80 transition-colors"
            >
              <Mail size={20} />
              <span>sales@supratrade.kz</span>
            </a>
            <span className="hidden sm:block text-primary-foreground/50">|</span>
            <a
              href="tel:+7 708 376 71 89"
              className="flex items-center gap-2 text-lg hover:text-primary-foreground/80 transition-colors"
            >
              <Phone size={20} />
              <span>+7 708 376 71 89</span>
            </a>
          </div>

          <Button
            variant="heroOutline"
            size="xl"
            onClick={onCallbackClick}
          >
            Оставить заявку
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
