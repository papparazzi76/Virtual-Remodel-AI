
export const es = {
  appTitle: {
    virtual: "Virtual",
    remodelAI: "Remodel AI"
  },
  header: {
    upgrade: "Actualizar",
    credits: "Créditos",
    pricing: "Precios"
  },
  auth: {
    loginTitle: "Inicia sesión en tu cuenta",
    registerTitle: "Crear una cuenta nueva",
    email: "Correo electrónico",
    password: "Contraseña",
    loginButton: "Iniciar sesión",
    registerButton: "Crear cuenta",
    logout: "Cerrar sesión",
    welcome: "Bienvenido",
    welcomeSubtitle: "Tu asistente de remodelación con IA fotorrealista.",
    noAccount: "¿No tienes una cuenta?",
    hasAccount: "¿Ya tienes una cuenta?",
    switchToRegister: "Regístrate",
    switchToLogin: "Inicia sesión",
    loadingSession: "Cargando tu sesión...",
    // Errors
    invalidCredentials: "Correo o contraseña inválidos. Por favor, inténtalo de nuevo.",
    emailInUse: "Ya existe una cuenta con este correo. Por favor, inicia sesión.",
    genericError: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
  },
  pricing: {
    title: "Elige Tu Plan",
    description: "Planes flexibles con créditos que nunca caducan. Un crédito equivale a una imagen generada.",
    // Plan 1
    individualPlanName: "Individual",
    individualPlanCredits: "100 Créditos",
    individualPlanFeatures: "1 crédito por imagen;Descargas en alta resolución;Acceso a todos los estilos;Para particulares y autónomos",
    getStartedButton: "Empezar",
    // Plan 2 (Most Popular)
    agencyPlanName: "Agencia",
    agencyPlanCredits: "500 Créditos",
    agencyPlanFeatures: "1 crédito por imagen;Descargas en alta resolución;Acceso a todos los estilos;Perfecto para agencias en crecimiento",
    mostPopular: "Más Popular",
    // Plan 3
    enterprisePlanName: "Empresa",
    enterprisePlanPrice: "Personalizado",
    enterprisePlanCredits: "Para necesidades a gran escala",
    enterprisePlanFeatures: "Cantidades de créditos a medida;Soporte dedicado;Acceso API (próximamente);Gestión de equipos",
    contactUsButton: "Contáctanos",

    trialExpiredTitle: "Tu prueba gratuita ha finalizado",
    trialExpiredMessage: "Por favor, elige un plan para seguir creando remodelaciones increíbles.",
    remindLaterButton: "Recordármelo más tarde",
    processing: "Procesando...",
    genericError: "No se pudo procesar el pago. Por favor, inténtalo de nuevo."
  },
  controls: {
    title: "Controles",
    remodelingType: "Tipo de remodelación",
    withFurniture: "Con muebles",
    emptyRoom: "Habitación vacía",
    lightingMood: "Ambiente de iluminación",
    decorStyle: "Estilo de decoración",
    wallMaterial: "Material de la pared",
    floorMaterial: "Material del suelo",
    ceilingMaterial: "Material del techo",
    mode: "Modo",
    styleMode: "Estilo",
    customMode: "Personalizado",
    editMode: "Edición",
    roomType: "Tipo de habitación",
    customPrompt: "Instrucciones para la IA",
    customPromptPlaceholder: "p. ej., 'Coloca el sofá contra la pared del fondo y usa el mármol solo para el suelo.'"
  },
  imageUploader: {
    upload: "Haz clic para subir",
    dragAndDrop: "o arrastra y suelta",
    fileTypes: "PNG, JPG o WEBP",
    or: "o",
    trySample: "O prueba una de nuestras muestras"
  },
  display: {
    original: "Original",
    remodeled: "Remodelado",
    awaiting: "Generando...",
    download: "Descargar imagen"
  },
  actions: {
    generate: "✨ Generar remodelación",
    generating: "Generando...",
    startOver: "Empezar de nuevo",
    trySample: "Probar Muestra"
  },
  messages: {
    welcome: "Bienvenido a Virtual Remodel AI",
    uploadPrompt: "Sube una foto de tu habitación para comenzar tu transformación virtual.",
    errorUpload: "Por favor, sube una imagen primero.",
    errorGenerate: "Error al generar la imagen. Por favor, inténtalo de nuevo.",
    errorSample: "Error al cargar la imagen de muestra. Por favor, revisa tu conexión e inténtalo de nuevo.",
    errorMask: "Por favor, selecciona un área para editar antes de generar.",
    errorNoCredits: "Te has quedado sin créditos. Por favor, compra un plan para continuar."
  },
  loader: {
    generating: "Generando tu obra maestra...",
    wait: "Esto puede tomar un momento."
  },
  roomTypeLabels: {
    masterBedroom: "Dormitorio principal",
    singleBedroom: "Dormitorio simple",
    youthBedroom: "Dormitorio juvenil",
    powderRoom: "Aseo",
    fullBathroom: "Baño completo",
    kitchen: "Cocina",
    livingRoom: "Salón",
    familyRoom: "Sala de estar",
    terrace: "Terraza",
    garden: "Jardín",
    garage: "Garaje"
  },
  decorStyleLabels: {
    modern: "Moderno",
    contemporary: "Contemporáneo",
    minimalist: "Minimalista",
    scandinavian: "Escandinavo",
    rustic: "Rústico",
    industrial: "Industrial",
    bohoChic: "Boho Chic",
    modernLuxury: "Lujo Moderno",
    classicLuxury: "Lujo Clásico"
  },
  materialLabels: {
    whitePaint: "Pintura Blanca",
    lightWood: "Madera Clara",
    darkWood: "Madera Oscura",
    polishedConcrete: "Concreto Pulido",
    marbleTile: "Baldosa de Mármol",
    exposedBrick: "Ladrillo Visto",
    modernTile: "Baldosa Moderna"
  },
  lightingLabels: {
    brightAiry: "Luminoso y Aireado",
    warmCozy: "Cálido y Acogedor",
    coolModern: "Fresco y Moderno",
    dramaticDim: "Dramático y Tenue"
  },
  samples: {
    livingRoom: "Sala de Estar",
    bedroom: "Dormitorio",
    kitchen: "Cocina",
    bathroom: "Baño"
  },
  search: {
    placeholder: "Buscar artículos...",
    noResults: "Ningún artículo coincide con los filtros actuales."
  },
  tabs: {
    myUploads: "Mis Archivos",
    all: "Todos",
  },
  customLibrary: {
    title: "Mi Biblioteca",
    description: "Sube tus propios materiales, muebles y decoración para usar en la remodelación. Selecciona elementos para incluirlos.",
    wallmaterial: "Materiales Pared",
    floormaterial: "Materiales Suelo",
    door: "Puertas",
    window: "Ventanas",
    furniture: "Muebles",
    appliance: "Equipamiento",
    addItem: "Añadir Elemento",
    dropHere: "Suelta la imagen aquí...",
    uploadPrompt: "Haz clic o arrastra para subir",
    itemName: "Nombre del Elemento",
    category: "Categoría",
    add: "Añadir",
    cancel: "Cancelar",
    empty: "Tu biblioteca está vacía. Añade elementos para empezar."
  },
  inpainting: {
    prompt: "Describe el cambio para el área seleccionada...",
    brushSize: "Tamaño del pincel",
    undo: "Deshacer",
    clearMask: "Borrar máscara"
  },
  landing: {
    heroTitle: "Rediseña Tu Espacio con un Solo Clic",
    heroSubtitle: "Sube una foto de cualquier habitación y deja que nuestra IA genere impresionantes remodelaciones fotorrealistas en segundos. La casa de tus sueños está más cerca de lo que piensas.",
    ctaRegister: "Comienza Gratis",
    ctaDemo: "Prueba la Demo en Vivo",
    galleryTitle: "Mira la Transformación",
    gallerySubtitle: "De anticuado a sobresaliente. Explora lo que nuestra IA puede hacer.",
    featuresTitle: "Por Qué Te Encantará",
    feature1Title: "Rediseños Instantáneos",
    feature1Text: "No más conjeturas. Obtén variaciones de diseño de alta calidad en menos de un minuto.",
    feature2Title: "Estilos Infinitos",
    feature2Text: "Explora docenas de estilos, desde Moderno hasta Rústico, para encontrar tu combinación perfecta.",
    feature3Title: "Qualidade Fotorrealista",
    feature3Text: "Nuestra IA preserva la arquitectura de tu habitación para obtener resultados creíbles e impresionantes.",
    pricingTitle: "Precio ajustado a cada necesidad",
    pricingSubtitle: "Un crédito equivale a una imagen generada. Empieza gratis y luego elige un plan que se ajuste a tus necesidades. Los créditos nunca caducan.",
    finalCtaTitle: "¿Listo para Remodelar Tu Realidad?",
    finalCtaButton: "Comienza Tu Primer Proyecto Ahora"
  },
  demo: {
    exit: "Salir de la Demo y Registrarse"
  },
  purchaseConfirmation: {
    title: "¡Compra exitosa!",
    message: "Has añadido correctamente {count} créditos a tu cuenta.",
    totalCredits: "Tu nuevo saldo es de {count} créditos.",
    cta: "¡Genial!"
  }
};