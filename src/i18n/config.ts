import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ru from "./locales/ru/translation.json";
import zh from "./locales/zh/translation.json";

const productExtra = {
  ru: {
    product: {
      priceOnRequest: "Цена по запросу",
      inStock: "В наличии",
      specsTitle: "Технические характеристики",
      allSpecs: "Все характеристики",
      requestOffer: "Запросить КП",
      backToCatalog: "Вернуться в каталог",
      tags: "Теги",
      noDescription: "Описание будет доступно по запросу.",
      noSpecs: "Характеристики отсутствуют.",
      notFound: "Товар не найден.",
      tabs: {
        description: "Описание",
        specs: "Характеристики",
        guarantee: "Гарантии",
        delivery: "Доставка",
        payment: "Оплата",
      },
      guarantee: {
        item1: "Сертифицированный товар",
        item2: "Официальная гарантия 12 месяцев",
        item3: "Собственный сервисный центр",
        item4: "Возврат без проблем",
      },
      delivery: {
        item1: "Доставка по всему Казахстану",
        item2: "Самовывоз со склада",
        item3: "Курьерская доставка по городу",
        item4: "Проверка товара перед отправкой",
      },
      payment: {
        item1: "Заказы принимаются после 100% предоплаты или по согласованию",
        item2: "Договор и акт при необходимости",
      },
    },
  },
  en: {
    product: {
      priceOnRequest: "Price on request",
      inStock: "In stock",
      specsTitle: "Technical specifications",
      allSpecs: "All specifications",
      requestOffer: "Request offer",
      backToCatalog: "Back to catalog",
      tags: "Tags",
      noDescription: "Description will be provided on request.",
      noSpecs: "No specifications available.",
      notFound: "Product not found.",
      tabs: {
        description: "Description",
        specs: "Specifications",
        guarantee: "Guarantee",
        delivery: "Delivery",
        payment: "Payment",
      },
      guarantee: {
        item1: "Certified product",
        item2: "Official 12-month warranty",
        item3: "In-house service center",
        item4: "Hassle-free returns",
      },
      delivery: {
        item1: "Delivery across Kazakhstan",
        item2: "Pickup from warehouse",
        item3: "City courier delivery",
        item4: "Inspection before shipping",
      },
      payment: {
        item1: "Orders after 100% prepayment or as agreed",
        item2: "Contract and act if required",
      },
    },
  },
  zh: {
    product: {
      priceOnRequest: "价格面议",
      inStock: "有现货",
      specsTitle: "技术参数",
      allSpecs: "全部参数",
      requestOffer: "请求报价",
      backToCatalog: "返回目录",
      tags: "标签",
      noDescription: "描述可按需提供。",
      noSpecs: "暂无参数。",
      notFound: "未找到该商品。",
      tabs: {
        description: "描述",
        specs: "参数",
        guarantee: "质保",
        delivery: "配送",
        payment: "付款",
      },
      guarantee: {
        item1: "认证产品",
        item2: "官方12个月质保",
        item3: "自有服务中心",
        item4: "支持退换",
      },
      delivery: {
        item1: "覆盖全哈萨克斯坦",
        item2: "仓库自提",
        item3: "市内快递",
        item4: "发货前检验",
      },
      payment: {
        item1: "100% 预付款或按协议",
        item2: "可提供合同及文件",
      },
    },
  },
};

const resources = {
  en: { translation: { ...en, ...productExtra.en } },
  ru: { translation: { ...ru, ...productExtra.ru } },
  zh: { translation: { ...zh, ...productExtra.zh } },
};

const savedLanguage =
  typeof window !== "undefined" ? localStorage.getItem("language") || "ru" : "ru";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = savedLanguage;
}

export default i18n;