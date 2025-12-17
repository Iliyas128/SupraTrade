import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  structuredData?: object;
}

const defaultTitle = "SUPRA TRADE — Поставщик металлопроката и промышленного оборудования";
const defaultDescription =
  "Надёжный поставщик металлопроката, химических реактивов, медицинского и промышленного оборудования в Казахстане и СНГ. Более 1400 видов продукции.";
const defaultKeywords =
  "металлопрокат, промышленное оборудование, медицинское оборудование, химические реактивы, поставщик, Казахстан, СНГ, металл, оборудование";
const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
const defaultImage = `${siteUrl}/logo.svg`;

const SEO = ({
  title,
  description = defaultDescription,
  keywords = defaultKeywords,
  image = defaultImage,
  url,
  type = "website",
  structuredData,
}: SEOProps) => {
  const fullTitle = title ? `${title} | SUPRA TRADE` : defaultTitle;
  const fullUrl = url ? `${siteUrl}${url}` : (typeof window !== "undefined" ? window.location.href : siteUrl);

  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="SUPRA TRADE" />
      <meta property="og:locale" content="ru_RU" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Дополнительные мета-теги */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="language" content="Russian" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="SUPRA TRADE" />
      <meta name="copyright" content="SUPRA TRADE" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
};

export default SEO;



