import { useState } from "react";
import STPMachine1 from "@/assets/STPMachine1.png";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Формируем сообщение для WhatsApp
    const message = `${t("stats.formTitle")}
    
👤 ${t("stats.name")}: ${name}
📞 ${t("stats.phone")}: ${phone}
${fileName ? `📎 ${t("stats.attached")}: ${fileName}` : ''}

${t("stats.formNote")}`;

    // Номер WhatsApp (без + и пробелов)
    const whatsappNumber = "77083767189";
    
    // Открываем WhatsApp с сообщением
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <section className="py-8 bg-background text-primary-foreground overflow-visible">
      {/* Серый блок на всю ширину */}
      <div className="relative bg-[#1E1E1E] py-6 md:py-8 overflow-visible">
        {/* Контейнер для контента */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_1fr] items-center">
            {/* Левая колонка: текст + форма — масштабируется */}
            <div className="relative z-10" style={{ fontSize: 'clamp(0.75rem, 1vw, 1rem)' }}>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }} className="font-bold mb-3 lg:mb-4">
                {t("stats.title")}
              </h2>
              <p className="text-primary-foreground/80 mb-6 lg:mb-8" style={{ fontSize: 'clamp(0.875rem, 1.1vw, 1.125rem)' }}>
                {t("stats.subtitle")}
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-3 lg:space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("stats.namePlaceholder")}
                    className="flex-1 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("stats.phonePlaceholder")}
                    className="w-full sm:w-40 lg:w-48 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <span className="inline-flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full border border-primary-foreground/40">
                      📎
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm lg:text-base text-primary-foreground">
                        {t("stats.attach")}
                      </span>
                      {fileName && (
                        <span className="text-xs text-primary-foreground/70 mt-0.5">
                          {t("stats.file")}: {fileName}
                        </span>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFileName(file ? file.name : null);
                      }}
                    />
                  </label>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-5 lg:px-6 py-2.5 lg:py-3 rounded-md bg-[#FF2D2D] text-white text-sm lg:text-base font-semibold whitespace-nowrap hover:bg-[#ff4444] transition-colors"
                  >
                    {t("stats.submit")}
                  </button>
                </div>

                <p className="text-[10px] sm:text-[11px] lg:text-xs text-primary-foreground/60 leading-snug max-w-md">
                  {t("stats.disclaimer")}
                </p>

                {isSubmitted && (
                  <p className="text-xs text-emerald-400">
                    {t("stats.success")}
                  </p>
                )}
              </form>
            </div>

            {/* Правая колонка: картинка — масштабируется пропорционально */}
            <div className="relative hidden lg:flex justify-end items-center">
              <div className="relative w-full -my-20 lg:-my-24 xl:-my-28">
                <img
                  src={STPMachine1}
                  alt={t("stats.imageAlt")}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
