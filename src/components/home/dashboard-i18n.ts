export type DashboardLocale = 'en' | 'fr' | 'ar';

type DashboardCopy = {
  nav: {
    home: string;
    favorites: string;
    weddingDate: string;
    checklist: string;
    guestList: string;
    budgetPlanner: string;
    planningTools: string;
    allVendors: string;
    venues: string;
    inspiration: string;
    marketplace: string;
  };
  topbar: {
    searchPlaceholder: string;
    searchingVendors: string;
    noVendorsFound: string;
    language: string;
    member: string;
    signIn: string;
    accountSettings: string;
    disconnect: string;
  };
  rightSidebar: {
    checklistTitle: string;
    weddingDateTitle: string;
    noWeddingDate: string;
    openWeddingDate: string;
    planningProgressTitle: string;
    tasksDone: string;
    completed: string;
    pending: string;
    viewAllTasks: string;
    savedVendors: string;
  };
  vendors: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCities: string;
    allCategories: string;
    noVendorsFound: string;
    loadingMore: string;
    reachedEnd: string;
    panelCloseVendor: string;
    panelOverview: string;
    panelCategory: string;
    panelStartingPrice: string;
    panelEmail: string;
    panelPhoneNumber: string;
    panelTapToReveal: string;
    panelInstagram: string;
    panelOpenInstagram: string;
    panelGoogleMaps: string;
    panelViewLocation: string;
    panelSimilarVendors: string;
    panelSameCategoryCity: string;
    defaultOverviewTemplate: string;
  };
  favorites: {
    title: string;
    subtitle: string;
    saved: string;
    emptyTitle: string;
    emptySubtitle: string;
    browseVendors: string;
    defaultLocation: string;
    defaultCategory: string;
  };
  tools: {
    loading: string;
    signinTitle: string;
    signinSubtitle: string;
    signIn: string;
  };
  checklist: {
    title: string;
    subtitle: string;
    completed: string;
    overallProgress: string;
    searchPlaceholder: string;
    all: string;
    markNotDone: string;
    markDone: string;
  };
  settings: {
    loading: string;
    signinTitle: string;
    signinSubtitle: string;
    signIn: string;
    title: string;
    subtitle: string;
    profile: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    weddingDetails: string;
    weddingDate: string;
    city: string;
    estimatedGuests: string;
    budget: string;
    languageCurrency: string;
    language: string;
    currency: string;
    notifications: string;
    emailNotifications: string;
    whatsappNotifications: string;
    savedLocally: string;
    saveChanges: string;
  };
  auth: {
    title: string;
    subtitle: string;
    signIn: string;
    signUp: string;
  };
  inspiration: {
    title: string;
    subtitle: string;
    closeArticlePanel: string;
    overview: string;
    article: string;
    category: string;
    readTime: string;
    min: string;
    author: string;
    published: string;
    similarGuides: string;
    recommendedInspiration: string;
    openFullArticle: string;
    defaultAuthor: string;
  };
  planning: {
    title: string;
    subtitle: string;
    chapterOf: string;
    minRead: string;
    doThisNow: string;
    previous: string;
    next: string;
    timeline: string;
    final: string;
    months: string;
    guideChapters: string;
  };
};

