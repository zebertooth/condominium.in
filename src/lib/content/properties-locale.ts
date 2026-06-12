import type { LocaleTriple } from "@/lib/content/areas-locale";

export interface PropertyLocalePack {
  title: LocaleTriple;
  description: { en?: string; zh?: string; ja?: string; ar?: string };
  district: LocaleTriple;
}

/** Native ZH/JA/AR copy for static demo listings (EN in properties.ts). */
export const propertyLocalePacks: Record<string, PropertyLocalePack> = {
  "the-loft-asoke-2br-rent": {
    title: {
      zh: "The Loft 阿索克 2 卧城景",
      ja: "The Loft アソーク 2LDK シティビュー",
      ar: "The Loft \u0623\u0633\u0648\u0643 \u063a\u0631\u0641\u062a\u0627\u0646 \u0625\u0637\u0644\u0627\u0644\u0629 \u0639\u0644\u0649 \u0627\u0644\u0645\u062f\u064a\u0646\u0629",
    },
    description: {
      en: "Luxury condo in central Asoke, 350m from BTS Asoke. Fully furnished and move-in ready, ideal for expats and executives.",
      zh: "阿索克核心地段豪华公寓，距 BTS 阿索克 350 米，精装拎包入住，适合外籍人士与企业高管。",
      ja: "アソーク中心の高級コンドミニアム。BTSアソークから350m。家具付き即入居可。外国人・エグゼクティブ向け。",
      ar: "\u0634\u0642\u0629 \u0641\u0627\u062e\u0631\u0629 \u0641\u064a \u0642\u0644\u0628 \u0623\u0633\u0648\u0643\u060c \u0639\u0644\u0649 \u0628\u0639\u062f 350 \u0645\u062a\u0631 \u0645\u0646 BTS \u0623\u0633\u0648\u0643. \u0645\u0624\u062b\u062b\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0648\u062c\u0627\u0647\u0632\u0629 \u0644\u0644\u0633\u0643\u0646\u060c \u0645\u062b\u0627\u0644\u064a\u0629 \u0644\u0644\u0645\u063a\u062a\u0631\u0628\u064a\u0646 \u0648\u0643\u0628\u0627\u0631 \u0627\u0644\u062a\u0646\u0641\u064a\u0630\u064a\u064a\u0646.",
    },
    district: { zh: "瓦他那", ja: "ワットタナ", ar: "\u0648\u0627\u062a\u062b\u0627\u0646\u0627" },
  },
  "ideo-mobi-sukhumvit-1br-rent": {
    title: {
      zh: "Ideo Mobi 素坤逸 1 卧 近 BTS 伊卡迈",
      ja: "Ideo Mobi スクムビット 1LDK BTSエカマイ近く",
      ar: "Ideo Mobi \u0633\u0648\u062e\u0648\u0645\u0641\u064a\u062a \u063a\u0631\u0641\u0629 \u0648\u0627\u062d\u062f\u0629 \u0642\u0631\u0628 BTS \u0625\u064a\u0643\u0627\u0645\u0627\u064a",
    },
    description: {
      en: "Modern new condo near BTS Ekkamai with convenient transit. Affordable rent, perfect for working professionals.",
      zh: "现代新盘公寓，近 BTS 伊卡迈，交通便利，租金适合上班族。",
      ja: "BTSエカマイ近くのモダン新築コンドミニアム。アクセス良好で、会社員向けの手頃な賃料。",
      ar: "\u0634\u0642\u0629 \u062d\u062f\u064a\u062b\u0629 \u062c\u062f\u064a\u062f\u0629 \u0642\u0631\u0628 BTS \u0625\u064a\u0643\u0627\u0645\u0627\u064a\u060c \u062a\u0646\u0642\u0644 \u0645\u0631\u064a\u062d \u0648\u0625\u064a\u062c\u0627\u0631 \u0645\u0646\u0627\u0633\u0628 \u0644\u0644\u0645\u0648\u0638\u0641\u064a\u0646.",
    },
    district: { zh: "瓦他那", ja: "ワットタナ", ar: "\u0648\u0627\u062a\u062b\u0627\u0646\u0627" },
  },
  "life-sathorn-silom-sale": {
    title: {
      zh: "Life 沙吞-是隆 2 卧 出售",
      ja: "Life サトーン-シーロム 2LDK 売却",
      ar: "Life \u0633\u0627\u062a\u0648\u0631\u0646-\u0633\u064a\u0644\u0648\u0645 \u063a\u0631\u0641\u062a\u0627\u0646 \u0644\u0644\u0628\u064a\u0639",
    },
    description: {
      en: "Prime-location condo near BTS Surasak and MRT Lumpini. Strong capital growth potential, ideal for investment.",
      zh: "黄金地段公寓，近 BTS 素拉沙与 MRT 伦披尼，增值潜力佳，适合投资。",
      ja: "BTSスラサック・MRTルンピニ近くの一等地コンドミニアム。資産価値向上の可能性が高く、投資向け。",
      ar: "\u0634\u0642\u0629 \u0641\u064a \u0645\u0648\u0642\u0639 \u0645\u0645\u064a\u0632 \u0642\u0631\u0628 BTS \u0633\u0648\u0631\u0627\u0633\u0627\u0643 \u0648MRT \u0644\u0648\u0645\u0628\u064a\u0646\u064a. \u0625\u0645\u0643\u0627\u0646\u064a\u0629 \u0646\u0645\u0648 \u0631\u0623\u0633\u0645\u0627\u0644\u064a \u062c\u064a\u062f\u0629\u060c \u0645\u062b\u0627\u0644\u064a\u0629 \u0644\u0644\u0627\u0633\u062a\u062b\u0645\u0627\u0631.",
    },
    district: { zh: "挽叻", ja: "バンラック", ar: "\u0628\u0627\u0646 \u0631\u0627\u0643" },
  },
  "the-line-ratchathewi-rent": {
    title: {
      zh: "The Line 拉差贴威 Studio 近 BTS 拉差贴威",
      ja: "The Line ラーチャテウィ スタジオ BTSラーチャテウィ近く",
      ar: "The Line \u0631\u0627\u062a\u0634\u0627\u062a\u064a\u0648\u064a \u0627\u0633\u062a\u0648\u062f\u064a\u0648 \u0642\u0631\u0628 BTS \u0631\u0627\u062a\u0634\u0627\u062a\u064a\u0648\u064a",
    },
    description: {
      en: "Compact studio next to BTS Ratchathewi, ideal for students and working professionals.",
      zh: "紧凑 Studio，毗邻 BTS 拉差贴威，适合学生与上班族。",
      ja: "BTSラーチャテウィ直結のコンパクトスタジオ。学生・会社員に最適。",
      ar: "\u0627\u0633\u062a\u0648\u062f\u064a\u0648 \u0645\u062f\u0645\u062c \u0628\u062c\u0648\u0627\u0631 BTS \u0631\u0627\u062a\u0634\u0627\u062a\u064a\u0648\u064a\u060c \u0645\u062b\u0627\u0644\u064a \u0644\u0644\u0637\u0644\u0627\u0628 \u0648\u0627\u0644\u0645\u0648\u0638\u0641\u064a\u0646.",
    },
    district: { zh: "拉差贴威", ja: "ラーチャテウィ", ar: "\u0631\u0627\u062a\u0634\u0627\u062a\u064a\u0648\u064a" },
  },
  "noble-reform-phayathai-sale": {
    title: {
      zh: "Noble Reform 帕亚泰 1 卧 出售",
      ja: "Noble Reform パヤータイ 1LDK 売却",
      ar: "Noble Reform \u0641\u0627\u064a\u0627 \u062a\u0627\u064a \u063a\u0631\u0641\u0629 \u0648\u0627\u062d\u062f\u0629 \u0644\u0644\u0628\u064a\u0639",
    },
    description: {
      en: "New condo near BTS Phayathai with good price per sqm. Suitable for living and rental investment.",
      zh: "帕亚泰 BTS 附近新盘，单价合理，适合自住及出租投资。",
      ja: "BTSパヤータイ近くの新築。㎡単価が良く、自己居住・賃貸投資に適す。",
      ar: "\u0634\u0642\u0629 \u062c\u062f\u064a\u062f\u0629 \u0642\u0631\u0628 BTS \u0641\u0627\u064a\u0627 \u062a\u0627\u064a \u0628\u0633\u0639\u0631 \u0645\u0645\u062a\u0627\u0632 \u0644\u0644\u0645\u062a\u0631 \u0627\u0644\u0645\u0631\u0628\u0639. \u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0644\u0633\u0643\u0646 \u0648\u0627\u0644\u0627\u0633\u062a\u062b\u0645\u0627\u0631 \u0644\u0644\u0625\u064a\u062c\u0627\u0631.",
    },
    district: { zh: "拉差贴威", ja: "ラーチャテウィ", ar: "\u0631\u0627\u062a\u0634\u0627\u062a\u064a\u0648\u064a" },
  },
  "rhythm-sathorn-rent": {
    title: {
      zh: "Rhythm 沙吞 2 卧 出租",
      ja: "Rhythm サトーン 2LDK 賃貸",
      ar: "Rhythm \u0633\u0627\u062a\u0648\u0631\u0646 \u063a\u0631\u0641\u062a\u0627\u0646 \u0644\u0644\u0625\u064a\u062c\u0627\u0631",
    },
    description: {
      en: "Sathorn condo with beautiful views near BTS Surasak. Stylishly furnished and move-in ready.",
      zh: "沙吞公寓，景观优美，近 BTS 素拉沙，精装拎包入住。",
      ja: "BTSスラサック近くのサトーンコンドミニアム。眺望良好、内装充実、即入居可。",
      ar: "\u0634\u0642\u0629 \u0641\u064a \u0633\u0627\u062a\u0648\u0631\u0646 \u0628\u0625\u0637\u0644\u0627\u0644\u0629 \u062c\u0645\u064a\u0644\u0629 \u0642\u0631\u0628 BTS \u0633\u0648\u0631\u0627\u0633\u0627\u0643. \u0645\u0624\u062b\u062b\u0629 \u0628\u0623\u0646\u0627\u0642\u0629 \u0648\u062c\u0627\u0647\u0632\u0629 \u0644\u0644\u0633\u0643\u0646.",
    },
    district: { zh: "沙吞", ja: "サトーン", ar: "\u0633\u0627\u062a\u0648\u0631\u0646" },
  },
  "the-room-phrom-phong-2br-sale": {
    title: {
      zh: "The Room 澎蓬 2 卧 出售 近 EmQuartier",
      ja: "The Room プロムポン 2LDK 売却 EmQuartier近く",
      ar: "The Room \u0641\u0631\u0648\u0645 \u0641\u0648\u0646\u063a \u063a\u0631\u0641\u062a\u0627\u0646 \u0644\u0644\u0628\u064a\u0639 \u0642\u0631\u0628 EmQuartier",
    },
    description: {
      en: "Premium condo near BTS Phrom Phong, walking distance to EmQuartier and Emporium. Beautifully furnished, ideal for living and rental investment.",
      zh: "精品高端公寓，近 BTS 澎蓬，步行可达 EmQuartier 与 Emporium，精装适合自住及出租投资。",
      ja: "BTSプロムポン近くのプレミアムコンドミニアム。EmQuartier・Emporiumまで徒歩圏。内装充実、自己居住・賃貸投資に最適。",
      ar: "\u0634\u0642\u0629 \u0628\u0631\u064a\u0645\u064a\u0648\u0645 \u0642\u0631\u0628 BTS \u0641\u0631\u0648\u0645 \u0641\u0648\u0646\u063a\u060c \u0639\u0644\u0649 \u0645\u0633\u0627\u0641\u0629 \u0645\u0634\u064a \u0645\u0646 EmQuartier \u0648Emporium. \u0645\u0624\u062b\u062b\u0629 \u0628\u0623\u0646\u0627\u0642\u0629\u060c \u0645\u062b\u0627\u0644\u064a\u0629 \u0644\u0644\u0633\u0643\u0646 \u0648\u0627\u0644\u0627\u0633\u062a\u062b\u0645\u0627\u0631 \u0644\u0644\u0625\u064a\u062c\u0627\u0631.",
    },
    district: { zh: "瓦他那", ja: "ワットタナ", ar: "\u0648\u0627\u062a\u062b\u0627\u0646\u0627" },
  },
  "noble-ploenchit-chidlom-1br-rent": {
    title: {
      zh: "Noble Ploenchit 近 BTS 奇隆 1 卧 出租",
      ja: "Noble Ploenchit BTSチットロム近く 1LDK 賃貸",
      ar: "Noble Ploenchit \u063a\u0631\u0641\u0629 \u0648\u0627\u062d\u062f\u0629 \u0644\u0644\u0625\u064a\u062c\u0627\u0631 \u0642\u0631\u0628 BTS \u062a\u0634\u064a\u062f\u0644\u0648\u0645",
    },
    description: {
      en: "Downtown condo near BTS Chidlom and Central Chidlom. Convenient transit, stunning city views, fully furnished.",
      zh: "市中心公寓，近 BTS 奇隆与 Central Chidlom，交通便利，城景优美，家具齐全。",
      ja: "BTSチットロム・Central Chidlom近くの都心コンドミニアム。アクセス良好、シティビュー、家具付き。",
      ar: "\u0634\u0642\u0629 \u0641\u064a \u0648\u0633\u0637 \u0627\u0644\u0645\u062f\u064a\u0646\u0629 \u0642\u0631\u0628 BTS \u062a\u0634\u064a\u062f\u0644\u0648\u0645 \u0648Central Chidlom. \u062a\u0646\u0642\u0644 \u0645\u0631\u064a\u062d \u0648\u0625\u0637\u0644\u0627\u0644\u0629 \u0645\u062f\u064a\u0646\u0629 \u0631\u0627\u0626\u0639\u0629 \u0648\u0645\u0624\u062b\u062b\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644.",
    },
    district: { zh: "巴吞旺", ja: "パトゥムワン", ar: "\u0628\u0627\u062b\u0648\u0645 \u0648\u0627\u0646" },
  },
  "the-line-ari-studio-rent": {
    title: {
      zh: "The Line 阿里 Studio 出租 咖啡馆区",
      ja: "The Line アーリー スタジオ 賃貸 カフェ街",
      ar: "The Line \u0622\u0631\u064a \u0627\u0633\u062a\u0648\u062f\u064a\u0648 \u0644\u0644\u0625\u064a\u062c\u0627\u0631 \u0641\u064a \u062d\u064a \u0627\u0644\u0645\u0642\u0627\u0647\u064a",
    },
    description: {
      en: "Modern studio near BTS Ari in a trendy cafe and dining district. Leafy atmosphere, ideal for young professionals.",
      zh: "现代 Studio，近 BTS 阿里，潮流咖啡馆与餐饮区，绿树成荫，适合年轻专业人士。",
      ja: "BTSアーリー近くのモダンスタジオ。カフェ・飲食店が集まるヒップなエリア。緑豊かで若手プロ向け。",
      ar: "\u0627\u0633\u062a\u0648\u062f\u064a\u0648 \u062d\u062f\u064a\u062b \u0642\u0631\u0628 BTS \u0622\u0631\u064a \u0641\u064a \u062d\u064a \u0645\u0642\u0627\u0647\u064a \u0648\u0645\u0637\u0627\u0639\u0645 \u0639\u0635\u0631\u064a. \u0623\u062c\u0648\u0627\u0621 \u062e\u0636\u0631\u0627\u0621\u060c \u0645\u062b\u0627\u0644\u064a \u0644\u0644\u0634\u0628\u0627\u0628 \u0627\u0644\u0645\u0647\u0646\u064a\u064a\u0646.",
    },
    district: { zh: "帕亚泰", ja: "パヤータイ", ar: "\u0641\u0627\u064a\u0627 \u062a\u0627\u064a" },
  },
};
