import { quizEn, type QuizContent, type QuizSection } from "./quiz";

/*
 * Spanish edition of the SFLuv quiz, served at /sfluv-quiz/es.
 *
 * Same questions, answer keys and order as the English quiz in ./quiz, so the
 * two can never score differently: only the words change. Uses "usted".
 */

const sectionsEs: QuizSection[] = [
  {
    id: "tenderloin",
    title: "Sección 1: El Tenderloin",
    lead: "Antes de empezar: un vistazo al Tenderloin",
    facts: [
      {
        summary: "¿Qué es el Tenderloin?",
        body: "El Tenderloin es uno de los vecindarios más incomprendidos de San Francisco. Ante todo, es una comunidad residencial. Aproximadamente el 30 por ciento de sus residentes son niños, una de las concentraciones de niños más altas de la ciudad. Eso significa que miles de familias tienen su hogar en este vecindario."
      },
      {
        summary: "Historia de activismo y liderazgo cultural",
        body: "El Tenderloin tiene una larga historia de activismo y liderazgo cultural. Fue el lugar del levantamiento de Compton’s Cafeteria en 1966, uno de los primeros actos de resistencia LGBTQ organizada en los Estados Unidos. Desde hace mucho tiempo ha sido el hogar de comunidades inmigrantes, familias trabajadoras, artistas y organizadores comunitarios."
      },
      {
        summary: "Por qué importan los pequeños negocios",
        body: "Los pequeños negocios son esenciales aquí. El vecindario está lleno de restaurantes familiares, mercados, salones de belleza, talleres de reparación, cafés y espacios culturales. En todo San Francisco, los pequeños negocios representan más del 95 por ciento de todas las empresas y una parte importante del empleo local."
      },
      {
        summary: "Ubicación y conexión económica",
        body: "Geográficamente, el Tenderloin tiene una ubicación estratégica. Colinda con el Civic Center y se conecta directamente con Market Street. Está a poca distancia a pie de Union Square, el Distrito Financiero y el Distrito de Teatros."
      }
    ],
    questions: [
      {
        number: 1,
        prompt: "¿Qué vecindario de San Francisco tiene la mayor concentración de niños?",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "Noe Valley" },
          { value: "B", label: "The Sunset" },
          { value: "C", label: "El Tenderloin" },
          { value: "D", label: "Pacific Heights" }
        ]
      },
      {
        number: 2,
        prompt: "¿Aproximadamente qué proporción de los residentes del Tenderloin son niños?",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "Alrededor del 5 por ciento" },
          { value: "B", label: "Alrededor del 15 por ciento" },
          { value: "C", label: "Alrededor del 30 por ciento" },
          { value: "D", label: "Alrededor del 50 por ciento" }
        ]
      },
      {
        number: 3,
        prompt: "El Tenderloin es conocido por:",
        answerType: "single",
        correct: ["D"],
        options: [
          { value: "A", label: "Una rica historia de activismo y justicia social" },
          { value: "B", label: "Una comunidad vibrante de pequeños negocios e inmigrantes" },
          { value: "C", label: "Su histórica organización LGBTQ y su liderazgo cultural" },
          { value: "D", label: "Todo lo anterior" }
        ]
      },
      {
        number: 4,
        prompt: "¿Por qué es especialmente importante apoyar a los pequeños negocios del Tenderloin?",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "Porque aumenta el valor de las propiedades más rápido que en el resto de la ciudad" },
          { value: "B", label: "Porque beneficia principalmente a los turistas y a los asistentes a convenciones" },
          {
            value: "C",
            label:
              "Porque los pequeños negocios crean empleos locales, mantienen cerca los servicios cotidianos para las familias y ayudan a fortalecer una economía vecinal más segura y estable"
          },
          { value: "D", label: "Porque baja el costo de la renta en toda la ciudad" },
          { value: "E", label: "Porque reemplaza la necesidad de servicios públicos y organizaciones sin fines de lucro" }
        ]
      },
      {
        number: 5,
        prompt: "¿Por qué es el Tenderloin especialmente importante para la economía de San Francisco?",
        answerType: "single",
        correct: ["E"],
        options: [
          { value: "A", label: "Colinda con el Civic Center" },
          { value: "B", label: "Se conecta con Market Street" },
          { value: "C", label: "Está cerca de Union Square, el Distrito Financiero y el Distrito de Teatros" },
          { value: "D", label: "Une varios centros económicos y culturales importantes" },
          { value: "E", label: "Todo lo anterior" }
        ]
      }
    ]
  },
  {
    id: "community-finance",
    title: "Sección 2: Finanzas comunitarias",
    lead: "Antes de empezar: cómo las comunidades repiensan el dinero",
    facts: [
      {
        summary: "La era de la banca libre en los Estados Unidos",
        body: "En el siglo XIX, durante la era de la banca libre en los Estados Unidos, miles de bancos con licencia local emitieron sus propios billetes."
      },
      {
        summary: "La moneda local de Wörgl durante la Gran Depresión",
        body: "En 1932, el pueblo de Wörgl, Austria, emitió una moneda de vales sellados durante la Gran Depresión. En un año, el desempleo bajó alrededor de un 25 por ciento, según los informes, antes de que el banco central de Austria cerrara el programa."
      },
      {
        summary: "Sardex en Cerdeña",
        body: "En 2009 se fundó Sardex en Cerdeña, Italia, después de la crisis financiera mundial de 2008. Es una red de crédito mutuo que en los últimos años ha facilitado más de 50 millones de euros en transacciones anuales."
      },
      {
        summary: "Bitcoin y la crisis financiera de 2008",
        body: "Bitcoin también se lanzó en 2009, después de la crisis financiera de 2008. Fue diseñado como una moneda digital descentralizada que pudiera funcionar sin bancos ni autoridades centrales, y el momento de su lanzamiento reflejó una respuesta más amplia a la crisis, cuando muchas personas perdieron la confianza en las instituciones financieras tradicionales y en los sistemas de dinero fiduciario administrados por los gobiernos. Las criptomonedas surgieron en parte como un intento de construir redes financieras transparentes, basadas en reglas e independientes de las fallas que pueden ocurrir en los sistemas monetarios convencionales."
      },
      {
        summary: "Qué son las stablecoins",
        body: "Las stablecoins (monedas estables) son tokens digitales diseñados para mantener un valor estable. Grandes empresas de tecnología financiera, como PayPal o Circle, emiten stablecoins respaldadas uno a uno por dólares estadounidenses o por valores del Tesoro de los Estados Unidos a corto plazo."
      },
      {
        summary: "Las stablecoins en respuesta a crisis",
        body: "En 2022 se enviaron millones de dólares en donaciones de stablecoins a Ucrania cuando los sistemas bancarios tradicionales se vieron interrumpidos."
      },
      {
        summary: "Usos gubernamentales de herramientas blockchain",
        body: "California ha puesto a prueba herramientas blockchain para los sistemas de títulos de vehículos. Columbia Británica ha explorado sistemas de identidad digital apoyados en blockchain. Estonia usa tecnología inspirada en blockchain para proteger los registros del gobierno."
      }
    ],
    questions: [
      {
        number: 6,
        prompt: "¿Cuáles de los siguientes son ejemplos reales de monedas locales o comunitarias?",
        answerType: "single",
        correct: ["E"],
        options: [
          { value: "A", label: "Los vales sellados de Wörgl" },
          { value: "B", label: "Sardex" },
          { value: "C", label: "Billetes estadounidenses emitidos por bancos privados" },
          { value: "D", label: "El dinero del Monopoly" },
          { value: "E", label: "Todos excepto D" }
        ]
      },
      {
        number: 7,
        prompt: "Una stablecoin es:",
        answerType: "single",
        correct: ["B"],
        options: [
          { value: "A", label: "Una moneda hecha de acero" },
          { value: "B", label: "Una criptomoneda diseñada para mantener un valor estable y respaldada por reservas" },
          { value: "C", label: "Una criptomoneda volátil similar a Bitcoin" },
          { value: "D", label: "Un objeto de museo" }
        ]
      },
      {
        number: 8,
        prompt: "¿Para cuál de los siguientes se puede usar la tecnología blockchain?",
        answerType: "single",
        correct: ["D"],
        options: [
          { value: "A", label: "Criptomonedas" },
          { value: "B", label: "Sistemas seguros de identidad digital" },
          { value: "C", label: "Registros y archivos públicos transparentes" },
          { value: "D", label: "Todo lo anterior" }
        ]
      },
      {
        number: 9,
        prompt: "¿Qué gobiernos ya usan o están explorando la tecnología blockchain? Elija todas las que correspondan.",
        answerType: "multiple",
        correct: ["A", "B", "C"],
        options: [
          { value: "A", label: "California" },
          { value: "B", label: "La provincia de Columbia Británica" },
          { value: "C", label: "Estonia" },
          { value: "D", label: "Ninguno de los anteriores" }
        ]
      },
      {
        number: 10,
        prompt: "Se usaron blockchain y stablecoins para enviar ayuda a Ucrania porque permiten a las organizaciones:",
        answerType: "multiple",
        correct: ["A", "B"],
        options: [
          { value: "A", label: "Hacer transferencias internacionales rápidas y transparentes" },
          { value: "B", label: "Depender menos de los intermediarios bancarios tradicionales" },
          {
            value: "C",
            label: "Enviar ayuda en forma de un activo que se revaloriza, ya que las stablecoins suelen aumentar de valor"
          },
          { value: "D", label: "Eliminar la necesidad de acceso a internet" }
        ]
      }
    ]
  },
  {
    id: "sfluv",
    title: "Sección 3: SFLuv",
    lead: "Antes de empezar: ¿qué es SFLuv?",
    facts: [
      {
        summary: "Finanzas comunitarias, aplicadas localmente",
        body: "SFLuv se basa en la larga historia de las finanzas comunitarias, pero la aplica a nivel local con herramientas modernas."
      },
      {
        summary: "La misión y el enfoque de SFLuv",
        body: "SFLuv es una organización benéfica 501(c)(3) que usa una moneda comunitaria digital para apoyar su doble misión: el mejoramiento de espacios públicos (pequeñas mejoras como murales y jardinería) y el desarrollo económico en comunidades con pocos recursos. Actualmente se enfoca únicamente en el Tenderloin."
      },
      {
        summary: "Cómo se gana SFLuv",
        body: "Los muralistas y otros “Improvers” (personas que mejoran el vecindario), como jardineros, artistas y pequeños contratistas, ganan SFLuv por su trabajo. A los voluntarios se les ofrecen pequeñas cantidades de SFLuv como muestras de agradecimiento."
      },
      {
        summary: "Lo básico de una stablecoin envuelta",
        body: "Técnicamente, SFLuv es una stablecoin envuelta (wrapped stablecoin), lo que significa que usa stablecoins emitidas por grandes instituciones y luego las programa con permisos y reglas adicionales."
      },
      {
        summary: "Dónde se puede usar SFLuv",
        body: "SFLuv solo se puede gastar en los comercios locales participantes, y solo los comercios aprobados reciben las herramientas para convertir el token de nuevo a dólares estadounidenses."
      },
      {
        summary: "Meta de gobernanza a largo plazo",
        body: "Con el tiempo, SFLuv busca ofrecer herramientas que permitan a los comercios y residentes proponer y votar por proyectos que beneficien a su vecindario usando el fondo comunitario."
      }
    ],
    questions: [
      {
        number: 11,
        prompt: "¿Qué es SFLuv? Elija todas las que correspondan.",
        answerType: "multiple",
        correct: ["B", "C"],
        options: [
          { value: "A", label: "Un festival de arte del vecindario" },
          { value: "B", label: "Una moneda comunitaria digital" },
          {
            value: "C",
            label: "Una organización benéfica 501(c)(3) enfocada en el mejoramiento de espacios públicos y el desarrollo económico"
          },
          { value: "D", label: "Un crédito fiscal de la ciudad" },
          { value: "E", label: "Una tarjeta de lealtad" }
        ]
      },
      {
        number: 12,
        prompt: "¿Qué significa que SFLuv es una stablecoin envuelta?",
        answerType: "single",
        correct: ["B"],
        options: [
          { value: "A", label: "Que crea dinero de la nada" },
          {
            value: "B",
            label:
              "Que usa stablecoins emitidas por grandes instituciones y las programa con permisos para que solo se puedan gastar localmente"
          },
          { value: "C", label: "Que es más volátil que Bitcoin" },
          { value: "D", label: "Que no está respaldada por activos reales" }
        ]
      },
      {
        number: 13,
        prompt: "¿Cómo se gana SFLuv?",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "Comprándolo en una plataforma de criptomonedas" },
          { value: "B", label: "Ganando concursos de preguntas" },
          { value: "C", label: "Haciendo voluntariado y mejorando el vecindario" },
          { value: "D", label: "Pagando multas de estacionamiento" }
        ]
      },
      {
        number: 14,
        prompt: "¿Dónde se puede gastar SFLuv?",
        answerType: "single",
        correct: ["B"],
        options: [
          { value: "A", label: "En cualquier parte del mundo" },
          { value: "B", label: "En los comercios locales participantes" },
          { value: "C", label: "En Amazon" },
          { value: "D", label: "En el Ayuntamiento (City Hall)" }
        ]
      },
      {
        number: 15,
        prompt: "¿Qué hace a SFLuv diferente de los programas de lealtad típicos?",
        answerType: "single",
        correct: ["D"],
        options: [
          { value: "A", label: "Se gana a través de la acción comunitaria" },
          { value: "B", label: "Fortalece a los negocios del vecindario" },
          { value: "C", label: "Apoya proyectos de mejoramiento de espacios públicos" },
          { value: "D", label: "Todo lo anterior" }
        ]
      },
      {
        number: 16,
        prompt: "¿Cuál es una meta a largo plazo de SFLuv?",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "Reemplazar el dólar estadounidense" },
          { value: "B", label: "Lanzar un fondo de inversión" },
          {
            value: "C",
            label: "Ofrecer herramientas que permitan a residentes y comercios proponer y votar por proyectos del vecindario"
          },
          { value: "D", label: "Eliminar el trabajo voluntario" }
        ]
      }
    ]
  }
];

