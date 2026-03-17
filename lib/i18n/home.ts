/**
 * Proposar Homepage Translation Dictionary
 * Covers the 6 highest-growth freelancer markets globally.
 * Languages: English · Portuguese (Brazil) · Spanish · Arabic · Hindi · French
 */

export type Locale = "en" | "pt" | "es" | "ar" | "hi" | "fr";

export interface HomeTranslations {
  dir: "ltr" | "rtl"; // Text direction
  nav: {
    home: string;
    howItWorks: string;
    features: string;
    pricing: string;
    blog: string;
    help: string;
    signIn: string;
    getStarted: string;
    dashboard: string;
  };
  announcement: {
    text: string;
    cta: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    subtitle: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    socialProof: string;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    watchDemo: string;
    steps: Array<{ title: string; desc: string }>;
  };
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Array<{ title: string; desc: string }>;
  };
}

const translations: Record<Locale, HomeTranslations> = {
  en: {
    dir: "ltr",
    nav: {
      home: "Home",
      howItWorks: "How It Works",
      features: "Features",
      pricing: "Pricing",
      blog: "Blog",
      help: "Help",
      signIn: "Sign In",
      getStarted: "Get Started",
      dashboard: "Dashboard",
    },
    announcement: {
      text: "🎉 Launch offer: Get 3 months free on any annual plan — ends soon",
      cta: "Claim offer →",
    },
    hero: {
      badge: "Trusted by 2,000+ freelancers worldwide",
      titleLine1: "The A to Z Workflow",
      titleHighlight: "To GET PAID.",
      subtitle: "Proposal → Contract → Invoice → Cash.",
      description:
        'Stop the "Sunday Night Anxiety" of wondering where your next lead is coming from. Proposar uses AI to draft elite proposals in 60s, then acts as your Digital Bodyguard — handling WhatsApp follow-ups and Smart Contracts so you get paid for your work, not ghosted.',
      ctaPrimary: "Generate Free Proposal →",
      ctaSecondary: "See live demo",
      socialProof: "Free plan available · No credit card required",
    },
    howItWorks: {
      eyebrow: "THE PROCESS",
      title: "From Brief to Deal in 60 Seconds",
      subtitle: "No templates to fight with. No blank page anxiety. Just results.",
      watchDemo: "Watch 2-min Demo",
      steps: [
        { title: "AI Writes the Strategy", desc: "Enter 3 project details. Our AI crafts a persuasive, high-ticket proposal in 60 seconds that beats any standard template." },
        { title: "Universal Delivery", desc: "Share via WhatsApp, Professional Email, or Secure Link. Track exactly when they open it and how long they spend reading." },
        { title: "Smart Contract", desc: "One click to accept instantly generates a legal-grade contract from the same deal. Lock in terms before you start work." },
        { title: "Get Paid, Not Ghosted", desc: "Generate an invoice instantly. One flow: Proposal → Contract → Cash. We focus on the A-to-Z of your deal's success." },
      ],
    },
    features: {
      eyebrow: "FEATURES",
      title: "Everything You Need to Win & Get Paid",
      subtitle: "From the first proposal to the final payment — all in one place.",
      items: [
        { title: "Skip the Spam Filter", desc: "Stop wondering if they saw your email. Deliver proposals directly to their WhatsApp or via a professional secure link for instant opens." },
        { title: "Eliminate the Guesswork", desc: "Know exactly when your client is reading. See which sections they spend the most time on, so you can call them while they're still hot." },
        { title: "The 'Yes' Shortcut", desc: "Remove the friction. Clients can accept your proposal in one click from their phone — no printing, no signing PDFs, no delays." },
        { title: "Elite Branding", desc: "Stand out from the 'generic document' crowd. Export pixel-perfect PDFs that make you look like a top-tier agency from day one." },
        { title: "Your Sales Cockpit", desc: "Track every deal in one view. Identify which clients are ready to close and who needs a nudge before they go cold." },
        { title: "Automatic Nudges", desc: "Never feel 'annoying' or desperate again. Set automatic follow-ups that handle the chasing for you while you stay professional." },
        { title: "The Legal Guard", desc: "Protect your work. The second they accept, a legal-grade contract is ready. No more working without a net — you're covered from day one." },
        { title: "Payment Security", desc: "The A-to-Z flow: Proposal → Contract → Invoice. Ensure you get paid for every hour you work. No more ghosting on the final invoice." },
      ],
    },
  },

  // =============================================
  // 🇧🇷 PORTUGUESE (Brazil) — 2nd largest freelancer population globally
  // =============================================
  pt: {
    dir: "ltr",
    nav: {
      home: "Início",
      howItWorks: "Como Funciona",
      features: "Funcionalidades",
      pricing: "Preços",
      blog: "Blog",
      help: "Ajuda",
      signIn: "Entrar",
      getStarted: "Começar Grátis",
      dashboard: "Painel",
    },
    announcement: {
      text: "🎉 Oferta de lançamento: 3 meses grátis em qualquer plano anual — por tempo limitado",
      cta: "Aproveitar →",
    },
    hero: {
      badge: "Confiado por +2.000 freelancers no mundo todo",
      titleLine1: "O Fluxo Completo",
      titleHighlight: "Para RECEBER.",
      subtitle: "Proposta → Contrato → Fatura → Dinheiro.",
      description:
        "Chega de ansiedade de domingo à noite sem saber de onde vem o próximo cliente. O Proposar usa IA para criar propostas vencedoras em 60 segundos e age como seu Guarda-Costas Digital — fazendo follow-ups no WhatsApp e gerando Contratos Inteligentes para você ser pago, não ignorado.",
      ctaPrimary: "Gerar Proposta Grátis →",
      ctaSecondary: "Ver demonstração",
      socialProof: "Plano gratuito disponível · Sem cartão de crédito",
    },
    howItWorks: {
      eyebrow: "O PROCESSO",
      title: "Da Briefing ao Fechamento em 60 Segundos",
      subtitle: "Sem templates para brigar. Sem ansiedade de página em branco. Só resultados.",
      watchDemo: "Ver Demo de 2 min",
      steps: [
        { title: "IA Cria a Estratégia", desc: "Insira 3 detalhes do projeto. Nossa IA cria uma proposta persuasiva e de alto valor em 60 segundos." },
        { title: "Entrega Universal", desc: "Compartilhe via WhatsApp, E-mail Profissional ou Link Seguro. Saiba exatamente quando abriram e quanto tempo leram." },
        { title: "Contrato Inteligente", desc: "Um clique para aceitar gera instantaneamente um contrato com validade jurídica. Proteja-se antes de começar." },
        { title: "Receba, Não Seja Ignorado", desc: "Gere uma fatura instantaneamente. Um fluxo: Proposta → Contrato → Dinheiro. Do início ao fim." },
      ],
    },
    features: {
      eyebrow: "FUNCIONALIDADES",
      title: "Tudo que Você Precisa para Ganhar e Receber",
      subtitle: "Da primeira proposta ao pagamento final — tudo em um só lugar.",
      items: [
        { title: "Ignore o Filtro de Spam", desc: "Pare de se perguntar se viram seu e-mail. Entregue propostas direto no WhatsApp ou por link seguro profissional." },
        { title: "Elimine as Incertezas", desc: "Saiba exatamente quando seu cliente está lendo. Veja em quais seções ele passa mais tempo." },
        { title: "O Atalho do 'Sim'", desc: "Remova o atrito. Clientes aceitam sua proposta em um clique pelo celular — sem imprimir, sem assinar PDF." },
        { title: "Marca Elite", desc: "Destaque-se dos documentos genéricos. Exporte PDFs perfeitos que fazem você parecer uma agência top." },
        { title: "Seu Cockpit de Vendas", desc: "Acompanhe cada negócio em uma visão. Veja quais clientes estão prontos para fechar." },
        { title: "Lembretes Automáticos", desc: "Nunca se sinta inconveniente. Configure follow-ups automáticos enquanto mantém o profissionalismo." },
        { title: "A Guarda Jurídica", desc: "Proteja seu trabalho. No momento que aceitam, um contrato jurídico já está pronto. Sem trabalhar sem proteção." },
        { title: "Segurança no Pagamento", desc: "O fluxo completo: Proposta → Contrato → Fatura. Garanta que você seja pago por cada hora trabalhada." },
      ],
    },
  },

  // =============================================
  // 🇪🇸 SPANISH — Mexico, Spain, Colombia, Argentina, LatAm
  // =============================================
  es: {
    dir: "ltr",
    nav: {
      home: "Inicio",
      howItWorks: "Cómo Funciona",
      features: "Características",
      pricing: "Precios",
      blog: "Blog",
      help: "Ayuda",
      signIn: "Iniciar Sesión",
      getStarted: "Comenzar Gratis",
      dashboard: "Panel",
    },
    announcement: {
      text: "🎉 Oferta de lanzamiento: 3 meses gratis en cualquier plan anual — por tiempo limitado",
      cta: "Reclamar oferta →",
    },
    hero: {
      badge: "Confiado por +2.000 freelancers en todo el mundo",
      titleLine1: "El Flujo Completo",
      titleHighlight: "Para COBRAR.",
      subtitle: "Propuesta → Contrato → Factura → Dinero.",
      description:
        'Termina la ansiedad del domingo por la noche preguntándote de dónde vendrá tu próximo cliente. Proposar usa IA para crear propuestas ganadoras en 60 segundos y actúa como tu Guardaespaldas Digital — haciendo seguimientos por WhatsApp y generando Contratos Inteligentes para que cobres por tu trabajo, sin que te ignoren.',
      ctaPrimary: "Generar Propuesta Gratis →",
      ctaSecondary: "Ver demostración",
      socialProof: "Plan gratuito disponible · Sin tarjeta de crédito",
    },
    howItWorks: {
      eyebrow: "EL PROCESO",
      title: "Del Briefing al Cierre en 60 Segundos",
      subtitle: "Sin plantillas con las que pelear. Sin ansiedad por la página en blanco. Solo resultados.",
      watchDemo: "Ver Demo de 2 min",
      steps: [
        { title: "La IA Crea la Estrategia", desc: "Ingresa 3 detalles del proyecto. Nuestra IA crea una propuesta persuasiva de alto valor en 60 segundos." },
        { title: "Entrega Universal", desc: "Comparte por WhatsApp, Email Profesional o Enlace Seguro. Rastreo exacto de cuándo abrieron y cuánto leyeron." },
        { title: "Contrato Inteligente", desc: "Un clic para aceptar genera al instante un contrato con validez legal. Protégete antes de empezar." },
        { title: "Cobra, No Te Ignoren", desc: "Genera una factura al instante. Un flujo: Propuesta → Contrato → Dinero. De principio a fin." },
      ],
    },
    features: {
      eyebrow: "CARACTERÍSTICAS",
      title: "Todo lo que Necesitas para Ganar y Cobrar",
      subtitle: "Desde la primera propuesta hasta el pago final — todo en un solo lugar.",
      items: [
        { title: "Evita el Filtro de Spam", desc: "Deja de preguntarte si vieron tu email. Entrega propuestas directo a su WhatsApp o por enlace seguro profesional." },
        { title: "Elimina la Incertidumbre", desc: "Sabe exactamente cuándo tu cliente está leyendo. Ve en qué secciones pasa más tiempo." },
        { title: "El Atajo del 'Sí'", desc: "Elimina el fricción. Los clientes aceptan tu propuesta con un clic desde su teléfono — sin imprimir, sin firmar PDFs." },
        { title: "Marca Elite", desc: "Destácate de los documentos genéricos. Exporta PDFs perfectos que te hacen ver como una agencia top." },
        { title: "Tu Cabina de Ventas", desc: "Rastrea cada negocio en una vista. Identifica qué clientes están listos para cerrar." },
        { title: "Recordatorios Automáticos", desc: "Nunca te sientas molesto. Configura seguimientos automáticos mientras mantienes el profesionalismo." },
        { title: "La Guardia Legal", desc: "Protege tu trabajo. En el momento que aceptan, un contrato legal ya está listo. Sin trabajar sin protección." },
        { title: "Seguridad de Pago", desc: "El flujo completo: Propuesta → Contrato → Factura. Asegúrate de que te paguen por cada hora trabajada." },
      ],
    },
  },

  // =============================================
  // 🇦🇪 ARABIC — UAE, Saudi Arabia, Egypt (RTL)
  // =============================================
  ar: {
    dir: "rtl",
    nav: {
      home: "الرئيسية",
      howItWorks: "كيف يعمل",
      features: "المميزات",
      pricing: "الأسعار",
      blog: "المدونة",
      help: "المساعدة",
      signIn: "تسجيل الدخول",
      getStarted: "ابدأ مجاناً",
      dashboard: "لوحة التحكم",
    },
    announcement: {
      text: "🎉 عرض الإطلاق: احصل على 3 أشهر مجانية مع أي خطة سنوية — لفترة محدودة",
      cta: "احصل على العرض ←",
    },
    hero: {
      badge: "موثوق من قبل +2,000 فريلانسر حول العالم",
      titleLine1: "سير العمل الكامل",
      titleHighlight: "للحصول على المال.",
      subtitle: "اقتراح ← عقد ← فاتورة ← مدفوعات.",
      description:
        "توقف عن قلق ليلة الأحد بشأن عميلك القادم. يستخدم Proposar الذكاء الاصطناعي لإنشاء عروض احترافية في 60 ثانية، ثم يعمل كـ حارسك الرقمي — يتابع العملاء عبر واتساب وينشئ عقوداً ذكية لتحصل على أجرك.",
      ctaPrimary: "إنشاء عرض مجاني ←",
      ctaSecondary: "شاهد العرض التجريبي",
      socialProof: "خطة مجانية متاحة · لا حاجة لبطاقة ائتمان",
    },
    howItWorks: {
      eyebrow: "العملية",
      title: "من الفكرة إلى الإغلاق في 60 ثانية",
      subtitle: "لا نماذج معقدة. لا قلق من الصفحة الفارغة. فقط نتائج.",
      watchDemo: "شاهد عرض دقيقتين",
      steps: [
        { title: "الذكاء الاصطناعي يكتب الاستراتيجية", desc: "أدخل 3 تفاصيل عن مشروعك. يصنع ذكاؤنا الاصطناعي عرضًا مقنعًا وعالي القيمة في 60 ثانية." },
        { title: "توصيل شامل", desc: "شارك عبر واتساب أو بريد إلكتروني احترافي أو رابط آمن. اعرف متى فتحه العميل وكم استغرق وقته." },
        { title: "عقد ذكي", desc: "نقرة واحدة للقبول تُنشئ فورًا عقدًا قانونيًا من نفس الصفقة. احمِ نفسك قبل بدء العمل." },
        { title: "احصل على أجرك", desc: "أنشئ فاتورة فورًا. تدفق واحد: اقتراح ← عقد ← مدفوعات. من البداية إلى النهاية." },
      ],
    },
    features: {
      eyebrow: "المميزات",
      title: "كل ما تحتاجه للفوز والحصول على أجرك",
      subtitle: "من أول عرض حتى الدفع الأخير — كل شيء في مكان واحد.",
      items: [
        { title: "تجاوز فلتر البريد المزعج", desc: "لا تتساءل إذا رأوا بريدك. سلّم العروض مباشرة على واتساب أو رابط احترافي آمن." },
        { title: "تخلص من الغموض", desc: "اعرف بالضبط متى يقرأ عميلك. شاهد أي الأقسام يقضي فيها وقتًا أطول." },
        { title: "اختصار نعم", desc: "أزل العوائق. يمكن للعملاء قبول عرضك بنقرة واحدة من هاتفهم." },
        { title: "علامة تجارية راقية", desc: "تميز عن الوثائق الاعتيادية. صدّر ملفات PDF مثالية تجعلك تبدو كوكالة من الطراز الأول." },
        { title: "قمرة التحكم في المبيعات", desc: "تتبع كل صفقة في عرض واحد. حدد أي العملاء مستعد للإغلاق." },
        { title: "تذكيرات تلقائية", desc: "لا تشعر بالإزعاج أبدًا. اضبط متابعات تلقائية تتولى المطاردة نيابةً عنك." },
        { title: "الحارس القانوني", desc: "احمِ عملك. فور القبول، يكون العقد القانوني جاهزًا. لا عمل بدون حماية." },
        { title: "أمان الدفع", desc: "التدفق الكامل: اقتراح ← عقد ← فاتورة. تأكد من حصولك على أجرك عن كل ساعة عمل." },
      ],
    },
  },

  // =============================================
  // 🇮🇳 HINDI — India (15M+ freelancers, fastest growth)
  // =============================================
  hi: {
    dir: "ltr",
    nav: {
      home: "होम",
      howItWorks: "यह कैसे काम करता है",
      features: "विशेषताएं",
      pricing: "मूल्य",
      blog: "ब्लॉग",
      help: "सहायता",
      signIn: "लॉग इन करें",
      getStarted: "निःशुल्क शुरू करें",
      dashboard: "डैशबोर्ड",
    },
    announcement: {
      text: "🎉 लॉन्च ऑफर: किसी भी वार्षिक प्लान पर 3 महीने मुफ्त पाएं — जल्द समाप्त",
      cta: "ऑफर लें →",
    },
    hero: {
      badge: "दुनिया भर के 2,000+ फ्रीलांसरों द्वारा विश्वसनीय",
      titleLine1: "A से Z तक का वर्कफ्लो",
      titleHighlight: "पैसा पाने के लिए.",
      subtitle: "प्रपोज़ल → कॉन्ट्रैक्ट → इनवॉइस → भुगतान.",
      description:
        'रविवार की रात की बेचैनी खत्म करें। Proposar AI से 60 सेकंड में शानदार प्रपोज़ल तैयार करता है और आपके Digital Bodyguard की तरह काम करता है — WhatsApp पर फॉलो-अप करता है और Smart Contracts बनाता है ताकि आपको काम का पैसा मिले, ghosting नहीं।',
      ctaPrimary: "मुफ्त प्रपोज़ल बनाएं →",
      ctaSecondary: "लाइव डेमो देखें",
      socialProof: "मुफ्त प्लान उपलब्ध · क्रेडिट कार्ड की जरूरत नहीं",
    },
    howItWorks: {
      eyebrow: "प्रक्रिया",
      title: "60 सेकंड में Brief से Deal तक",
      subtitle: "कोई टेम्पलेट से लड़ाई नहीं। खाली पेज की चिंता नहीं। सिर्फ नतीजे।",
      watchDemo: "2 मिनट का डेमो देखें",
      steps: [
        { title: "AI रणनीति लिखता है", desc: "3 प्रोजेक्ट डिटेल्स दर्ज करें। हमारी AI 60 सेकंड में एक प्रभावशाली, हाई-वैल्यू प्रपोज़ल तैयार करती है।" },
        { title: "Universal Delivery", desc: "WhatsApp, Professional Email या Secure Link से शेयर करें। जानें कब और कितनी देर पढ़ा।" },
        { title: "Smart Contract", desc: "एक क्लिक में Legal Contract तैयार। काम शुरू करने से पहले खुद को protect करें।" },
        { title: "पैसा लें, Ghosting नहीं", desc: "तुरंत Invoice बनाएं। एक flow: Proposal → Contract → Cash। शुरू से अंत तक।" },
      ],
    },
    features: {
      eyebrow: "विशेषताएं",
      title: "जीतने और पैसा पाने के लिए सब कुछ",
      subtitle: "पहले प्रपोज़ल से आखिरी भुगतान तक — सब एक जगह।",
      items: [
        { title: "Spam Filter को बाईपास करें", desc: "इस चिंता से मुक्त हों कि Email मिली या नहीं। WhatsApp पर या Secure Link से तुरंत डिलीवर करें।" },
        { title: "अनिश्चितता खत्म करें", desc: "जानें कब आपका Client पढ़ रहा है। देखें किस Section पर सबसे ज्यादा समय बिताया।" },
        { title: "हां का Shortcut", desc: "झंझट हटाएं। Client एक क्लिक में Phone से Accept कर सकते हैं — PDF प्रिंट नहीं करना।" },
        { title: "Elite Branding", desc: "सामान्य Documents से अलग दिखें। Pixel-perfect PDF Export जो आपको Top Agency जैसा दिखाए।" },
        { title: "आपका Sales Cockpit", desc: "हर Deal एक जगह Track करें। जानें कौन Close करने के लिए तैयार है।" },
        { title: "Automatic Reminders", desc: "कभी तंग-करने वाला महसूस न करें। Automatic Follow-ups set करें जो Chasing करें।" },
        { title: "Legal Guard", desc: "अपना काम Protect करें। Accept होते ही Legal Contract तैयार। बिना Protection के काम नहीं।" },
        { title: "Payment Security", desc: "A से Z flow: Proposal → Contract → Invoice। हर घंटे का पैसा सुनिश्चित करें।" },
      ],
    },
  },

  // =============================================
  // 🇫🇷 FRENCH — France, Belgium, Canada (Quebec), West Africa
  // =============================================
  fr: {
    dir: "ltr",
    nav: {
      home: "Accueil",
      howItWorks: "Comment ça marche",
      features: "Fonctionnalités",
      pricing: "Tarifs",
      blog: "Blog",
      help: "Aide",
      signIn: "Se connecter",
      getStarted: "Commencer Gratuitement",
      dashboard: "Tableau de bord",
    },
    announcement: {
      text: "🎉 Offre de lancement : 3 mois offerts sur tout abonnement annuel — limité dans le temps",
      cta: "Profiter de l'offre →",
    },
    hero: {
      badge: "Utilisé par +2 000 freelances dans le monde",
      titleLine1: "Le flux de A à Z",
      titleHighlight: "Pour être PAYÉ.",
      subtitle: "Proposition → Contrat → Facture → Paiement.",
      description:
        "Dites adieu à l'angoisse du dimanche soir sans savoir d'où viendra votre prochain client. Proposar utilise l'IA pour rédiger des propositions gagnantes en 60 secondes, puis agit comme votre Garde du Corps Digital — gérant les relances WhatsApp et les Contrats Intelligents pour que vous soyez payé, pas ignoré.",
      ctaPrimary: "Créer une Proposition Gratuite →",
      ctaSecondary: "Voir la démo",
      socialProof: "Plan gratuit disponible · Sans carte de crédit",
    },
    howItWorks: {
      eyebrow: "LE PROCESSUS",
      title: "Du Brief à la Signature en 60 Secondes",
      subtitle: "Pas de modèles à combattre. Pas d'angoisse de la page blanche. Que des résultats.",
      watchDemo: "Regarder la démo de 2 min",
      steps: [
        { title: "L'IA Rédige la Stratégie", desc: "Entrez 3 détails du projet. Notre IA crée une proposition persuasive et à forte valeur en 60 secondes." },
        { title: "Livraison Universelle", desc: "Partagez par WhatsApp, Email Professionnel ou Lien Sécurisé. Sachez exactement quand ils l'ont ouvert." },
        { title: "Contrat Intelligent", desc: "Un clic pour accepter génère instantanément un contrat juridique valide. Protégez-vous avant de commencer." },
        { title: "Soyez Payé, Sans Ghosting", desc: "Générez une facture instantanément. Un flux : Proposition → Contrat → Paiement. Du début à la fin." },
      ],
    },
    features: {
      eyebrow: "FONCTIONNALITÉS",
      title: "Tout ce qu'il faut pour Gagner et être Payé",
      subtitle: "De la première proposition au dernier paiement — tout en un seul endroit.",
      items: [
        { title: "Contournez le Filtre Anti-Spam", desc: "Fini de vous demander s'ils ont vu votre email. Livrez vos propositions sur WhatsApp ou via un lien pro." },
        { title: "Éliminez les Incertitudes", desc: "Sachez exactement quand votre client lit. Voyez quelles sections retiennent le plus son attention." },
        { title: "Le Raccourci du 'Oui'", desc: "Supprimez les frictions. Les clients acceptent votre proposition en un clic depuis leur téléphone." },
        { title: "Image de Marque Elite", desc: "Démarquez-vous des documents génériques. Exportez des PDFs parfaits qui vous font ressembler à une agence top." },
        { title: "Votre Cockpit Commercial", desc: "Suivez chaque affaire en un coup d'œil. Identifiez les clients prêts à signer." },
        { title: "Relances Automatiques", desc: "Ne semandez plus jamais importun. Configurez des suivis automatiques qui gèrent la relance à votre place." },
        { title: "La Protection Juridique", desc: "Protégez votre travail. Dès l'acceptation, un contrat juridique est prêt. Plus de travail sans filet." },
        { title: "Sécurité des Paiements", desc: "Le flux complet : Proposition → Contrat → Facture. Garantissez votre paiement pour chaque heure travaillée." },
      ],
    },
  },
};

export const LANGUAGES: { code: Locale; label: string; flag: string; country: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸", country: "Global" },
  { code: "pt", label: "Português", flag: "🇧🇷", country: "Brasil" },
  { code: "es", label: "Español", flag: "🇪🇸", country: "LatAm" },
  { code: "ar", label: "العربية", flag: "🇦🇪", country: "UAE" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳", country: "India" },
  { code: "fr", label: "Français", flag: "🇫🇷", country: "France" },
];

export function getTranslations(locale: Locale): HomeTranslations {
  return translations[locale] ?? translations.en;
}
