/**
 * Proposar Global Translation Dictionary
 * Covers the 6 highest-growth freelancer markets globally.
 * Languages: English · Portuguese (Brazil) · Spanish · Arabic · Hindi · French
 */

export type Locale = "en" | "pt" | "es" | "ar" | "hi" | "fr";

export interface Translations {
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
  dashboard: {
    sidebar: {
      dashboard: string;
      proposals: string;
      newProposal: string;
      pipeline: string;
      clients: string;
      analytics: string;
      contracts: string;
      invoices: string;
      templates: string;
      referrals: string;
      feedback: string;
      billing: string;
      settings: string;
      helpSupport: string;
      searchHint: string;
      upgradePro: string;
      freePlanMsg: string;
    };
    topbar: {
      searchPlaceholder: string;
      newProposal: string;
      help: string;
      profile: string;
      billing: string;
      signOut: string;
      notifications: string;
      titles: Record<string, string>;
    };
    stats: {
      totalProposals: string;
      winRate: string;
      viewed: string;
      valueWon: string;
      thisWeek: string;
      createFirst: string;
      vsLastMonth: string;
      noData: string;
      reading: string;
    };
    recentProposals: {
      title: string;
      viewAll: string;
      empty: string;
      headers: {
        client: string;
        type: string;
        value: string;
        status: string;
        sent: string;
        actions: string;
      };
      status: {
        draft: string;
        sent: string;
        accepted: string;
        signed: string;
        declined: string;
        paid: string;
        overdue: string;
        cancelled: string;
      };
    };
    welcome: {
      title: string;
      subtitle: string;
      step1: string;
      step2: string;
      step3: string;
      cta: string;
      later: string;
    };
    attention: {
      title: string;
      allCaughtUp: string;
      daysSince: string;
      followUp: string;
    };
    clientsPage: {
      title: string;
      addClient: string;
      searchPlaceholder: string;
      sortOptions: {
        activity: string;
        nameAZ: string;
        nameZA: string;
        proposalsHigh: string;
        valueHigh: string;
      };
      loading: string;
      empty: string;
      headers: {
        name: string;
        company: string;
        email: string;
        proposals: string;
        winRate: string;
        totalValue: string;
        activity: string;
        actions: string;
      };
      actions: {
        edit: string;
        delete: string;
      };
      modal: {
        addTitle: string;
        editTitle: string;
        deleteTitle: string;
        deleteConfirm: string;
        nameLabel: string;
        companyLabel: string;
        emailLabel: string;
        notesLabel: string;
        save: string;
        cancel: string;
      }
    };
    contractsPage: {
      title: string;
      newContract: string;
      loading: string;
      empty: string;
      createFirst: string;
      retry: string;
      headers: {
        title: string;
        client: string;
        status: string;
        created: string;
        actions: string;
      };
      actions: {
        view: string;
      };
    };
    invoicesPage: {
      title: string;
      newInvoice: string;
      empty: string;
      loading: string;
      createFirst: string;
      retry: string;
      headers: {
        number: string;
        title: string;
        client: string;
        amount: string;
        status: string;
        due: string;
        actions: string;
      };
      actions: {
        manage: string;
        public: string;
        pdf: string;
      };
    };
    settingsPage: {
      title: string;
      tabs: {
        profile: string;
        branding: string;
        defaults: string;
        notifications: string;
        billing: string;
        integrations: string;
        account: string;
      };
      profile: {
        title: string;
        fullName: string;
        emailReadOnly: string;
        businessName: string;
        businessType: string;
        website: string;
        phone: string;
        bio: string;
        city: string;
        country: string;
        countryPlaceholder: string;
        gdprMode: string;
        gdprHint: string;
      };
      branding: {
        title: string;
        logoLabel: string;
        brandColor: string;
        signatureText: string;
        signaturePlaceholder: string;
        addressLabel: string;
        paymentTerms: string;
        currency: string;
      };
      defaults: {
        title: string;
        tone: string;
        sections: string;
        expiryDays: string;
        expiryHint: string;
        followUpLabel: string;
        followUpDays: string;
      };
      notifications: {
        title: string;
        proposalViewed: string;
        proposalAccepted: string;
        proposalDeclined: string;
        proposalExpired: string;
        weeklySummary: string;
        productUpdates: string;
      };
      billing: {
        title: string;
        currentPlan: string;
        nextBilling: string;
        usageThisMonth: string;
        usageLabel: string;
        usageLabelOf: string;
        manageButton: string;
        manageHint: string;
        upgradeLink: string;
        upgradeSuffix: string;
      };
      integrations: {
        description: string;
        zapierButton: string;
        comingSoon: string;
      };
      account: {
        title: string;
        changePassword: string;
        passwordHint: string;
        resetButton: string;
        changeEmail: string;
        emailHint: string;
        exportTitle: string;
        exportHint: string;
        exportButton: string;
        deleteTitle: string;
        deleteHint: string;
        deletePlaceholder: string;
        deleteButton: string;
      };
      common: {
        save: string;
        cancel: string;
        loading: string;
        saving: string;
      };
    };
  };
  proposalForm: {
    onboardingMsg: string;
    sections: {
      client: string;
      project: string;
      pricing: string;
    };
    fields: {
      existingClient: string;
      selectClient: string;
      loadingClients: string;
      noClients: string;
      clientName: string;
      clientCompany: string;
      clientEmail: string;
      industry: string;
      projectTitle: string;
      projectType: string;
      projectTypeHint: string;
      suggestedFor: string;
      whatDoYouDo: string;
      whatDoYouDoHint: string;
      scope: string;
      budget: string;
      budgetType: string;
      timeline: string;
      startDate: string;
      paymentTerms: string;
      lineItemsEnabled: string;
    };
    placeholders: {
      clientName: string;
      clientCompany: string;
      clientEmail: string;
      projectTitle: string;
      scope: string;
      budget: string;
    };
    buttons: {
      generate: string;
      generating: string;
    };
  };
  ai: {
    generating: string;
    systemPrompt: string;
  };
}