const copy: Record<DashboardLocale, DashboardCopy> = {
  en: {
    nav: {
      home: 'Home',
      favorites: 'Favorites',
      weddingDate: 'Wedding Date',
      checklist: 'Wedding Checklist',
      guestList: 'Guest List',
      budgetPlanner: 'Budget Planner',
      planningTools: 'Planning Tools',
      allVendors: 'All Vendors',
      venues: 'Venues',
      inspiration: 'Inspiration',
      marketplace: 'Marketplace',
    },
    topbar: {
      searchPlaceholder: 'Search for vendors or locations...',
      searchingVendors: 'Searching vendors...',
      noVendorsFound: 'No vendors found.',
      language: 'Language',
      member: 'Member',
      signIn: 'Sign In',
      accountSettings: 'Account settings',
      disconnect: 'Disconnect',
    },
    rightSidebar: {
      checklistTitle: 'Wedding Checklist',
      weddingDateTitle: 'Wedding Date',
      noWeddingDate: 'Not set yet',
      openWeddingDate: 'Open Wedding Date',
      planningProgressTitle: 'Planning Progress',
      tasksDone: '{done}/{total} tasks done',
      completed: 'Completed',
      pending: 'Pending',
      viewAllTasks: 'View All Tasks',
      savedVendors: 'Saved Vendors',
    },
    vendors: {
      title: 'All Vendors',
      subtitle: 'Browse wedding vendors across Morocco.',
      searchPlaceholder: 'Search vendor names or styles...',
      allCities: 'All Cities',
      allCategories: 'All Categories',
      noVendorsFound: 'No vendors found for this filter.',
      loadingMore: 'Loading more vendors...',
      reachedEnd: 'You reached the end.',
      panelCloseVendor: 'Close vendor panel',
      panelOverview: 'Overview',
      panelCategory: 'Category',
      panelStartingPrice: 'Starting Price',
      panelEmail: 'Email',
      panelPhoneNumber: 'Phone Number',
      panelTapToReveal: 'Tap to reveal',
      panelInstagram: 'Instagram',
      panelOpenInstagram: 'Open Instagram',
      panelGoogleMaps: 'Google Maps',
      panelViewLocation: 'View location',
      panelSimilarVendors: 'Similar Vendors',
      panelSameCategoryCity: 'Same category and city',
      defaultOverviewTemplate: '{name} is one of the featured {category} vendors in {city}.',
    },
    favorites: {
      title: 'Favorites',
      subtitle: 'Your saved vendors in one place.',
      saved: 'saved',
      emptyTitle: 'No favorites yet',
      emptySubtitle: 'Save vendors from listings to build your shortlist.',
      browseVendors: 'Browse Vendors',
      defaultLocation: 'Morocco',
      defaultCategory: 'Vendor',
    },
    tools: {
      loading: 'Loading your tools...',
      signinTitle: 'Sign in to access your account tools',
      signinSubtitle: 'Your planner, guest list, and budget live in your account.',
      signIn: 'Sign In',
    },
    checklist: {
      title: 'Wedding Checklist',
      subtitle: 'Track every step and stay on schedule.',
      completed: 'completed',
      overallProgress: 'Overall Progress',
      searchPlaceholder: 'Search checklist tasks',
      all: 'All',
      markNotDone: 'Mark as not done',
      markDone: 'Mark as done',
    },
    settings: {
      loading: 'Loading settings...',
      signinTitle: 'Sign in to access settings',
      signinSubtitle: 'Your account settings are available after login.',
      signIn: 'Sign In',
      title: 'Account Settings',
      subtitle: 'Manage your profile and wedding preferences.',
      profile: 'Profile',
      fullName: 'Full Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      weddingDetails: 'Wedding Details',
      weddingDate: 'Wedding Date',
      city: 'City',
      estimatedGuests: 'Estimated Guests',
      budget: 'Budget',
      languageCurrency: 'Language & Currency',
      language: 'Language',
      currency: 'Currency',
      notifications: 'Notifications',
      emailNotifications: 'Email Notifications',
      whatsappNotifications: 'WhatsApp Notifications',
      savedLocally: 'Settings saved locally.',
      saveChanges: 'Save Changes',
    },
    auth: {
      title: 'Welcome to Wervice',
      subtitle: 'Sign in or create an account to access your dashboard tools, favorites, and planning settings.',
      signIn: 'Sign In',
      signUp: 'Sign Up',
    },
    inspiration: {
      title: 'Inspiration',
      subtitle: 'Explore guides and real wedding ideas.',
      closeArticlePanel: 'Close article panel',
      overview: 'Overview',
      article: 'Article',
      category: 'Category',
      readTime: 'Read Time',
      min: 'min',
      author: 'Author',
      published: 'Published',
      similarGuides: 'Similar Guides',
      recommendedInspiration: 'Recommended inspiration',
      openFullArticle: 'Open Full Article',
      defaultAuthor: 'Wervice Editorial',
    },
    planning: {
      title: 'Planning Tools',
      subtitle: '12-month timeline and chapter-by-chapter planning resources.',
      chapterOf: 'Chapter {current} of {total}',
      minRead: '{count} min read',
      doThisNow: 'Do This Now',
      previous: 'Previous',
      next: 'Next',
      timeline: 'Timeline',
      final: 'Final',
      months: '{count} months',
      guideChapters: 'Guide Chapters',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      favorites: 'Favoris',
      weddingDate: 'Date du mariage',
      checklist: 'Checklist mariage',
      guestList: 'Liste des invités',
      budgetPlanner: 'Planificateur de budget',
      planningTools: 'Outils de planification',
      allVendors: 'Tous les prestataires',
      venues: 'Lieux',
      inspiration: 'Inspiration',
      marketplace: 'Marketplace',
    },
    topbar: {
      searchPlaceholder: 'Rechercher des prestataires ou lieux...',
      searchingVendors: 'Recherche des prestataires...',
      noVendorsFound: 'Aucun prestataire trouvé.',
      language: 'Langue',
      member: 'Membre',
      signIn: 'Se connecter',
      accountSettings: 'Paramètres du compte',
      disconnect: 'Déconnexion',
    },
    rightSidebar: {
      checklistTitle: 'Checklist mariage',
      weddingDateTitle: 'Date du mariage',
      noWeddingDate: 'Pas encore définie',
      openWeddingDate: 'Ouvrir Date du mariage',
      planningProgressTitle: 'Progression planning',
      tasksDone: '{done}/{total} tâches faites',
      completed: 'Terminé',
      pending: 'En attente',
      viewAllTasks: 'Voir toutes les tâches',
      savedVendors: 'Prestataires sauvegardés',
    },
    vendors: {
      title: 'Tous les prestataires',
      subtitle: 'Parcourez les prestataires de mariage au Maroc.',
      searchPlaceholder: 'Rechercher un nom ou un style...',
      allCities: 'Toutes les villes',
      allCategories: 'Toutes les catégories',
      noVendorsFound: 'Aucun prestataire trouvé pour ce filtre.',
      loadingMore: 'Chargement de plus de prestataires...',
      reachedEnd: 'Vous avez atteint la fin.',
      panelCloseVendor: 'Fermer le panneau prestataire',
      panelOverview: 'Aperçu',
      panelCategory: 'Catégorie',
      panelStartingPrice: 'Prix de départ',
      panelEmail: 'E-mail',
      panelPhoneNumber: 'Téléphone',
      panelTapToReveal: 'Appuyer pour afficher',
      panelInstagram: 'Instagram',
      panelOpenInstagram: 'Ouvrir Instagram',
      panelGoogleMaps: 'Google Maps',
      panelViewLocation: 'Voir la localisation',
      panelSimilarVendors: 'Prestataires similaires',
      panelSameCategoryCity: 'Même catégorie et même ville',
      defaultOverviewTemplate: '{name} fait partie des prestataires {category} recommandés à {city}.',
    },
    favorites: {
      title: 'Favoris',
      subtitle: 'Vos prestataires sauvegardés au même endroit.',
      saved: 'sauvegardés',
      emptyTitle: 'Aucun favori pour le moment',
      emptySubtitle: 'Sauvegardez des prestataires depuis les listings pour créer votre sélection.',
      browseVendors: 'Parcourir les prestataires',
      defaultLocation: 'Maroc',
      defaultCategory: 'Prestataire',
    },
    tools: {
      loading: 'Chargement de vos outils...',
      signinTitle: 'Connectez-vous pour accéder à vos outils',
      signinSubtitle: 'Votre planning, votre liste invités et votre budget sont dans votre compte.',
      signIn: 'Se connecter',
    },
    checklist: {
      title: 'Checklist mariage',
      subtitle: 'Suivez chaque étape et restez dans les délais.',
      completed: 'terminé',
      overallProgress: 'Progression globale',
      searchPlaceholder: 'Rechercher une tâche',
      all: 'Toutes',
      markNotDone: 'Marquer comme non fait',
      markDone: 'Marquer comme fait',
    },
    settings: {
      loading: 'Chargement des paramètres...',
      signinTitle: 'Connectez-vous pour accéder aux paramètres',
      signinSubtitle: 'Vos paramètres de compte sont disponibles après connexion.',
      signIn: 'Se connecter',
      title: 'Paramètres du compte',
      subtitle: 'Gérez votre profil et vos préférences mariage.',
      profile: 'Profil',
      fullName: 'Nom complet',
      email: 'E-mail',
      phoneNumber: 'Numéro de téléphone',
      weddingDetails: 'Détails du mariage',
      weddingDate: 'Date du mariage',
      city: 'Ville',
      estimatedGuests: 'Invités estimés',
      budget: 'Budget',
      languageCurrency: 'Langue et devise',
      language: 'Langue',
      currency: 'Devise',
      notifications: 'Notifications',
      emailNotifications: 'Notifications e-mail',
      whatsappNotifications: 'Notifications WhatsApp',
      savedLocally: 'Paramètres enregistrés localement.',
      saveChanges: 'Enregistrer les modifications',
    },
    auth: {
      title: 'Bienvenue sur Wervice',
      subtitle: 'Connectez-vous ou créez un compte pour accéder à vos outils, favoris et paramètres de planification.',
      signIn: 'Se connecter',
      signUp: 'Créer un compte',
    },
    inspiration: {
      title: 'Inspiration',
      subtitle: 'Explorez des guides et des idées de mariages réels.',
      closeArticlePanel: 'Fermer le panneau article',
      overview: 'Aperçu',
      article: 'Article',
      category: 'Catégorie',
      readTime: 'Temps de lecture',
      min: 'min',
      author: 'Auteur',
      published: 'Publié',
      similarGuides: 'Guides similaires',
      recommendedInspiration: 'Inspiration recommandée',
      openFullArticle: "Ouvrir l'article complet",
      defaultAuthor: 'Éditorial Wervice',
    },
    planning: {
      title: 'Outils de planification',
      subtitle: 'Chronologie sur 12 mois et ressources chapitre par chapitre.',
      chapterOf: 'Chapitre {current} sur {total}',
      minRead: '{count} min de lecture',
      doThisNow: 'À faire maintenant',
      previous: 'Précédent',
      next: 'Suivant',
      timeline: 'Chronologie',
      final: 'Final',
      months: '{count} mois',
      guideChapters: 'Chapitres du guide',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      favorites: 'المفضلة',
      weddingDate: 'تاريخ الزفاف',
      checklist: 'قائمة مهام الزفاف',
      guestList: 'قائمة الضيوف',
      budgetPlanner: 'مخطط الميزانية',
      planningTools: 'أدوات التخطيط',
      allVendors: 'كل المزوّدين',
      venues: 'الأماكن',
      inspiration: 'الإلهام',
      marketplace: 'المتجر',
    },
    topbar: {
      searchPlaceholder: 'ابحث عن مزوّدين أو أماكن...',
      searchingVendors: 'جاري البحث عن المزوّدين...',
      noVendorsFound: 'لم يتم العثور على مزوّدين.',
      language: 'اللغة',
      member: 'عضو',
      signIn: 'تسجيل الدخول',
      accountSettings: 'إعدادات الحساب',
      disconnect: 'تسجيل الخروج',
    },
    rightSidebar: {
      checklistTitle: 'قائمة مهام الزفاف',
      weddingDateTitle: 'تاريخ الزفاف',
      noWeddingDate: 'غير محدد بعد',
      openWeddingDate: 'فتح تاريخ الزفاف',
      planningProgressTitle: 'تقدم التخطيط',
      tasksDone: '{done}/{total} مهام مكتملة',
      completed: 'مكتمل',
      pending: 'قيد الانتظار',
      viewAllTasks: 'عرض كل المهام',
      savedVendors: 'المزوّدون المحفوظون',
    },
    vendors: {
      title: 'كل المزوّدين',
      subtitle: 'تصفح مزوّدي حفلات الزفاف في المغرب.',
      searchPlaceholder: 'ابحث عن الأسماء أو الأنماط...',
      allCities: 'كل المدن',
      allCategories: 'كل الفئات',
      noVendorsFound: 'لم يتم العثور على مزوّدين لهذا الفلتر.',
      loadingMore: 'جاري تحميل المزيد من المزوّدين...',
      reachedEnd: 'لقد وصلت إلى النهاية.',
      panelCloseVendor: 'إغلاق لوحة المزوّد',
      panelOverview: 'نظرة عامة',
      panelCategory: 'الفئة',
      panelStartingPrice: 'السعر الابتدائي',
      panelEmail: 'البريد الإلكتروني',
      panelPhoneNumber: 'رقم الهاتف',
      panelTapToReveal: 'اضغط للإظهار',
      panelInstagram: 'إنستغرام',
      panelOpenInstagram: 'فتح إنستغرام',
      panelGoogleMaps: 'خرائط Google',
      panelViewLocation: 'عرض الموقع',
      panelSimilarVendors: 'مزوّدون مشابهون',
      panelSameCategoryCity: 'نفس الفئة ونفس المدينة',
      defaultOverviewTemplate: '{name} من مزوّدي {category} المميزين في {city}.',
    },
    favorites: {
      title: 'المفضلة',
      subtitle: 'المزوّدون المحفوظون في مكان واحد.',
      saved: 'محفوظ',
      emptyTitle: 'لا توجد مفضلة بعد',
      emptySubtitle: 'احفظ المزوّدين من القوائم لإنشاء قائمتك المختصرة.',
      browseVendors: 'تصفح المزوّدين',
      defaultLocation: 'المغرب',
      defaultCategory: 'مزوّد',
    },
    tools: {
      loading: 'جاري تحميل أدواتك...',
      signinTitle: 'سجّل الدخول للوصول إلى أدوات الحساب',
      signinSubtitle: 'المخطط وقائمة الضيوف والميزانية داخل حسابك.',
      signIn: 'تسجيل الدخول',
    },
    checklist: {
      title: 'قائمة مهام الزفاف',
      subtitle: 'تابع كل خطوة وابقَ على الجدول.',
      completed: 'مكتمل',
      overallProgress: 'التقدم العام',
      searchPlaceholder: 'ابحث في مهام القائمة',
      all: 'الكل',
      markNotDone: 'وضع كغير منجز',
      markDone: 'وضع كمنجز',
    },
    settings: {
      loading: 'جاري تحميل الإعدادات...',
      signinTitle: 'سجّل الدخول للوصول إلى الإعدادات',
      signinSubtitle: 'إعدادات حسابك متاحة بعد تسجيل الدخول.',
      signIn: 'تسجيل الدخول',
      title: 'إعدادات الحساب',
      subtitle: 'إدارة ملفك الشخصي وتفضيلات الزفاف.',
      profile: 'الملف الشخصي',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phoneNumber: 'رقم الهاتف',
      weddingDetails: 'تفاصيل الزفاف',
      weddingDate: 'تاريخ الزفاف',
      city: 'المدينة',
      estimatedGuests: 'العدد المتوقع للضيوف',
      budget: 'الميزانية',
      languageCurrency: 'اللغة والعملة',
      language: 'اللغة',
      currency: 'العملة',
      notifications: 'الإشعارات',
      emailNotifications: 'إشعارات البريد الإلكتروني',
      whatsappNotifications: 'إشعارات واتساب',
      savedLocally: 'تم حفظ الإعدادات محلياً.',
      saveChanges: 'حفظ التغييرات',
    },
    auth: {
      title: 'مرحباً بك في Wervice',
      subtitle: 'سجّل الدخول أو أنشئ حساباً للوصول إلى أدواتك ومفضلاتك وإعدادات التخطيط.',
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
    },
    inspiration: {
      title: 'الإلهام',
      subtitle: 'استكشف الأدلة وأفكار الزفاف الحقيقية.',
      closeArticlePanel: 'إغلاق لوحة المقال',
      overview: 'نظرة عامة',
      article: 'المقال',
      category: 'الفئة',
      readTime: 'مدة القراءة',
      min: 'دقيقة',
      author: 'الكاتب',
      published: 'تاريخ النشر',
      similarGuides: 'أدلة مشابهة',
      recommendedInspiration: 'إلهام مقترح',
      openFullArticle: 'فتح المقال الكامل',
      defaultAuthor: 'فريق Wervice التحريري',
    },
    planning: {
      title: 'أدوات التخطيط',
      subtitle: 'جدول زمني لـ 12 شهراً وموارد تخطيط حسب الفصول.',
      chapterOf: 'الفصل {current} من {total}',
      minRead: '{count} دقيقة قراءة',
      doThisNow: 'افعل هذا الآن',
      previous: 'السابق',
      next: 'التالي',
      timeline: 'الجدول الزمني',
      final: 'الأخير',
      months: '{count} شهر',
      guideChapters: 'فصول الدليل',
    },
  },
};

function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
}

export function getDashboardCopy(locale: string) {
  return copy[(locale as DashboardLocale) || 'en'] || copy.en;
}

export function interpolateCopy(template: string, values: Record<string, string | number>) {
  return interpolate(template, values);
}