export const quizEs: QuizContent = {
  title: "Cuestionario sobre la moneda comunitaria SFLuv",
  subtitle: "Edición Grow the Luv",
  description: "Edición Grow the Luv: aprenda sobre el Tenderloin, las finanzas comunitarias y SFLuv.",
  finish: {
    title: "¡Felicidades, ha terminado el cuestionario “Acerca de SFLuv”!",
    body: "Por favor, muestre esta pantalla a su representante de SFLuv para recibir sus Gratitude Perks (regalos de agradecimiento).",
    logo: { ...quizEn.finish.logo, alt: "Logotipo de SFLuv" }
  },
  ui: {
    selectAll: "Seleccione todas las que correspondan.",
    submitAnswer: "Enviar respuesta",
    chooseFirst: "Por favor, elija una opción antes de enviar.",
    correct: "Correcto.",
    tryAgain: "No exactamente. Inténtelo de nuevo.",
    previousSection: "Sección anterior",
    nextSection: "Siguiente sección",
    submitQuiz: "Enviar cuestionario",
    allCorrect: "Todas las respuestas son correctas. Enviando el cuestionario…",
    blockedUnanswered: "Por favor, responda las preguntas {numbers} antes de enviar.",
    blockedIncorrect: "Por favor, corrija las preguntas {numbers} antes de enviar.",
    otherLanguage: { href: "/sfluv-quiz", label: "View in English" }
  },
  sections: sectionsEs
};