const translations: Record<Locale, Translations> = {
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
    dashboard: {
      sidebar: {
        dashboard: "Dashboard",
        proposals: "Proposals",
        newProposal: "New Proposal",
        pipeline: "Pipeline",
        clients: "Clients",
        analytics: "Analytics",
        contracts: "Contracts",
        invoices: "Invoices",
        templates: "Templates",
        referrals: "Earn with Referrals",
        feedback: "User Feedback",
        billing: "Billing & Plans",
        settings: "Settings",
        helpSupport: "Help & Support",
        searchHint: "⌘K to search",
        upgradePro: "Upgrade to Pro →",
        freePlanMsg: "You're on Free.",
      },
      topbar: {
        searchPlaceholder: "Search...",
        newProposal: "New Proposal",
        help: "Help",
        profile: "Profile",
        billing: "Billing",
        signOut: "Sign out",
        notifications: "Notifications",
        titles: {
          "/dashboard": "Dashboard",
          "/proposals": "Proposals",
          "/proposals/new": "New Proposal",
          "/clients": "Clients",
          "/templates": "Templates",
          "/settings": "Settings",
          "/analytics": "Analytics",
          "/contracts": "Contracts",
          "/invoices": "Invoices",
          "/pipeline": "Pipeline",
          "/referrals": "Referrals",
          "/billing": "Billing",
        }
      },
      stats: {
        totalProposals: "Total Proposals",
        winRate: "Win Rate",
        viewed: "Proposals Viewed",
        valueWon: "Total Value Won",
        thisWeek: "this week",
        createFirst: "Create your first",
        vsLastMonth: "vs last month",
        noData: "No data yet",
        reading: "clients are reading",
      },
      recentProposals: {
        title: "Recent Proposals",
        viewAll: "View all →",
        empty: "No proposals yet.",
        headers: {
          client: "Client",
          type: "Type",
          value: "Value",
          status: "Status",
          sent: "Sent",
          actions: "Actions",
        },
        status: {
          draft: "Draft",
          sent: "Sent",
          accepted: "Accepted",
          signed: "Signed",
          declined: "Declined",
          paid: "Paid",
          overdue: "Overdue",
          cancelled: "Cancelled",
        },
      },
      welcome: {
        title: "Welcome to Proposar!",
        subtitle: "Get started in three steps:",
        step1: "Complete your profile in Settings",
        step2: "Create your first proposal",
        step3: "Share the link and track when clients open it",
        cta: "Create your first proposal",
        later: "Later",
      },
      attention: {
        title: "Proposals Needing Attention",
        allCaughtUp: "🎉 All caught up! No proposals need follow-up.",
        daysSince: "days since sent",
        followUp: "Send Follow-up",
      },
      clientsPage: {
        title: "Clients",
        addClient: "Add client",
        searchPlaceholder: "Search clients...",
        sortOptions: {
          activity: "Last activity",
          nameAZ: "Name A–Z",
          nameZA: "Name Z–A",
          proposalsHigh: "Proposals (high)",
          valueHigh: "Value (high)",
        },
        loading: "Loading clients...",
        empty: "No clients yet. Add your first client.",
        headers: {
          name: "Name",
          company: "Company",
          email: "Email",
          proposals: "Proposals",
          winRate: "Win rate",
          totalValue: "Total value",
          activity: "Last activity",
          actions: "Actions",
        },
        actions: {
          edit: "Edit",
          delete: "Delete",
        },
        modal: {
          addTitle: "Add Client",
          editTitle: "Edit Client",
          deleteTitle: "Delete Client",
          deleteConfirm: "Delete this client? Proposals linked to them will remain.",
          nameLabel: "Name *",
          companyLabel: "Company",
          emailLabel: "Email",
          notesLabel: "Notes",
          save: "Save",
          cancel: "Cancel",
        },
      },
      contractsPage: {
        title: "Contracts",
        newContract: "New Contract",
        loading: "Loading contracts...",
        empty: "No contracts yet.",
        createFirst: "Create your first contract",
        retry: "Retry",
        headers: {
          title: "Title",
          client: "Client",
          status: "Status",
          created: "Created",
          actions: "Actions",
        },
        actions: {
          view: "View",
        },
      },
      invoicesPage: {
        title: "Invoices",
        newInvoice: "New Invoice",
        empty: "No invoices yet.",
        loading: "Loading invoices...",
        retry: "Retry",
        createFirst: "Create your first invoice",
        headers: {
          number: "#",
          title: "Title",
          client: "Client",
          amount: "Amount",
          status: "Status",
          due: "Due",
          actions: "Actions",
        },
        actions: {
          manage: "Manage",
          public: "Public",
          pdf: "PDF",
        },
      },
      settingsPage: {
        title: "Settings",
        tabs: {
          profile: "Profile",
          branding: "Business Branding",
          defaults: "Proposal Defaults",
          notifications: "Notifications",
          billing: "Billing",
          integrations: "Integrations",
          account: "Account",
        },
        profile: {
          title: "Profile",
          fullName: "Full name",
          emailReadOnly: "Email (read-only)",
          businessName: "Business name",
          businessType: "Business type",
          website: "Website",
          phone: "Phone",
          bio: "Bio (About Us in proposals)",
          city: "City",
          country: "Country",
          countryPlaceholder: "e.g. United States, India",
          gdprMode: "Enable GDPR/Globalization Compliance Mode",
          gdprHint: "(Adds privacy notices & handles data as per international standards)",
        },
        branding: {
          title: "Business Branding",
          logoLabel: "Logo (shown on proposals)",
          brandColor: "Brand color (accent on proposals)",
          signatureText: "Default signature text",
          signaturePlaceholder: "Best regards, [Your Name]",
          addressLabel: "Business address (on proposals)",
          paymentTerms: "Default payment terms",
          currency: "Default currency",
        },
        defaults: {
          title: "Proposal Defaults",
          tone: "Default tone",
          sections: "Default sections to include",
          expiryDays: "Default expiry days",
          expiryHint: "Proposals expire after this many days",
          followUpLabel: "Auto follow-up reminder",
          followUpDays: "Days to wait before reminder",
        },
        notifications: {
          title: "Notifications",
          proposalViewed: "When client views my proposal",
          proposalAccepted: "When proposal is accepted",
          proposalDeclined: "When proposal is declined",
          proposalExpired: "When proposal expires",
          weeklySummary: "Weekly summary email",
          productUpdates: "Product updates & tips",
        },
        billing: {
          title: "Billing",
          currentPlan: "Current plan",
          nextBilling: "Next billing date",
          usageThisMonth: "Usage this month",
          usageLabel: "proposals",
          usageLabelOf: "of",
          manageButton: "Manage Billing",
          manageHint: "Update payment, view invoices, or cancel.",
          upgradeLink: "Upgrade",
          upgradeSuffix: "for more proposals.",
        },
        integrations: {
          description: "Connect your tools. Use Zapier webhooks to automate proposals with your CRM or workflow.",
          zapierButton: "Webhooks →",
          comingSoon: "Coming Soon",
        },
        account: {
          title: "Account",
          changePassword: "Change password",
          passwordHint: "We'll send a reset link to your email. Check your email after clicking below.",
          resetButton: "Send password reset email",
          changeEmail: "Change email",
          emailHint: "Contact support to change your email address.",
          exportTitle: "Export data (GDPR)",
          exportHint: "Download all your profile, proposals, clients, and templates as JSON.",
          exportButton: "Export my data",
          deleteTitle: "Delete account",
          deleteHint: "Permanently delete your account and all data. This cannot be undone.",
          deletePlaceholder: 'Type "DELETE" to confirm',
          deleteButton: "Delete account",
        },
        common: {
          save: "Save",
          cancel: "Cancel",
          loading: "Loading...",
          saving: "Saving...",
        },
      },
    },
    proposalForm: {
      onboardingMsg: "Using onboarding defaults for tone, sections, currency, payment terms, and expiry date. You can edit everything below for this proposal.",
      sections: {
        client: "About the Client",
        project: "About the Project",
        pricing: "Pricing & Timeline",
      },
      fields: {
        existingClient: "Select existing client",
        selectClient: "Select a client",
        loadingClients: "Loading clients...",
        noClients: "No clients found yet. Add clients first from the Clients page.",
        clientName: "Client Name *",
        clientCompany: "Client Company",
        clientEmail: "Client Email",
        industry: "Industry",
        projectTitle: "Project Title *",
        projectType: "Project Type *",
        projectTypeHint: "(what you do)",
        suggestedFor: "Suggested for",
        whatDoYouDo: "What do you do?",
        whatDoYouDoHint: "(so we can tailor the proposal)",
        scope: "Project Scope *",
        budget: "Budget Amount *",
        budgetType: "Budget Type",
        timeline: "Timeline",
        startDate: "Planned Start Date",
        paymentTerms: "Payment Terms",
        lineItemsEnabled: "Itemized Pricing (line items)",
      },
      placeholders: {
        clientName: "e.g. John Smith",
        clientCompany: "e.g. Acme Corp",
        clientEmail: "client@example.com",
        projectTitle: "e.g. Website Overhaul",
        scope: "Describe what you will do...",
        budget: "5000",
      },
      buttons: {
        generate: "Generate Proposal →",
        generating: "Generating...",
      },
    },
    ai: {
      generating: "Generating Proposal...",
      systemPrompt: "Write in clear, confident English targeting US, UK, AUS, and Canadian clients.",
    }
  },

  // =============================================
  // 🇧🇷 PORTUGUESE (Brazil)
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
    dashboard: {
      sidebar: {
        dashboard: "Painel",
        proposals: "Propostas",
        newProposal: "Nova Proposta",
        pipeline: "Funil",
        clients: "Clientes",
        analytics: "Análise",
        contracts: "Contratos",
        invoices: "Faturas",
        templates: "Modelos",
        referrals: "Indique e Ganhe",
        feedback: "Feedback",
        billing: "Planos e Cobrança",
        settings: "Configurações",
        helpSupport: "Ajuda e Suporte",
        searchHint: "⌘K para buscar",
        upgradePro: "Mudar para Pro →",
        freePlanMsg: "Você está no plano Grátis.",
      },
      topbar: {
        searchPlaceholder: "Buscar...",
        newProposal: "Nova Proposta",
        help: "Ajuda",
        profile: "Perfil",
        billing: "Faturamento",
        signOut: "Sair",
        notifications: "Notificações",
        titles: {
          "/dashboard": "Painel",
          "/proposals": "Propostas",
          "/proposals/new": "Nova Proposta",
          "/clients": "Clientes",
          "/templates": "Modelos",
          "/settings": "Configurações",
          "/analytics": "Análise",
          "/contracts": "Contratos",
          "/invoices": "Faturas",
          "/pipeline": "Funil",
          "/referrals": "Indicações",
          "/billing": "Faturamento",
        }
      },
      stats: {
        totalProposals: "Total de Propostas",
        winRate: "Taxa de Conversão",
        viewed: "Propostas Visualizadas",
        valueWon: "Valor Total Ganho",
        thisWeek: "esta semana",
        createFirst: "Crie sua primeira",
        vsLastMonth: "vs mês passado",
        noData: "Sem dados ainda",
        reading: "clientes estão lendo",
      },
      recentProposals: {
        title: "Propostas Recentes",
        viewAll: "Ver tudo →",
        empty: "Nenhuma proposta ainda.",
        headers: {
          client: "Cliente",
          type: "Tipo",
          value: "Valor",
          status: "Status",
          sent: "Enviado",
          actions: "Ações",
        },
        status: {
          draft: "Rascunho",
          sent: "Enviado",
          accepted: "Aceito",
          signed: "Assinado",
          declined: "Recusado",
          paid: "Pago",
          overdue: "Atrasado",
          cancelled: "Cancelado",
        },
      },
      welcome: {
        title: "Bem-vindo ao Proposar!",
        subtitle: "Comece em três passos:",
        step1: "Complete seu perfil em Configurações",
        step2: "Crie sua primeira proposta",
        step3: "Compartilhe o link e acompanhe quando os clientes abrirem",
        cta: "Criar minha primeira proposta",
        later: "Depois",
      },
      attention: {
        title: "Propostas que Precisam de Atenção",
        allCaughtUp: "🎉 Tudo em dia! Nenhuma proposta precisa de acompanhamento.",
        daysSince: "dias desde o envio",
        followUp: "Enviar Follow-up",
      },
      clientsPage: {
        title: "Clientes",
        addClient: "Adicionar cliente",
        searchPlaceholder: "Buscar clientes...",
        sortOptions: {
          activity: "Última atividade",
          nameAZ: "Nome A-Z",
          nameZA: "Nome Z-A",
          proposalsHigh: "Propostas (mais)",
          valueHigh: "Valor (maior)",
        },
        loading: "Carregando clientes...",
        empty: "Nenhum cliente ainda. Adicione seu primeiro cliente.",
        headers: {
          name: "Nome",
          company: "Empresa",
          email: "E-mail",
          proposals: "Propostas",
          winRate: "Taxa de conversão",
          totalValue: "Valor total",
          activity: "Última atividade",
          actions: "Ações",
        },
        actions: {
          edit: "Editar",
          delete: "Excluir",
        },
        modal: {
          addTitle: "Adicionar Cliente",
          editTitle: "Editar Cliente",
          deleteTitle: "Excluir Cliente",
          deleteConfirm: "Excluir este cliente? As propostas vinculadas a eles permanecerão.",
          nameLabel: "Nome *",
          companyLabel: "Empresa",
          emailLabel: "E-mail",
          notesLabel: "Notas",
          save: "Salvar",
          cancel: "Cancelar",
        },
      },
      contractsPage: {
        title: "Contratos",
        newContract: "Novo Contrato",
        loading: "Carregando contratos...",
        empty: "Nenhum contrato ainda.",
        createFirst: "Crie seu primeiro contrato",
        retry: "Tentar novamente",
        headers: {
          title: "Título",
          client: "Cliente",
          status: "Status",
          created: "Criado em",
          actions: "Ações",
        },
        actions: {
          view: "Ver",
        },
      },
      invoicesPage: {
        title: "Faturas",
        newInvoice: "Nova Fatura",
        empty: "Nenhuma fatura ainda.",
        loading: "Carregando faturas...",
        retry: "Repetir",
        createFirst: "Crie sua primeira fatura",
        headers: {
          number: "#",
          title: "Título",
          client: "Cliente",
          amount: "Valor",
          status: "Status",
          due: "Vencimento",
          actions: "Ações",
        },
        actions: {
          manage: "Gerenciar",
          public: "Público",
          pdf: "PDF",
        },
      },
      settingsPage: {
        title: "Configurações",
        tabs: {
          profile: "Perfil",
          branding: "Identidade Visual",
          defaults: "Padrões de Proposta",
          notifications: "Notificações",
          billing: "Faturamento",
          integrations: "Integrações",
          account: "Conta",
        },
        profile: {
          title: "Perfil",
          fullName: "Nome completo",
          emailReadOnly: "E-mail (apenas leitura)",
          businessName: "Nome da empresa",
          businessType: "Tipo de negócio",
          website: "Site",
          phone: "Telefone",
          bio: "Bio (Sobre Nós nas propostas)",
          city: "Cidade",
          country: "País",
          countryPlaceholder: "ex: Brasil, Portugal",
          gdprMode: "Ativar Modo de Conformidade LGPD/Global",
          gdprHint: "(Adiciona avisos de privacidade e trata dados conforme padrões internacionais)",
        },
        branding: {
          title: "Identidade Visual",
          logoLabel: "Logo (exibido nas propostas)",
          brandColor: "Cor da marca (destaque nas propostas)",
          signatureText: "Texto de assinatura padrão",
          signaturePlaceholder: "Atenciosamente, [Seu Nome]",
          addressLabel: "Endereço comercial (nas propostas)",
          paymentTerms: "Termos de pagamento padrão",
          currency: "Moeda padrão",
        },
        defaults: {
          title: "Padrões de Proposta",
          tone: "Tom padrão",
          sections: "Seções padrão para incluir",
          expiryDays: "Dias para expiração padrão",
          expiryHint: "As propostas expiram após este número de dias",
          followUpLabel: "Lembrete de follow-up automático",
          followUpDays: "Dias de espera antes do lembrete",
        },
        notifications: {
          title: "Notificações",
          proposalViewed: "Quando o cliente visualizar minha proposta",
          proposalAccepted: "Quando a proposta for aceita",
          proposalDeclined: "Quando a proposta for recusada",
          proposalExpired: "Quando a proposta expirar",
          weeklySummary: "E-mail de resumo semanal",
          productUpdates: "Atualizações de produto e dicas",
        },
        billing: {
          title: "Faturamento",
          currentPlan: "Plano atual",
          nextBilling: "Próxima data de cobrança",
          usageThisMonth: "Uso este mês",
          usageLabel: "propostas",
          usageLabelOf: "de",
          manageButton: "Gerenciar Faturamento",
          manageHint: "Atualize o pagamento, veja faturas ou cancele.",
          upgradeLink: "Fazer upgrade",
          upgradeSuffix: "para mais propostas.",
        },
        integrations: {
          description: "Conecte suas ferramentas. Use webhooks do Zapier para automatizar propostas com seu CRM ou fluxo de trabalho.",
          zapierButton: "Webhooks →",
          comingSoon: "Em Breve",
        },
        account: {
          title: "Conta",
          changePassword: "Alterar senha",
          passwordHint: "Enviaremos um link de redefinição para o seu e-mail. Verifique seu e-mail após clicar abaixo.",
          resetButton: "Enviar e-mail de redefinição de senha",
          changeEmail: "Alterar e-mail",
          emailHint: "Entre em contato com o suporte para alterar seu endereço de e-mail.",
          exportTitle: "Exportar dados (LGPD)",
          exportHint: "Baixe todo o seu perfil, propostas, clientes e modelos como JSON.",
          exportButton: "Exportar meus dados",
          deleteTitle: "Excluir conta",
          deleteHint: "Exclua permanentemente sua conta e todos os dados. Isso não pode ser desfeito.",
          deletePlaceholder: 'Digite "DELETE" para confirmar',
          deleteButton: "Excluir conta",
        },
        common: {
          save: "Salvar",
          cancel: "Cancelar",
          loading: "Carregando...",
          saving: "Salvando...",
        },
      },
    },
    proposalForm: {
      onboardingMsg: "Usando padrões de integração para tom, seções, moeda, termos de pagamento e data de validade. Você pode editar tudo abaixo para esta proposta.",
      sections: {
        client: "Sobre o Cliente",
        project: "Sobre o Projeto",
        pricing: "Preço e Cronograma",
      },
      fields: {
        existingClient: "Selecionar cliente existente",
        selectClient: "Selecione um cliente",
        loadingClients: "Carregando clientes...",
        noClients: "Nenhum cliente encontrado. Adicione clientes primeiro na página de Clientes.",
        clientName: "Nome do Cliente *",
        clientCompany: "Empresa do Cliente",
        clientEmail: "E-mail do Cliente",
        industry: "Indústria",
        projectTitle: "Título do Projeto *",
        projectType: "Tipo de Projeto *",
        projectTypeHint: "(o que você faz)",
        suggestedFor: "Sugerido para",
        whatDoYouDo: "O que você faz?",
        whatDoYouDoHint: "(para podermos adaptar a proposta)",
        scope: "Escopo do Projeto *",
        budget: "Valor do Orçamento *",
        budgetType: "Tipo de Orçamento",
        timeline: "Cronograma",
        startDate: "Data de Início Planejada",
        paymentTerms: "Termos de Pagamento",
        lineItemsEnabled: "Preçamento Detalhado (itens de linha)",
      },
      placeholders: {
        clientName: "ex: João Silva",
        clientCompany: "ex: Loja do Bairro",
        clientEmail: "cliente@exemplo.com",
        projectTitle: "ex: Redesign de Website",
        scope: "Descreva o que você vai fazer...",
        budget: "5000",
      },
      buttons: {
        generate: "Gerar Proposta →",
        generating: "Gerando...",
      },
    },
    ai: {
      generating: "Gerando Proposta...",
      systemPrompt: "Escreva em português brasileiro profissional e persuasivo focado no mercado do Brasil.",
    }
  },

  // =============================================
  // 🇪🇸 SPANISH
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
        "Termina la ansiedad del domingo por la noche preguntándote de dónde vendrá tu próximo cliente. Proposar usa IA para crear propuestas ganadoras en 60 segundos y actúa como tu Guardaespaldas Digital — haciendo seguimientos por WhatsApp y generando Contratos Inteligentes para que cobres por tu trabajo, sin que te ignoren.",
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
    dashboard: {
      sidebar: {
        dashboard: "Panel",
        proposals: "Propuestas",
        newProposal: "Nueva Propuesta",
        pipeline: "Embudo",
        clients: "Clientes",
        analytics: "Análisis",
        contracts: "Contratos",
        invoices: "Facturas",
        templates: "Plantillas",
        referrals: "Recomienda y Gana",
        feedback: "Comentarios",
        billing: "Facturación",
        settings: "Configuración",
        helpSupport: "Ayuda y Soporte",
        searchHint: "⌘K para buscar",
        upgradePro: "Pasar a Pro →",
        freePlanMsg: "Estás en el plan Gratis.",
      },
      topbar: {
        searchPlaceholder: "Buscar...",
        newProposal: "Nueva Propuesta",
        help: "Ayuda",
        profile: "Perfil",
        billing: "Facturación",
        signOut: "Cerrar sesión",
        notifications: "Notificaciones",
        titles: {
          "/dashboard": "Panel",
          "/proposals": "Propuestas",
          "/proposals/new": "Nueva Propuesta",
          "/clients": "Clientes",
          "/templates": "Plantillas",
          "/settings": "Configuración",
          "/analytics": "Análisis",
          "/contracts": "Contratos",
          "/invoices": "Facturas",
          "/pipeline": "Embudo",
          "/referrals": "Referidos",
          "/billing": "Facturación",
        }
      },
      stats: {
        totalProposals: "Total de Propuestas",
        winRate: "Tasa de Ganancia",
        viewed: "Propuestas Vistas",
        valueWon: "Valor Total Ganado",
        thisWeek: "esta semana",
        createFirst: "Crea tu primera",
        vsLastMonth: "vs mes pasado",
        noData: "Sin datos aún",
        reading: "los clientes están leyendo",
      },
      recentProposals: {
        title: "Propuestas Recientes",
        viewAll: "Ver todo →",
        empty: "No hay propuestas aún.",
        headers: {
          client: "Cliente",
          type: "Tipo",
          value: "Valor",
          status: "Estado",
          sent: "Enviado",
          actions: "Acciones",
        },
        status: {
          draft: "Borrador",
          sent: "Enviado",
          accepted: "Aceptado",
          signed: "Firmado",
          declined: "Rechazado",
          paid: "Pagado",
          overdue: "Vencido",
          cancelled: "Cancelado",
        },
      },
      welcome: {
        title: "¡Bienvenido a Proposar!",
        subtitle: "Comienza en tres pasos:",
        step1: "Completa tu perfil en Configuración",
        step2: "Crea tu primera propuesta",
        step3: "Comparte el enlace y rastrea cuando los clientes abran",
        cta: "Crear mi primera propuesta",
        later: "Más tarde",
      },
      attention: {
        title: "Propuestas que Necesitan Atención",
        allCaughtUp: "🎉 ¡Todo al día! Ninguna propuesta necesita seguimiento.",
        daysSince: "días desde el envío",
        followUp: "Enviar Seguimiento",
      },
      clientsPage: {
        title: "Clientes",
        addClient: "Agregar cliente",
        searchPlaceholder: "Buscar clientes...",
        sortOptions: {
          activity: "Última actividad",
          nameAZ: "Nombre A-Z",
          nameZA: "Nombre Z-A",
          proposalsHigh: "Propuestas (más)",
          valueHigh: "Valor (mayor)",
        },
        loading: "Cargando clientes...",
        empty: "No hay clientes aún. Agrega tu primer cliente.",
        headers: {
          name: "Nombre",
          company: "Empresa",
          email: "Email",
          proposals: "Propuestas",
          winRate: "Tasa de conversión",
          totalValue: "Valor total",
          activity: "Última actividad",
          actions: "Acciones",
        },
        actions: {
          edit: "Editar",
          delete: "Eliminar",
        },
        modal: {
          addTitle: "Agregar Cliente",
          editTitle: "Editar Cliente",
          deleteTitle: "Eliminar Cliente",
          deleteConfirm: "¿Eliminar este cliente? Las propuestas vinculadas a ellos permanecerán.",
          nameLabel: "Nombre *",
          companyLabel: "Empresa",
          emailLabel: "Email",
          notesLabel: "Notas",
          save: "Guardar",
          cancel: "Cancelar",
        },
      },
      contractsPage: {
        title: "Contratos",
        newContract: "Nuevo Contrato",
        loading: "Cargando contratos...",
        empty: "No hay contratos aún.",
        createFirst: "Crea tu primer contrato",
        retry: "Reintentar",
        headers: {
          title: "Título",
          client: "Cliente",
          status: "Estado",
          created: "Creado en",
          actions: "Acciones",
        },
        actions: {
          view: "Ver",
        },
      },
      invoicesPage: {
        title: "Facturas",
        newInvoice: "Nueva Factura",
        empty: "No hay facturas aún.",
        loading: "Cargando facturas...",
        retry: "Reintentar",
        createFirst: "Crea tu primera factura",
        headers: {
          number: "#",
          title: "Título",
          client: "Cliente",
          amount: "Monto",
          status: "Estado",
          due: "Vencimiento",
          actions: "Acciones",
        },
        actions: {
          manage: "Gestionar",
          public: "Público",
          pdf: "PDF",
        },
      },
      settingsPage: {
        title: "Configuración",
        tabs: {
          profile: "Perfil",
          branding: "Identidad Visual",
          defaults: "Preferencias de Propuesta",
          notifications: "Notificaciones",
          billing: "Facturación",
          integrations: "Integraciones",
          account: "Cuenta",
        },
        profile: {
          title: "Perfil",
          fullName: "Nombre completo",
          emailReadOnly: "Email (solo lectura)",
          businessName: "Nombre de la empresa",
          businessType: "Tipo de negocio",
          website: "Sitio web",
          phone: "Teléfono",
          bio: "Bio (Sobre Nosotros en las propuestas)",
          city: "Ciudad",
          country: "País",
          countryPlaceholder: "p. ej. España, México",
          gdprMode: "Activar Modo de Cumplimiento GDPR/Global",
          gdprHint: "(Añade avisos de privacidad y maneja datos según estándares internacionales)",
        },
        branding: {
          title: "Identidad Visual",
          logoLabel: "Logo (se muestra en las propuestas)",
          brandColor: "Color de marca (acento en las propuestas)",
          signatureText: "Texto de firma por defecto",
          signaturePlaceholder: "Saludos cordiales, [Tu Nombre]",
          addressLabel: "Dirección comercial (en las propuestas)",
          paymentTerms: "Términos de pago por defecto",
          currency: "Moneda por defecto",
        },
        defaults: {
          title: "Preferencias de Propuesta",
          tone: "Tono por defecto",
          sections: "Secciones por defecto para incluir",
          expiryDays: "Días para expiración por defecto",
          expiryHint: "Las propuestas expiran después de este número de días",
          followUpLabel: "Recordatorio de seguimiento automático",
          followUpDays: "Días de espera antes del recordatorio",
        },
        notifications: {
          title: "Notificaciones",
          proposalViewed: "Cuando el cliente vea mi propuesta",
          proposalAccepted: "Cuando se acepte la propuesta",
          proposalDeclined: "Cuando se rechace la propuesta",
          proposalExpired: "Cuando la propuesta expire",
          weeklySummary: "Email de resumen semanal",
          productUpdates: "Actualizaciones de producto y consejos",
        },
        billing: {
          title: "Facturación",
          currentPlan: "Plan actual",
          nextBilling: "Próxima fecha de cobro",
          usageThisMonth: "Uso este mes",
          usageLabel: "propuestas",
          usageLabelOf: "de",
          manageButton: "Gestionar Facturación",
          manageHint: "Actualiza el pago, ve facturas o cancela.",
          upgradeLink: "Pasar a un plan superior",
          upgradeSuffix: "para más propuestas.",
        },
        integrations: {
          description: "Conecta tus herramientas. Usa webhooks de Zapier para automatizar propuestas con tu CRM o flujo de trabajo.",
          zapierButton: "Webhooks →",
          comingSoon: "Próximamente",
        },
        account: {
          title: "Cuenta",
          changePassword: "Cambiar contraseña",
          passwordHint: "Enviaremos un enlace de restablecimiento a tu email. Revisa tu buzón después de hacer clic.",
          resetButton: "Enviar email de restablecimiento",
          changeEmail: "Cambiar email",
          emailHint: "Contacta con soporte para cambiar tu dirección de email.",
          exportTitle: "Exportar datos (GDPR)",
          exportHint: "Descarga todo tu perfil, propuestas, clientes y plantillas como JSON.",
          exportButton: "Exportar mis datos",
          deleteTitle: "Eliminar cuenta",
          deleteHint: "Elimina permanentemente tu cuenta y todos los datos. Esto no se puede deshacer.",
          deletePlaceholder: 'Escribe "DELETE" para confirmar',
          deleteButton: "Eliminar cuenta",
        },
        common: {
          save: "Guardar",
          cancel: "Cancelar",
          loading: "Cargando...",
          saving: "Guardando...",
        },
      },
    },
    proposalForm: {
      onboardingMsg: "Usando valores predeterminados para tono, secciones, moneda, plazos de pago y fecha de vencimiento. Puedes editar todo a continuación.",
      sections: {
        client: "Sobre el Cliente",
        project: "Sobre el Proyecto",
        pricing: "Precios y Cronograma",
      },
      fields: {
        existingClient: "Seleccionar cliente existente",
        selectClient: "Selecciona un cliente",
        loadingClients: "Cargando clientes...",
        noClients: "No se encontraron clientes. Agrégalos en la página de Clientes.",
        clientName: "Nombre del Cliente *",
        clientCompany: "Empresa del Cliente",
        clientEmail: "Email del Cliente",
        industry: "Industria",
        projectTitle: "Título del Proyecto *",
        projectType: "Tipo de Proyecto *",
        projectTypeHint: "(lo que haces)",
        suggestedFor: "Sugerido para",
        whatDoYouDo: "¿Qué haces?",
        whatDoYouDoHint: "(para que podamos adaptar la propuesta)",
        scope: "Alcance del Proyecto *",
        budget: "Monto del Presupuesto *",
        budgetType: "Tipo de Presupuesto",
        timeline: "Cronograma",
        startDate: "Fecha de Inicio Planificada",
        paymentTerms: "Plazos de Pago",
        lineItemsEnabled: "Precios Detallados (por ítems)",
      },
      placeholders: {
        clientName: "ej. Juan Pérez",
        clientCompany: "ej. Acme Corp",
        clientEmail: "cliente@ejemplo.com",
        projectTitle: "ej. Rediseño de Sitio Web",
        scope: "Describe lo que vas a hacer...",
        budget: "5000",
      },
      buttons: {
        generate: "Generar Propuesta →",
        generating: "Generando...",
      },
    },
    ai: {
      generating: "Generando Propuesta...",
      systemPrompt: "Escribe en español profesional y persuasivo adaptado al mercado hispanohablante.",
    }
  },

  // =============================================
  // 🇦🇪 ARABIC (RTL)
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
    dashboard: {
      sidebar: {
        dashboard: "لوحة التحكم",
        proposals: "العروض",
        newProposal: "عرض جديد",
        pipeline: "سير العمل",
        clients: "العملاء",
        analytics: "التحليلات",
        contracts: "العقود",
        invoices: "الفواتير",
        templates: "النماذج",
        referrals: "اكسب من الإحالات",
        feedback: "الآراء والملاحظات",
        billing: "الاشتراكات",
        settings: "الإعدادات",
        helpSupport: "المساعدة والدعم",
        searchHint: "⌘K للبحث",
        upgradePro: "الترقية للنسخة الاحترافية ←",
        freePlanMsg: "أنت تستخدم النسخة المجانية.",
      },
      topbar: {
        searchPlaceholder: "بحث...",
        newProposal: "عرض جديد",
        help: "مساعدة",
        profile: "الملف الشخصي",
        billing: "الحساب",
        signOut: "تسجيل الخروج",
        notifications: "التنبيهات",
        titles: {
          "/dashboard": "لوحة التحكم",
          "/proposals": "العروض",
          "/proposals/new": "عرض جديد",
          "/clients": "العملاء",
          "/templates": "النماذج",
          "/settings": "الإعدادات",
          "/analytics": "التحليلات",
          "/contracts": "العقود",
          "/invoices": "الفواتير",
          "/pipeline": "سير العمل",
          "/referrals": "الإحالات",
          "/billing": "الحساب",
        }
      },
      stats: {
        totalProposals: "إجمالي العروض",
        winRate: "نسبة النجاح",
        viewed: "عروض تمت مشاهدتها",
        valueWon: "إجمالي الربح",
        thisWeek: "هذا الأسبوع",
        createFirst: "أنشئ عرضك الأول",
        vsLastMonth: "مقارنة بالشهر الماضي",
        noData: "لا توجد بيانات بعد",
        reading: "العملاء يقرؤون الآن",
      },
      recentProposals: {
        title: "العروض الأخيرة",
        viewAll: "عرض الكل ←",
        empty: "لا توجد عروض بعد.",
        headers: {
          client: "العميل",
          type: "النوع",
          value: "القيمة",
          status: "الحالة",
          sent: "أرسلت في",
          actions: "الإجراءات",
        },
        status: {
          draft: "مسودة",
          sent: "تم الإرسال",
          accepted: "مقبول",
          signed: "موقع",
          declined: "مرفوض",
          paid: "تم الدفع",
          overdue: "متأخر",
          cancelled: "ملغي",
        },
      },
      welcome: {
        title: "مرحباً بك في Proposar!",
        subtitle: "ابدأ في ثلاث خطوات:",
        step1: "أكمل ملفك الشخصي في الإعدادات",
        step2: "أنشئ عرضك الأول",
        step3: "شارك الرابط وتتبع متى يفتحه العملاء",
        cta: "أنشئ عرضك الأول الآن",
        later: "لاحقاً",
      },
      attention: {
        title: "عروض تحتاج لمتابعة",
        allCaughtUp: "🎉 كل شيء تمام! لا توجد عروض تحتاج لمتابعة.",
        daysSince: "يوم منذ الإرسال",
        followUp: "إرسال متابعة",
      },
      clientsPage: {
        title: "العملاء",
        addClient: "إضافة عميل",
        searchPlaceholder: "بحث عن عملاء...",
        sortOptions: {
          activity: "آخر نشاط",
          nameAZ: "الاسم (أ-ي)",
          nameZA: "الاسم (ي-أ)",
          proposalsHigh: "العروض (الأكثر)",
          valueHigh: "القيمة (الأعلى)",
        },
        loading: "جاري تحميل العملاء...",
        empty: "لا يوجد عملاء بعد. أضف عميلك الأول.",
        headers: {
          name: "الاسم",
          company: "الشركة",
          email: "البريد الإلكتروني",
          proposals: "العروض",
          winRate: "نسبة النجاح",
          totalValue: "إجمالي القيمة",
          activity: "آخر نشاط",
          actions: "إجراءات",
        },
        actions: {
          edit: "تعديل",
          delete: "حذف",
        },
        modal: {
          addTitle: "إضافة عميل",
          editTitle: "تعديل عميل",
          deleteTitle: "حذف عميل",
          deleteConfirm: "هل تريد حذف هذا العميل؟ ستظل العروض المرتبطة به موجودة.",
          nameLabel: "الاسم *",
          companyLabel: "الشركة",
          emailLabel: "البريد الإلكتروني",
          notesLabel: "ملاحظات",
          save: "حفظ",
          cancel: "إلغاء",
        },
      },
      contractsPage: {
        title: "العقود",
        newContract: "عقد جديد",
        loading: "جاري تحميل العقود...",
        empty: "لا توجد عقود بعد.",
        createFirst: "أنشئ عقدك الأول",
        retry: "إعادة المحاولة",
        headers: {
          title: "العنوان",
          client: "العميل",
          status: "الحالة",
          created: "تاريخ الإنشاء",
          actions: "إجراءات",
        },
        actions: {
          view: "عرض",
        },
      },
      invoicesPage: {
        title: "الفواتير",
        newInvoice: "فاتورة جديدة",
        empty: "لا توجد فواتير بعد.",
        loading: "جاري تحميل الفواتير...",
        retry: "إعادة المحاولة",
        createFirst: "أنشئ فاتورتك الأولى",
        headers: {
          number: "#",
          title: "العنوان",
          client: "العميل",
          amount: "المبلغ",
          status: "الحالة",
          due: "تاريخ الاستحقاق",
          actions: "إجراءات",
        },
        actions: {
          manage: "إدارة",
          public: "عام",
          pdf: "PDF",
        },
      },
      settingsPage: {
        title: "الإعدادات",
        tabs: {
          profile: "الملف الشخصي",
          branding: "الهوية التجارية",
          defaults: "افتراضيات العروض",
          notifications: "التنبيهات",
          billing: "الفواتير",
          integrations: "التكاملات",
          account: "الحساب",
        },
        profile: {
          title: "الملف الشخصي",
          fullName: "الاسم الكامل",
          emailReadOnly: "البريد الإلكتروني (للقراءة فقط)",
          businessName: "اسم الشركة",
          businessType: "نوع العمل",
          website: "الموقع الإلكتروني",
          phone: "الهاتف",
          bio: "نبذة (عنا في العروض)",
          city: "المدينة",
          country: "الدولة",
          countryPlaceholder: "مثال: السعودية، مصر",
          gdprMode: "تفعيل وضع الامتثال العالمي/GDPR",
          gdprHint: "(يضيف إشعارات الخصوصية ويعالج البيانات وفقاً للمعايير الدولية)",
        },
        branding: {
          title: "الهوية التجارية",
          logoLabel: "الشعار (يظهر في العروض)",
          brandColor: "لون العلامة التجارية (للتمييز في العروض)",
          signatureText: "نص التوقيع الافتراضي",
          signaturePlaceholder: "مع أطيب التحيات، [اسمك]",
          addressLabel: "عنوان العمل (في العروض)",
          paymentTerms: "شروط الدفع الافتراضية",
          currency: "العملة الافتراضية",
        },
        defaults: {
          title: "افتراضيات العروض",
          tone: "النبرة الافتراضية",
          sections: "الأقسام الافتراضية المتضمنة",
          expiryDays: "أيام انتهاء الصلاحية الافتراضية",
          expiryHint: "تنتهي صلاحية العروض بعد هذا العدد من الأيام",
          followUpLabel: "تذكير متابعة تلقائي",
          followUpDays: "أيام الانتظار قبل التذكير",
        },
        notifications: {
          title: "التنبيهات",
          proposalViewed: "عندما يشاهد العميل عرضي",
          proposalAccepted: "عند قبول العرض",
          proposalDeclined: "عند رفض العرض",
          proposalExpired: "عند انتهاء صلاحية العرض",
          weeklySummary: "بريد ملخص أسبوعي",
          productUpdates: "تحديثات المنتج ونصائح",
        },
        billing: {
          title: "الفواتير",
          currentPlan: "الخطة الحالية",
          nextBilling: "تاريخ الدفع القادم",
          usageThisMonth: "الاستخدام هذا الشهر",
          usageLabel: "عروض",
          usageLabelOf: "من",
          manageButton: "إدارة الفواتير",
          manageHint: "تحديث الدفع، عرض الفواتير، أو الإلغاء.",
          upgradeLink: "ترقية",
          upgradeSuffix: "للمزيد من العروض.",
        },
        integrations: {
          description: "اربط أدواتك. استخدم خطافات الويب (Webhooks) من Zapier لأتمتة العروض مع نظام إدارة العملاء أو سير العمل الخاص بك.",
          zapierButton: "خطافات الويب ←",
          comingSoon: "قريباً",
        },
        account: {
          title: "الحساب",
          changePassword: "تغيير كلمة المرور",
          passwordHint: "سنرسل رابط إعادة التعيين إلى بريدك الإلكتروني. تحقق من بريدك بعد النقر أدناه.",
          resetButton: "إرسال بريد إعادة تعيين كلمة المرور",
          changeEmail: "تغيير البريد الإلكتروني",
          emailHint: "اتصل بالدعم لتغيير بريدك الإلكتروني.",
          exportTitle: "تصدير البيانات (GDPR)",
          exportHint: "تحميل ملفاتك، عروضك، عملائك، ونماذجك كملف JSON.",
          exportButton: "تصدير بياناتي",
          deleteTitle: "حذف الحساب",
          deleteHint: "حذف حسابك وجميع بياناتك نهائياً. لا يمكن التراجع عن هذه الخطوة.",
          deletePlaceholder: 'اكتب "DELETE" للتأكيد',
          deleteButton: "حذف الحساب",
        },
        common: {
          save: "حفظ",
          cancel: "إلغاء",
          loading: "جاري التحميل...",
          saving: "جاري الحفظ...",
        },
      },
    },
    proposalForm: {
      onboardingMsg: "يتم استخدام الإعدادات الافتراضية للنبرة، الأقسام، العملة، شروط الدفع وتاريخ الانتهاء. يمكنك تعديل كل شيء أدناه.",
      sections: {
        client: "عن العميل",
        project: "عن المشروع",
        pricing: "التسعير والجدول الزمني",
      },
      fields: {
        existingClient: "اختيار عميل حالي",
        selectClient: "اختر عميل",
        loadingClients: "جاري تحميل العملاء...",
        noClients: "لم يتم العثور على عملاء بعد. أضف عملاء أولاً من صفحة العملاء.",
        clientName: "اسم العميل *",
        clientCompany: "شركة العميل",
        clientEmail: "بريد العميل الإلكتروني",
        industry: "المجال",
        projectTitle: "عنوان المشروع *",
        projectType: "نوع المشروع *",
        projectTypeHint: "(ماذا تقدم؟)",
        suggestedFor: "المقترح لـ",
        whatDoYouDo: "ماذا تفعل بالضبط؟",
        whatDoYouDoHint: "(حتى نتمكن من تخصيص العرض)",
        scope: "نطاق المشروع *",
        budget: "مبلغ الميزانية *",
        budgetType: "نوع الميزانية",
        timeline: "الجدول الزمني",
        startDate: "تاريخ البدء المخطط",
        paymentTerms: "شروط الدفع",
        lineItemsEnabled: "تسعير مفصل (بنود الخدمة)",
      },
      placeholders: {
        clientName: "مثلاً: أحمد محمد",
        clientCompany: "مثلاً: شركة أكمي",
        clientEmail: "client@example.com",
        projectTitle: "مثلاً: تطوير موقع إلكتروني",
        scope: "صف ماذا ستفعل للعميل...",
        budget: "5000",
      },
      buttons: {
        generate: "إنشاء العرض ←",
        generating: "جاري الإنشاء...",
      },
    },
    ai: {
      generating: "جاري إنشاء العرض...",
      systemPrompt: "اكتب باللغة العربية الفصحى بطريقة احترافية ومقنعة موجهة للسوق الخليجي والعربي.",
    }
  },

  // =============================================
  // 🇮🇳 HINDI
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
    dashboard: {
      sidebar: {
        dashboard: "डैशबोर्ड",
        proposals: "प्रपोज़ल",
        newProposal: "नया प्रपोज़ल",
        pipeline: "पाइपलाइन",
        clients: "क्लाइंट्स",
        analytics: "एनालिटिक्स",
        contracts: "कॉन्ट्रैक्ट्स",
        invoices: "इनवॉइस",
        templates: "टेम्पलेट्स",
        referrals: "रेफरल से कमाएं",
        feedback: "फीडबैक",
        billing: "बिलिंग और प्लान",
        settings: "सेटिंग्स",
        helpSupport: "सहायता और सपोर्ट",
        searchHint: "⌘K से सर्च करें",
        upgradePro: "Pro में अपग्रेड करें →",
        freePlanMsg: "आप मुफ्त प्लान पर हैं।",
      },
      topbar: {
        searchPlaceholder: "सर्च करें...",
        newProposal: "नया प्रपोज़ल",
        help: "सहायता",
        profile: "प्रोफाइल",
        billing: "बिलिंग",
        signOut: "साइन आउट",
        notifications: "नोटिफिकेशन",
        titles: {
          "/dashboard": "डैशबोर्ड",
          "/proposals": "प्रपोज़ल",
          "/proposals/new": "नया प्रपोज़ल",
          "/clients": "क्लाइंट्स",
          "/templates": "टेम्पलेट्स",
          "/settings": "सेटिंग्स",
          "/analytics": "एनालिटिक्स",
          "/contracts": "कॉन्ट्रैक्ट्स",
          "/invoices": "इनवॉइस",
          "/pipeline": "पाइपलाइन",
          "/referrals": "रेफरल्स",
          "/billing": "बिलिंग",
        }
      },
      stats: {
        totalProposals: "कुल प्रपोज़ल",
        winRate: "जीत की दर",
        viewed: "देखे गए प्रपोज़ल",
        valueWon: "कुल जीती गई राशि",
        thisWeek: "इस सप्ताह",
        createFirst: "पहला प्रपोज़ल बनाएं",
        vsLastMonth: "पिछले महीने की तुलना में",
        noData: "अभी कोई डेटा नहीं",
        reading: "क्लाइंट्स पढ़ रहे हैं",
      },
      recentProposals: {
        title: "हाल के प्रपोज़ल",
        viewAll: "सभी देखें →",
        empty: "अभी कोई प्रपोज़ल नहीं है।",
        headers: {
          client: "क्लाइंट",
          type: "प्रकार",
          value: "मूल्य",
          status: "स्थिति",
          sent: "भेजा गया",
          actions: "कार्रवाई",
        },
        status: {
          draft: "ड्राफ्ट",
          sent: "भेजा गया",
          accepted: "स्वीकार किया गया",
          signed: "हस्ताक्षरित",
          declined: "अस्वीकार कर दिया",
          paid: "भुगतान किया गया",
          overdue: "विलंबित",
          cancelled: "रद्द किया गया",
        },
      },
      welcome: {
        title: "प्रपोज़र में आपका स्वागत है!",
        subtitle: "तीन चरणों में शुरुआत करें:",
        step1: "सेटिंग्स में अपनी प्रोफाइल पूरी करें",
        step2: "अपना पहला प्रपोज़ल बनाएं",
        step3: "लिंक शेयर करें और ट्रैक करें कि क्लाइंट कब खोलते हैं",
        cta: "अपना पहला प्रपोज़ल बनाएं",
        later: "बाद में",
      },
      attention: {
        title: "ध्यान देने योग्य प्रपोज़ल",
        allCaughtUp: "🎉 सब व्यवस्थित है! किसी प्रपोज़ल को फॉलो-अप की आवश्यकता नहीं है।",
        daysSince: "दिन पहले भेजा गया",
        followUp: "फॉलो-अप भेजें",
      },
      clientsPage: {
        title: "क्लाइंट्स",
        addClient: "क्लाइंट जोड़ें",
        searchPlaceholder: "क्लाइंट खोजें...",
        sortOptions: {
          activity: "हालिया गतिविधि",
          nameAZ: "नाम A-Z",
          nameZA: "नाम Z-A",
          proposalsHigh: "प्रपोज़ल (अधिक)",
          valueHigh: "मूल्य (उच्च)",
        },
        loading: "क्लाइंट लोड हो रहे हैं...",
        empty: "अभी कोई क्लाइंट नहीं है। अपना पहला क्लाइंट जोड़ें।",
        headers: {
          name: "नाम",
          company: "कंपनी",
          email: "ईमेल",
          proposals: "प्रपोज़ल",
          winRate: "जीत दर",
          totalValue: "कुल मूल्य",
          activity: "हालिया गतिविधि",
          actions: "कार्रवाई",
        },
        actions: {
          edit: "संपादित करें",
          delete: "हटाएं",
        },
        modal: {
          addTitle: "क्लाइंट जोड़ें",
          editTitle: "क्लाइंट संपादित करें",
          deleteTitle: "क्लाइंट हटाएं",
          deleteConfirm: "क्या आप इस क्लाइंट को हटाना चाहते हैं? उनसे जुड़े प्रपोज़ल बने रहेंगे।",
          nameLabel: "नाम *",
          companyLabel: "कंपनी",
          emailLabel: "ईमेल",
          notesLabel: "नोट्स",
          save: "सहेजें",
          cancel: "रद्द करें",
        },
      },
      contractsPage: {
        title: "अनुबंध (Contracts)",
        newContract: "नया अनुबंध",
        loading: "अनुबंध लोड हो रहे हैं...",
        empty: "अभी कोई अनुबंध नहीं है।",
        createFirst: "अपना पहला अनुबंध बनाएं",
        retry: "पुनः प्रयास करें",
        headers: {
          title: "शीर्षक",
          client: "क्लाइंट",
          status: "स्थिति",
          created: "बनाया गया",
          actions: "कार्रवाई",
        },
        actions: {
          view: "देखें",
        },
      },
      invoicesPage: {
        title: "इनवॉइस",
        newInvoice: "नया इनवॉइस",
        empty: "अभी कोई इनवॉइस नहीं है।",
        loading: "इनवॉइस लोड हो रहे हैं...",
        retry: "पुनः प्रयास करें",
        createFirst: "अपना पहला इनवॉइस बनाएं",
        headers: {
          number: "#",
          title: "शीर्षक",
          client: "क्लाइंट",
          amount: "राशि",
          status: "स्थिति",
          due: "देय तिथि",
          actions: "कार्रवाई",
        },
        actions: {
          manage: "प्रबंधन",
          public: "सार्वजनिक",
          pdf: "PDF",
        },
      },
      settingsPage: {
        title: "सेटिंग्स",
        tabs: {
          profile: "प्रोफाइल",
          branding: "ब्रांडिंग",
          defaults: "प्रपोज़ल डिफॉल्ट्स",
          notifications: "नोटिफिकेशन",
          billing: "बिलिंग",
          integrations: "इंटीग्रेशन",
          account: "खाता",
        },
        profile: {
          title: "प्रोफाइल",
          fullName: "पूरा नाम",
          emailReadOnly: "ईमेल (केवल पढ़ने के लिए)",
          businessName: "व्यवसाय का नाम",
          businessType: "व्यवसाय का प्रकार",
          website: "वेबसाइट",
          phone: "फोन",
          bio: "बायो (प्रपोज़ल में 'हमारे बारे में')",
          city: "शहर",
          country: "देश",
          countryPlaceholder: "जैसे- भारत, अमेरिका",
          gdprMode: "GDPR/वैश्विक अनुपालन मोड सक्षम करें",
          gdprHint: "(गोपनीयता नोटिस जोड़ता है और अंतरराष्ट्रीय मानकों के अनुसार डेटा संभालता है)",
        },
        branding: {
          title: "ब्रांडिंग",
          logoLabel: "लोगो (प्रपोज़ल पर दिखाया गया)",
          brandColor: "ब्रांड रंग (प्रपोज़ल पर मुख्य रंग)",
          signatureText: "डिफॉल्ट हस्ताक्षर टेक्स्ट",
          signaturePlaceholder: "सादर, [आपका नाम]",
          addressLabel: "व्यवसाय का पता (प्रपोज़ल पर)",
          paymentTerms: "डिफॉल्ट भुगतान शर्तें",
          currency: "डिफॉल्ट मुद्रा",
        },
        defaults: {
          title: "प्रपोज़ल डिफॉल्ट्स",
          tone: "डिफॉल्ट टोन",
          sections: "शामिल करने के लिए डिफॉल्ट सेक्शन",
          expiryDays: "डिफॉल्ट समाप्ति दिन",
          expiryHint: "प्रपोज़ल इतने दिनों के बाद समाप्त हो जाते हैं",
          followUpLabel: "ऑटो फॉलो-अप रिमाइंडर",
          followUpDays: "रिमाइंडर से पहले प्रतीक्षा के दिन",
        },
        notifications: {
          title: "नोटिफिकेशन",
          proposalViewed: "जब क्लाइंट मेरा प्रपोज़ल देखे",
          proposalAccepted: "जब प्रपोज़ल स्वीकार कर लिया जाए",
          proposalDeclined: "जब प्रपोज़ल अस्वीकार कर दिया जाए",
          proposalExpired: "जब प्रपोज़ल समाप्त हो जाए",
          weeklySummary: "साप्ताहिक सारांश ईमेल",
          productUpdates: "उत्पाद अपडेट और टिप्स",
        },
        billing: {
          title: "बिलिंग",
          currentPlan: "वर्तमान प्लान",
          nextBilling: "अगली बिलिंग तिथि",
          usageThisMonth: "इस महीने का उपयोग",
          usageLabel: "प्रपोज़ल",
          usageLabelOf: "में से",
          manageButton: "बिलिंग प्रबंधित करें",
          manageHint: "भुगतान अपडेट करें, इनवॉइस देखें या रद्द करें।",
          upgradeLink: "अपग्रेड करें",
          upgradeSuffix: "अधिक प्रपोज़ल के लिए।",
        },
        integrations: {
          description: "अपने टूल कनेक्ट करें। अपने CRM या वर्कफ़्लो के साथ प्रपोज़ल को ऑटोमेट करने के लिए Zapier वेबहुक का उपयोग करें।",
          zapierButton: "वेबहुक →",
          comingSoon: "जल्द आ रहा है",
        },
        account: {
          title: "खाता",
          changePassword: "पासवर्ड बदलें",
          passwordHint: "हम आपके ईमेल पर रीसेट लिंक भेजेंगे। नीचे क्लिक करने के बाद अपना ईमेल देखें।",
          resetButton: "पासवर्ड रीसेट ईमेल भेजें",
          changeEmail: "ईमेल बदलें",
          emailHint: "अपना ईमेल पता बदलने के लिए सपोर्ट से संपर्क करें।",
          exportTitle: "डेटा एक्सपोर्ट करें (GDPR)",
          exportHint: "अपनी प्रोफाइल, प्रपोज़ल, क्लाइंट और टेम्पलेट्स को JSON के रूप में डाउनलोड करें।",
          exportButton: "मेरा डेटा एक्सपोर्ट करें",
          deleteTitle: "खाता हटाएं",
          deleteHint: "अपना खाता और सारा डेटा स्थायी रूप से हटाएं। इसे वापस नहीं लिया जा सकता।",
          deletePlaceholder: 'पुष्टि करने के लिए "DELETE" टाइप करें',
          deleteButton: "खाता हटाएं",
        },
        common: {
          save: "सहेजें",
          cancel: "रद्द करें",
          loading: "लोड हो रहा है...",
          saving: "सहेजा जा रहा है...",
        },
      },
    },
    proposalForm: {
      onboardingMsg: "टोन, सेक्शन, करेंसी, भुगतान की शर्तों और समाप्ति तिथि के लिए डिफॉल्ट का उपयोग किया जा रहा है। आप नीचे सब कुछ बदल सकते हैं।",
      sections: {
        client: "क्लाइंट के बारे में",
        project: "प्रोजेक्ट के बारे में",
        pricing: "कीमत और समयरेखा",
      },
      fields: {
        existingClient: "मौजूदा क्लाइंट चुनें",
        selectClient: "क्लाइंट चुनें",
        loadingClients: "क्लाइंट लोड हो रहे हैं...",
        noClients: "अभी कोई क्लाइंट नहीं मिला। पहले क्लाइंट पेज से क्लाइंट जोड़ें।",
        clientName: "क्लाइंट का नाम *",
        clientCompany: "क्लाइंट की कंपनी",
        clientEmail: "क्लाइंट का ईमेल",
        industry: "उद्योग",
        projectTitle: "प्रोजेक्ट का शीर्षक *",
        projectType: "प्रोजेक्ट का प्रकार *",
        projectTypeHint: "(आप क्या करते हैं)",
        suggestedFor: "इसके लिए सुझाया गया",
        whatDoYouDo: "आप क्या करते हैं?",
        whatDoYouDoHint: "(ताकि हम प्रपोज़ल को बेहतर बना सकें)",
        scope: "प्रोजेक्ट का दायरा *",
        budget: "बजट राशि *",
        budgetType: "बजट का प्रकार",
        timeline: "समयरेखा",
        startDate: "नियोजित शुरुआत तिथि",
        paymentTerms: "भुगतान की शर्तें",
        lineItemsEnabled: "विस्तृत मूल्य निर्धारण (आइटम वार)",
      },
      placeholders: {
        clientName: "जैसे: राहुल शर्मा",
        clientCompany: "जैसे: एक्मे कॉर्प",
        clientEmail: "client@example.com",
        projectTitle: "जैसे: वेबसाइट पुनरुद्धार",
        scope: "बताएं कि आप क्या करेंगे...",
        budget: "5000",
      },
      buttons: {
        generate: "प्रपोज़ल जनरेट करें →",
        generating: "जनरेट हो रहा है...",
      },
    },
    ai: {
      generating: "प्रपोज़ल तैयार हो रहा है...",
      systemPrompt: "पेशेवर और प्रभावशाली हिंदी में लिखें जो भारतीय फ्रीलांस बाजार के लिए उपयुक्त हो।",
    }
  },

  // =============================================
  // 🇫🇷 FRENCH
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
        { title: "Image de Marque Elite", desc: "Démarquez-vous des documents genériques. Exportez des PDFs parfaits qui vous font ressembler à une agence top." },
        { title: "Votre Cockpit Commercial", desc: "Suivez chaque affaire en un coup d'œil. Identifiez les clients prêts à signer." },
        { title: "Relances Automatiques", desc: "Ne semandez plus jamais importun. Configurez des suivis automatiques qui gèrent la relance à votre place." },
        { title: "La Protection Juridique", desc: "Protégez votre travail. Dès l'acceptation, un contrat juridique est prêt. Plus de travail sans filet." },
        { title: "Sécurité des Paiements", desc: "Le flux complet : Proposition → Contrat → Facture. Garantissez votre paiement pour chaque heure travaillée." },
      ],
    },
    dashboard: {
      sidebar: {
        dashboard: "Tableau de bord",
        proposals: "Propositions",
        newProposal: "Nouvelle Proposition",
        pipeline: "Pipeline",
        clients: "Clients",
        analytics: "Analyses",
        contracts: "Contrats",
        invoices: "Factures",
        templates: "Modèles",
        referrals: "Parrainage",
        feedback: "Feedback",
        billing: "Facturation",
        settings: "Paramètres",
        helpSupport: "Aide & Support",
        searchHint: "⌘K pour chercher",
        upgradePro: "Passer à Pro →",
        freePlanMsg: "Vous êtes en version Gratuite.",
      },
      topbar: {
        searchPlaceholder: "Chercher...",
        newProposal: "Nouvelle Proposition",
        help: "Aide",
        profile: "Profil",
        billing: "Facturation",
        signOut: "Déconnexion",
        notifications: "Notifications",
        titles: {
          "/dashboard": "Tableau de bord",
          "/proposals": "Propositions",
          "/proposals/new": "Nouvelle Proposition",
          "/clients": "Clients",
          "/templates": "Modèles",
          "/settings": "Paramètres",
          "/analytics": "Analyses",
          "/contracts": "Contrats",
          "/invoices": "Factures",
          "/pipeline": "Pipeline",
          "/referrals": "Parrainage",
          "/billing": "Facturation",
        }
      },
      stats: {
        totalProposals: "Total des Propositions",
        winRate: "Taux de Victoire",
        viewed: "Propositions Vues",
        valueWon: "Valeur Totale Gagnée",
        thisWeek: "cette semaine",
        createFirst: "Créez votre première",
        vsLastMonth: "vs mois dernier",
        noData: "Pas encore de données",
        reading: "les clients lisent",
      },
      recentProposals: {
        title: "Propositions Récentes",
        viewAll: "Voir tout →",
        empty: "Pas encore de propositions.",
        headers: {
          client: "Client",
          type: "Type",
          value: "Valeur",
          status: "Statut",
          sent: "Envoyé",
          actions: "Actions",
        },
        status: {
          draft: "Brouillon",
          sent: "Envoyé",
          accepted: "Accepté",
          signed: "Signé",
          declined: "Refusé",
          paid: "Payé",
          overdue: "En retard",
          cancelled: "Annulé",
        },
      },
      welcome: {
        title: "Bienvenue sur Proposar !",
        subtitle: "Commencez en trois étapes :",
        step1: "Complétez votre profil dans les Paramètres",
        step2: "Créez votre première proposition",
        step3: "Partagez le lien et suivez quand les clients l'ouvrent",
        cta: "Créer ma première proposition",
        later: "Plus tard",
      },
      attention: {
        title: "Propositions Nécessitant une Attention",
        allCaughtUp: "🎉 Tout est à jour ! Aucune proposition ne nécessite de suivi.",
        daysSince: "jours depuis l'envoi",
        followUp: "Envoyer un Suivi",
      },
      clientsPage: {
        title: "Clients",
        addClient: "Ajouter un client",
        searchPlaceholder: "Rechercher des clients...",
        sortOptions: {
          activity: "Dernière activité",
          nameAZ: "Nom A-Z",
          nameZA: "Nom Z-A",
          proposalsHigh: "Propositions (plus)",
          valueHigh: "Valeur (plus élevée)",
        },
        loading: "Chargement des clients...",
        empty: "Aucun client pour le moment. Ajoutez votre premier client.",
        headers: {
          name: "Nom",
          company: "Entreprise",
          email: "Email",
          proposals: "Propositions",
          winRate: "Taux de succès",
          totalValue: "Valeur totale",
          activity: "Dernière activité",
          actions: "Actions",
        },
        actions: {
          edit: "Modifier",
          delete: "Supprimer",
        },
        modal: {
          addTitle: "Ajouter un Client",
          editTitle: "Modifier le Client",
          deleteTitle: "Supprimer le Client",
          deleteConfirm: "Supprimer ce client ? Les propositions liées resteront conservées.",
          nameLabel: "Nom *",
          companyLabel: "Entreprise",
          emailLabel: "Email",
          notesLabel: "Notes",
          save: "Enregistrer",
          cancel: "Annuler",
        },
      },
      contractsPage: {
        title: "Contrats",
        newContract: "Nouveau Contrat",
        loading: "Chargement des contrats...",
        empty: "Aucun contrat pour le moment.",
        createFirst: "Créez votre premier contrat",
        retry: "Réessayer",
        headers: {
          title: "Titre",
          client: "Client",
          status: "Statut",
          created: "Créé le",
          actions: "Actions",
        },
        actions: {
          view: "Voir",
        },
      },
      invoicesPage: {
        title: "Factures",
        newInvoice: "Nouvelle Facture",
        empty: "Aucune facture pour le moment.",
        loading: "Chargement des factures...",
        retry: "Réessayer",
        createFirst: "Créez votre première facture",
        headers: {
          number: "#",
          title: "Titre",
          client: "Client",
          amount: "Montant",
          status: "Statut",
          due: "Échéance",
          actions: "Actions",
        },
        actions: {
          manage: "Gérer",
          public: "Public",
          pdf: "PDF",
        },
      },
      settingsPage: {
        title: "Paramètres",
        tabs: {
          profile: "Profil",
          branding: "Image de Marque",
          defaults: "Options par Défaut",
          notifications: "Notifications",
          billing: "Facturation",
          integrations: "Intégrations",
          account: "Compte",
        },
        profile: {
          title: "Profil",
          fullName: "Nom complet",
          emailReadOnly: "Email (lecture seule)",
          businessName: "Nom de l'entreprise",
          businessType: "Type d'entreprise",
          website: "Site web",
          phone: "Téléphone",
          bio: "Bio (À Propos dans les propositions)",
          city: "Ville",
          country: "Pays",
          countryPlaceholder: "ex. France, Canada",
          gdprMode: "Activer le Mode Conformité RGPD/Global",
          gdprHint: "(Ajoute des mentions de confidentialité et gère les données selon les normes internationales)",
        },
        branding: {
          title: "Image de Marque",
          logoLabel: "Logo (affiché sur les propositions)",
          brandColor: "Couleur de marque (accent sur les propositions)",
          signatureText: "Texte de signature par défaut",
          signaturePlaceholder: "Cordialement, [Votre Nom]",
          addressLabel: "Adresse de l'entreprise (sur les propositions)",
          paymentTerms: "Conditions de paiement par défaut",
          currency: "Devise par défaut",
        },
        defaults: {
          title: "Options par Défaut",
          tone: "Ton par défaut",
          sections: "Sections à inclure par défaut",
          expiryDays: "Délai d'expiration par défaut (jours)",
          expiryHint: "Les propositions expirent après ce nombre de jours",
          followUpLabel: "Rappel de suivi automatique",
          followUpDays: "Jours d'attente avant le rappel",
        },
        notifications: {
          title: "Notifications",
          proposalViewed: "Quand un client consulte ma proposition",
          proposalAccepted: "Quand une proposition est acceptée",
          proposalDeclined: "Quand une proposition est refusée",
          proposalExpired: "Quand une proposition expire",
          weeklySummary: "Email de résumé hebdomadaire",
          productUpdates: "Mises à jour produit et conseils",
        },
        billing: {
          title: "Facturation",
          currentPlan: "Plan actuel",
          nextBilling: "Prochaine date de facturation",
          usageThisMonth: "Utilisation ce mois-ci",
          usageLabel: "propositions",
          usageLabelOf: "sur",
          manageButton: "Gérer la Facturation",
          manageHint: "Mettre à jour le paiement, voir les factures ou annuler.",
          upgradeLink: "Passer au plan supérieur",
          upgradeSuffix: "pour plus de propositions.",
        },
        integrations: {
          description: "Connectez vos outils. Utilisez les webhooks Zapier pour automatiser les propositions avec votre CRM ou votre flux de travail.",
          zapierButton: "Webhooks →",
          comingSoon: "Bientôt disponible",
        },
        account: {
          title: "Compte",
          changePassword: "Changer le mot de passe",
          passwordHint: "Nous enverrons un lien de réinitialisation à votre email. Vérifiez votre boîte après avoir cliqué.",
          resetButton: "Envoyer l'email de réinitialisation",
          changeEmail: "Modifier l'email",
          emailHint: "Contactez le support pour modifier votre adresse email.",
          exportTitle: "Exporter les données (RGPD)",
          exportHint: "Téléchargez votre profil, propositions, clients et modèles au format JSON.",
          exportButton: "Exporter mes données",
          deleteTitle: "Supprimer le compte",
          deleteHint: "Supprimer définitivement votre compte et toutes vos données. Cette action est irréversible.",
          deletePlaceholder: 'Tapez "DELETE" pour confirmer',
          deleteButton: "Supprimer le compte",
        },
        common: {
          save: "Enregistrer",
          cancel: "Annuler",
          loading: "Chargement...",
          saving: "Enregistrement...",
        },
      },
    },
    proposalForm: {
      onboardingMsg: "Utilisation des paramètres par défaut pour le ton, les sections, la devise, les conditions de paiement et la date d'expiration. Vous pouvez tout modifier ci-dessous.",
      sections: {
        client: "À propos du Client",
        project: "À propos du Projet",
        pricing: "Tarification & Calendrier",
      },
      fields: {
        existingClient: "Sélectionner un client existant",
        selectClient: "Sélectionnez un client",
        loadingClients: "Chargement des clients...",
        noClients: "Aucun client trouvé. Ajoutez des clients d'abord depuis la page Clients.",
        clientName: "Nom du Client *",
        clientCompany: "Entreprise du Client",
        clientEmail: "Email du Client",
        industry: "Secteur",
        projectTitle: "Titre du Projet *",
        projectType: "Type de Projet *",
        projectTypeHint: "(ce que vous faites)",
        suggestedFor: "Suggéré pour",
        whatDoYouDo: "Que faites-vous ?",
        whatDoYouDoHint: "(pour que nous puissions adapter la proposition)",
        scope: "Portée du Projet *",
        budget: "Montant du Budget *",
        budgetType: "Type de Budget",
        timeline: "Calendrier",
        startDate: "Date de Début Prévue",
        paymentTerms: "Conditions de Paiement",
        lineItemsEnabled: "Tarification Détaillée (par articles)",
      },
      placeholders: {
        clientName: "ex: Jean Dupont",
        clientCompany: "ex: Acme Corp",
        clientEmail: "client@exemple.com",
        projectTitle: "ex: Refonte de Site Web",
        scope: "Décrivez ce que vous allez faire...",
        budget: "5000",
      },
      buttons: {
        generate: "Générer la Proposition →",
        generating: "Génération...",
      },
    },
    ai: {
      generating: "Génération de la proposition...",
      systemPrompt: "Écrivez en français professionnel et persuasif adapté au marché européen et francophone.",
    }
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

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.en;
}
