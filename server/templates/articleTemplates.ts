export interface ArticleTemplate {
  type: string;
  headlines: string[];
  bodyTemplates: string[];
  keywords: string[];
  expertOpinions: string[];
  impacts: string[];
  analyses: string[];
}

export const articleTemplates: Record<string, ArticleTemplate[]> = {
  'Política Nacional': [
    {
      type: 'escándalo',
      headlines: [
        'ÚLTIMA HORA: {topic} genera controversia en el Congreso Nacional',
        'EXCLUSIVO: Detalles del caso {topic} que sacude la política argentina',
        'URGENTE: {topic} - Congreso en vilo tras revelaciones',
        'BOMBA POLÍTICA: {topic} desata crisis en el oficialismo',
        'IMPACTANTE: {topic} obliga a sesión extraordinaria del Congreso',
        'CRISIS POLÍTICA: {topic} pone en jaque al Gobierno',
        'ESCÁNDALO EN EL CONGRESO: {topic} genera indignación nacional',
        'ALERTA POLÍTICA: {topic} amenaza la estabilidad institucional',
        'URGENTE: {topic} fuerza renuncias en el gabinete',
        'ÚLTIMA HORA: {topic} - Oposición exige investigación inmediata'
      ],
      bodyTemplates: [
        'En una jornada marcada por {event}, el {institution} se vio envuelto en un nuevo escándalo político que amenaza con desestabilizar el actual panorama legislativo. Según fuentes cercanas al caso, {details}.\n\nLos expertos consultados por Política Argentina señalan que {expert_opinion}. Esta situación podría tener consecuencias directas en {impact}, generando un clima de incertidumbre en los próximos meses.\n\nEl análisis de la situación revela {analysis}. Los próximos días serán cruciales para determinar el rumbo de {outcome}, mientras los legisladores buscan estrategias para contener el daño político.',
        'El {institution} enfrenta una de sus mayores crisis tras revelarse {event}. Las declaraciones de {details} han generado un terremoto político sin precedentes en la historia reciente argentina.\n\n{expert_opinion} - aseguran analistas políticos. El impacto en {impact} será determinante para el futuro del gobierno y sus aliados parlamentarios.\n\nMientras tanto, {analysis}. La clase política argentina observa con atención cada movimiento, consciente de que {outcome} definirá el mapa político de los próximos años.',
        'POLÍTICA ARGENTINA accedió en exclusiva a información que revela cómo {event} está transformando el escenario político nacional. {details} - confirman fuentes del {institution}.\n\nSegún expertos, {expert_opinion}. Las consecuencias en {impact} podrían redefinir alianzas y estrategias electorales de cara a las próximas elecciones.\n\nEl análisis en profundidad muestra que {analysis}. Todo indica que {outcome}, marcando un antes y después en la política argentina contemporánea.'
      ],
      keywords: ['Congreso', 'diputados', 'senadores', 'legislación', 'votación', 'debate', 'sesión', 'comisión'],
      expertOpinions: [
        'Esta situación marca un punto de inflexión en la política argentina moderna',
        'Las implicancias institucionales de este caso son de magnitud histórica',
        'Estamos ante un cambio de paradigma en la forma de hacer política en Argentina',
        'Los efectos de esta crisis se sentirán durante años en el sistema político',
        'La ciudadanía argentina merece respuestas inmediatas sobre este escándalo',
        'Este es el tipo de situación que puede redefinir coaliciones políticas enteras',
        'La transparencia y rendición de cuentas están en juego con este caso',
        'Nunca habíamos visto una crisis de confianza institucional de esta magnitud'
      ],
      impacts: [
        'las próximas elecciones legislativas y la conformación del nuevo Congreso',
        'la credibilidad del sistema político argentino a nivel internacional',
        'la relación entre el Poder Ejecutivo y Legislativo en los próximos meses',
        'la confianza ciudadana en las instituciones democráticas del país',
        'las negociaciones presupuestarias y la agenda legislativa prioritaria',
        'la estabilidad de la coalición gobernante y sus aliados estratégicos',
        'el clima político de cara al período electoral que se aproxima',
        'la imagen internacional de Argentina en materia de gobernabilidad'
      ],
      analyses: [
        'que los actores políticos principales están evaluando estrategias de contención de daños',
        'un proceso acelerado de realineamientos dentro de los bloques parlamentarios',
        'que la opinión pública está exigiendo respuestas concretas y cambios estructurales',
        'tensiones crecientes entre diferentes sectores de la coalición gobernante',
        'que los mecanismos de control institucional están siendo puestos a prueba',
        'una oportunidad para fortalecer la transparencia en la gestión política',
        'el inicio de un debate necesario sobre ética y responsabilidad política',
        'que la ciudadanía argentina está cada vez más comprometida con la fiscalización'
      ]
    },
    {
      type: 'reforma',
      headlines: [
        'El Congreso debate {topic} que transformará Argentina',
        'URGENTE: {topic} llega al recinto con apoyo masivo',
        'Histórico: {topic} marca un antes y después legislativo',
        'ÚLTIMA HORA: {topic} consigue dictamen favorable',
        'El oficialismo impulsa {topic} con respaldo opositor',
        'EXCLUSIVO: Los detalles de {topic} que se vota esta semana',
        'ANÁLISIS PROFUNDO: Cómo {topic} cambiará el país',
        'LEGISLATIVO: {topic} genera consenso transversal inédito',
        'El Senado prepara sesión especial por {topic}',
        'URGENTE: {topic} - Se confirma el apoyo de gobernadores'
      ],
      bodyTemplates: [
        'El proyecto de {event} está a punto de transformar el panorama legislativo argentino. {details}, según confirmaron fuentes parlamentarias a POLÍTICA ARGENTINA.\n\nExpertos legislativos afirman que {expert_opinion}. El impacto esperado en {impact} sería significativo y de largo alcance.\n\nEl análisis técnico indica que {analysis}. Se espera que {outcome}, consolidando una nueva etapa en la historia legislativa del país.',
        'En una sesión histórica, {institution} aborda {event} con un nivel de consenso poco frecuente en la política argentina. {details} - revelaron legisladores clave en la negociación.\n\n{expert_opinion}, aseguran constitucionalistas consultados. Las modificaciones en {impact} serán profundas y duraderas.\n\nMientras {analysis}, los ciudadanos observan expectantes. Todo indica que {outcome}, marcando un hito en la construcción de políticas públicas de consenso.'
      ],
      keywords: ['reforma', 'ley', 'proyecto', 'dictamen', 'comisión', 'consenso', 'votación', 'sanción'],
      expertOpinions: [
        'Esta reforma representa un avance significativo en la modernización del Estado argentino',
        'El consenso alcanzado demuestra la madurez del sistema político nacional',
        'Estamos ante una transformación estructural de gran impacto institucional',
        'La amplitud de acuerdos logrados es ejemplar para la democracia argentina',
        'Este proyecto coloca a Argentina en línea con las mejores prácticas internacionales',
        'La profundidad técnica del debate legislativo ha sido excepcional',
        'Esta legislación marca un precedente para futuras reformas de Estado',
        'El nivel de participación ciudadana en el debate ha sido histórico'
      ],
      impacts: [
        'el sistema judicial y la administración de justicia en todo el territorio',
        'la estructura del Estado y la eficiencia de la gestión pública',
        'los derechos y garantías de los ciudadanos argentinos',
        'el sistema electoral y la representación democrática',
        'la economía nacional y la competitividad internacional del país',
        'la descentralización federal y el federalismo argentino',
        'la transparencia gubernamental y el acceso a la información pública',
        'el desarrollo sustentable y las políticas ambientales nacionales'
      ],
      analyses: [
        'se construye un nuevo modelo de gobernanza más eficiente y transparente',
        'los diferentes bloques parlamentarios encuentran puntos de acuerdo históricos',
        'la sociedad civil participa activamente en la construcción legislativa',
        'se sientan las bases para reformas estructurales de segunda generación',
        'Argentina da pasos concretos hacia la modernización institucional',
        'el diálogo político constructivo reemplaza la confrontación estéril',
        'se fortalecen los mecanismos de rendición de cuentas democráticos',
        'emergen nuevas formas de participación ciudadana en política pública'
      ]
    },
    {
      type: 'crisis',
      headlines: [
        'CRISIS POLÍTICA: {topic} genera tensión máxima en el Gobierno',
        'URGENTE: {topic} pone en jaque la gobernabilidad',
        'ALERTA ROJA: {topic} amenaza la estabilidad institucional',
        'EL PAÍS EN VILO: {topic} desata crisis sin precedentes',
        'ÚLTIMA HORA: Gobierno enfrenta {topic} con gabinete dividido',
        'SITUACIÓN CRÍTICA: {topic} obliga a reunión de emergencia',
        'CRISIS INSTITUCIONAL: {topic} genera llamado a diálogo urgente',
        'BREAKING: {topic} sacude los cimientos del poder político'
      ],
      bodyTemplates: [
        'La crisis desatada por {event} coloca al {institution} en su momento más difícil del año. {details}, según trascendió de fuentes gubernamentales.\n\n{expert_opinion} - advirtieron politólogos especializados. Las consecuencias en {impact} podrían ser irreversibles si no se encuentra una salida rápida.\n\nEl escenario actual muestra que {analysis}. La resolución de {outcome} será determinante para el futuro político inmediato.',
        'Argentina enfrenta una encrucijada política tras {event}. {details} - confirmaron fuentes del {institution} bajo estricta reserva.\n\nExpertos en gobernabilidad sostienen que {expert_opinion}. El efecto dominó en {impact} ya comenzó a manifestarse en diferentes sectores.\n\nLa situación crítica revela que {analysis}. Todo apunta a que {outcome}, definiendo el rumbo político de los próximos meses.'
      ],
      keywords: ['crisis', 'tensión', 'conflicto', 'gobernabilidad', 'estabilidad', 'emergencia', 'diálogo', 'negociación'],
      expertOpinions: [
        'Estamos ante la crisis política más grave de los últimos años',
        'La gobernabilidad del país está seriamente comprometida',
        'Se requiere una solución inmediata para evitar consecuencias mayores',
        'El diálogo político es la única vía para superar esta crisis',
        'La situación actual pone a prueba la madurez institucional argentina',
        'Necesitamos líderes que prioricen el interés nacional sobre el partidario',
        'Esta crisis expone las debilidades estructurales de nuestro sistema político',
        'La ciudadanía exige soluciones concretas, no más confrontación'
      ],
      impacts: [
        'la economía nacional y la confianza de los inversores',
        'la relación entre los poderes del Estado argentino',
        'la imagen internacional del país y su credibilidad',
        'la estabilidad social y la paz en las calles',
        'las expectativas de crecimiento económico para el próximo año',
        'el clima político de cara a las elecciones venideras',
        'la gobernabilidad y la capacidad de gestión del Estado',
        'la confianza ciudadana en el sistema democrático'
      ],
      analyses: [
        'los actores políticos buscan desesperadamente vías de diálogo',
        'la sociedad argentina está cansada de la confrontación permanente',
        'se necesitan acuerdos básicos para recuperar la gobernabilidad',
        'la crisis actual podría ser una oportunidad para refundar consensos',
        'los liderazgos políticos están siendo puestos a prueba',
        'la ciudadanía exige responsabilidad y altura política',
        'se requiere urgentemente un gran acuerdo nacional',
        'la historia juzgará cómo se resuelve esta crisis institucional'
      ]
    }
  ],
  
  'Economía': [
    {
      type: 'indicadores',
      headlines: [
        '{topic} alcanza niveles históricos en Argentina',
        'ECONOMÍA: {topic} genera preocupación en el mercado',
        'URGENTE: {topic} impacta en la economía familiar',
        'DATO CLAVE: {topic} marca nuevo récord en el país',
        'ATENCIÓN: {topic} modifica expectativas económicas',
        'ECONOMÍA ALERTA: {topic} según últimos datos oficiales',
        'MERCADOS: {topic} genera volatilidad financiera',
        'EXCLUSIVO: Cómo {topic} afectará tu bolsillo'
      ],
      bodyTemplates: [
        'Los últimos datos económicos revelan que {event}, generando {details} en el sector financiero nacional.\n\nEconomistas consultados afirman que {expert_opinion}. El impacto directo en {impact} ya comienza a sentirse en la economía real.\n\nEl análisis económico demuestra que {analysis}. Se proyecta que {outcome}, con consecuencias para todos los argentinos.',
        'El indicador de {event} muestra una variación significativa. {details}, según informó el {institution} en su último reporte.\n\n{expert_opinion} - señalaron especialistas del sector privado. Las modificaciones en {impact} serán inevitables en el corto plazo.\n\nLos números indican que {analysis}. Las previsiones apuntan a que {outcome}, redefiniendo el escenario macroeconómico.'
      ],
      keywords: ['inflación', 'dólar', 'PBI', 'desempleo', 'salario', 'precios', 'mercado', 'economía'],
      expertOpinions: [
        'Los indicadores económicos muestran una tendencia preocupante',
        'Se necesitan medidas urgentes para estabilizar la macroeconomía',
        'El impacto en el poder adquisitivo será significativo',
        'Estamos ante un escenario de alta volatilidad económica',
        'La política monetaria debe ajustarse a la nueva realidad',
        'Los números reflejan la necesidad de reformas estructurales',
        'El sector productivo requiere señales claras de política económica',
        'La economía argentina enfrenta desafíos mayores en el corto plazo'
      ],
      impacts: [
        'el poder adquisitivo de los trabajadores argentinos',
        'las expectativas inflacionarias de los próximos meses',
        'la competitividad de la industria nacional',
        'las reservas del Banco Central y la estabilidad cambiaria',
        'los planes de inversión del sector privado',
        'el consumo interno y el comercio minorista',
        'las negociaciones salariales en curso',
        'la capacidad de ahorro de las familias argentinas'
      ],
      analyses: [
        'la economía argentina atraviesa un momento de transición crítica',
        'se requieren ajustes de política económica de manera urgente',
        'los agentes económicos están recalibrando sus expectativas',
        'el sector externo muestra señales contradictorias',
        'la inflación continúa siendo el principal desafío macroeconómico',
        'se necesita un programa económico integral y coherente',
        'la volatilidad financiera afecta la planificación empresarial',
        'los fundamentales económicos requieren fortalecimiento inmediato'
      ]
    },
    {
      type: 'empresarial',
      headlines: [
        'EMPRESAS: {topic} transforma el mercado argentino',
        'NEGOCIOS: {topic} genera nuevas oportunidades',
        'INVERSIÓN: {topic} atrae capitales internacionales',
        'SECTOR PRIVADO: {topic} impulsa el crecimiento',
        'MERCADO: {topic} redefine la estrategia empresarial',
        'INDUSTRIA: {topic} marca tendencia en Argentina',
        'COMERCIO: {topic} revoluciona el sector',
        'CORPORATIVO: {topic} lidera la transformación digital'
      ],
      bodyTemplates: [
        'El sector empresarial argentino celebra {event}, que {details} según confirmaron ejecutivos del {institution}.\n\nExpertos en negocios sostienen que {expert_opinion}. El efecto multiplicador en {impact} podría generar miles de empleos.\n\nEl análisis de mercado revela que {analysis}. Se anticipa que {outcome}, consolidando un nuevo paradigma empresarial en el país.',
        'Una transformación sin precedentes está ocurriendo con {event}. {details} - informaron fuentes de la {institution} a POLÍTICA ARGENTINA.\n\n{expert_opinion}, aseguran consultores empresariales. Las implicancias para {impact} son de magnitud estratégica.\n\nLa evolución del sector muestra que {analysis}. Todo indica que {outcome}, marcando el inicio de una nueva era para los negocios en Argentina.'
      ],
      keywords: ['empresas', 'inversión', 'empleo', 'producción', 'exportación', 'tecnología', 'innovación', 'mercado'],
      expertOpinions: [
        'El sector empresarial argentino muestra signos de renovada vitalidad',
        'Las inversiones productivas son la clave del desarrollo sostenible',
        'La innovación empresarial está transformando la economía nacional',
        'Argentina tiene enorme potencial para atraer inversión extranjera',
        'La digitalización empresarial es el camino hacia la competitividad',
        'El emprendedorismo argentino lidera en América Latina',
        'Las empresas nacionales demuestran resiliencia y capacidad de adaptación',
        'La integración a las cadenas globales de valor es fundamental'
      ],
      impacts: [
        'la generación de empleo de calidad en todo el país',
        'la transferencia tecnológica y la innovación productiva',
        'la balanza comercial y las exportaciones nacionales',
        'el desarrollo regional y la descentralización económica',
        'la formación de recursos humanos especializados',
        'la productividad y competitividad de la economía argentina',
        'la atracción de inversión extranjera directa',
        'la integración de Argentina en la economía global'
      ],
      analyses: [
        'el empresariado argentino apuesta al crecimiento a largo plazo',
        'las condiciones para invertir están mejorando gradualmente',
        'la confianza empresarial muestra señales de recuperación',
        'el sector privado lidera la transformación productiva',
        'la innovación empresarial está en pleno desarrollo',
        'las exportaciones argentinas ganan mercados internacionales',
        'la economía del conocimiento crece exponencialmente',
        'el talento argentino es reconocido mundialmente'
      ]
    }
  ],

  'Justicia': [
    {
      type: 'investigación',
      headlines: [
        'BOMBA JUDICIAL: {topic} - Nueva evidencia sacude la causa',
        'LA JUSTICIA INVESTIGA: {topic} - Detalles exclusivos',
        'URGENTE: {topic} - Fiscalía presenta pruebas contundentes',
        'CASO {topic}: Juez ordena medidas de prueba clave',
        'JUSTICIA: {topic} - Testigos clave declaran esta semana',
        'EXCLUSIVO: {topic} - Los documentos que complican a los implicados',
        'CAUSA {topic}: Peritos presentan informe demoledor',
        'JUDICIAL: {topic} - Abogados apelan decisión del juez'
      ],
      bodyTemplates: [
        'La causa por {event} dio un giro inesperado cuando {details}, según confirmaron fuentes judiciales a POLÍTICA ARGENTINA.\n\nExpertos en derecho penal afirman que {expert_opinion}. Las consecuencias para {impact} serían de gran magnitud jurídica.\n\nEl expediente judicial revela que {analysis}. Se espera que {outcome}, sentando jurisprudencia en casos similares.',
        'Un escándalo judicial sin precedentes se desató tras {event}. {details} - revelaron fuentes del {institution} bajo reserva.\n\n{expert_opinion}, señalaron constitucionalistas consultados. El impacto en {impact} podría redefinir criterios jurisprudenciales.\n\nLa investigación demuestra que {analysis}. Todo apunta a que {outcome}, marcando un hito en la justicia argentina.'
      ],
      keywords: ['investigación', 'causa', 'fiscal', 'juez', 'pruebas', 'declaración', 'expediente', 'tribunal'],
      expertOpinions: [
        'Este caso marca un precedente fundamental en el derecho argentino',
        'La solidez de las pruebas presentadas es contundente',
        'El sistema judicial está demostrando su independencia',
        'Esta investigación es ejemplar en términos de profundidad',
        'Los mecanismos de la justicia funcionan correctamente',
        'El derecho de defensa está siendo plenamente respetado',
        'La celeridad procesal en este caso es destacable',
        'La transparencia judicial es fundamental para la democracia'
      ],
      impacts: [
        'la credibilidad del sistema judicial argentino',
        'la lucha contra la corrupción en instituciones públicas',
        'la independencia del Poder Judicial',
        'los derechos y garantías procesales',
        'la jurisprudencia en casos de corrupción',
        'la confianza ciudadana en la justicia',
        'los protocolos de investigación penal',
        'el sistema de rendición de cuentas institucional'
      ],
      analyses: [
        'la justicia argentina está combatiendo la impunidad con firmeza',
        'los mecanismos procesales funcionan dentro del marco legal',
        'se respeta el debido proceso y el derecho de defensa',
        'la investigación avanza con rigurosidad técnica',
        'los tiempos procesales se cumplen adecuadamente',
        'las garantías constitucionales están preservadas',
        'la independencia judicial se mantiene intacta',
        'el sistema de justicia demuestra su fortaleza institucional'
      ]
    },
    {
      type: 'sentencia',
      headlines: [
        'FALLO HISTÓRICO: Justicia condena por {topic}',
        'SENTENCIA: {topic} - Años de prisión para los acusados',
        'VEREDICTO: {topic} - Tribunal dicta condena ejemplar',
        'JUSTICIA: {topic} - Confirman penas en segunda instancia',
        'HISTÓRICO: {topic} - Primera sentencia de este tipo en Argentina',
        'CONDENA: {topic} - Jueces rechazan todos los recursos',
        'FALLO JUDICIAL: {topic} - Prisión efectiva confirmada',
        'SENTENCIA FIRME: {topic} - Se acabó la impunidad'
      ],
      bodyTemplates: [
        'Un fallo histórico se produjo en la causa {event}, cuando {details}. El tribunal consideró probados los delitos imputados.\n\nJuristas especializados sostienen que {expert_opinion}. El precedente sentado en {impact} será referencia obligada en casos futuros.\n\nLa sentencia fundamenta que {analysis}. Se anticipa que {outcome}, fortaleciendo el sistema de justicia argentino.',
        'La Justicia argentina sentenció en el caso {event}. {details}, determinaron los magistrados en un fallo de más de 300 páginas.\n\n{expert_opinion} - afirmaron expertos en derecho penal. Las implicancias para {impact} son de largo alcance jurídico.\n\nLos fundamentos del fallo demuestran que {analysis}. Todo indica que {outcome}, consolidando la lucha contra la impunidad.'
      ],
      keywords: ['sentencia', 'condena', 'fallo', 'veredicto', 'tribunal', 'prisión', 'culpable', 'absolución'],
      expertOpinions: [
        'Esta sentencia sienta un precedente fundamental para la justicia',
        'El fallo demuestra que en Argentina nadie está por encima de la ley',
        'La fundamentación jurídica es impecable y exhaustiva',
        'Este veredicto fortalece el Estado de Derecho',
        'La independencia judicial queda demostrada con este fallo',
        'El sistema de justicia argentino funciona cuando se lo deja trabajar',
        'Esta condena es un mensaje claro contra la corrupción',
        'El Poder Judicial argentino está a la altura de las circunstancias'
      ],
      impacts: [
        'la lucha contra la impunidad en delitos de corrupción',
        'la confianza ciudadana en el sistema judicial',
        'la jurisprudencia en casos de similar naturaleza',
        'el combate a la criminalidad organizada',
        'los estándares probatorios en casos complejos',
        'la independencia del Poder Judicial argentino',
        'la efectividad de las investigaciones penales',
        'el mensaje social sobre tolerancia cero al delito'
      ],
      analyses: [
        'la justicia argentina está ganando la batalla contra la impunidad',
        'el sistema judicial demuestra su capacidad y profesionalismo',
        'los mecanismos de investigación y juzgamiento son efectivos',
        'el Estado de Derecho se fortalece con cada sentencia justa',
        'la independencia judicial es la base de la democracia',
        'los ciudadanos recuperan confianza en las instituciones',
        'el mensaje de que todos somos iguales ante la ley es claro',
        'Argentina avanza hacia una justicia más eficiente y transparente'
      ]
    }
  ],

  'Internacional': [
    {
      type: 'diplomacia',
      headlines: [
        'ARGENTINA Y {topic}: Cumbre histórica en Buenos Aires',
        'RELACIONES INTERNACIONALES: {topic} fortalece lazos con Argentina',
        'DIPLOMACIA: {topic} - Acuerdo estratégico firmado hoy',
        'POLÍTICA EXTERIOR: {topic} - Cancillería anuncia alianza',
        'INTERNACIONAL: {topic} - Argentina protagonista global',
        'CUMBRE: {topic} - Líderes mundiales en Casa Rosada',
        'GEOPOLÍTICA: {topic} - Argentina clave en la región',
        'RELACIONES BILATERALES: {topic} - Nuevo capítulo histórico'
      ],
      bodyTemplates: [
        'En un hecho histórico para la diplomacia argentina, {event} marcó {details} según confirmó la {institution}.\n\nAnalistas internacionales afirman que {expert_opinion}. El impacto estratégico en {impact} será determinante para la región.\n\nEl acuerdo alcanzado muestra que {analysis}. Se proyecta que {outcome}, posicionando a Argentina en un rol protagónico global.',
        'La política exterior argentina alcanzó un hito con {event}. {details} - anunció oficialmente el {institution} en conferencia de prensa.\n\n{expert_opinion}, sostuvieron especialistas en relaciones internacionales. Las consecuencias para {impact} son de importancia estratégica.\n\nLa coyuntura internacional revela que {analysis}. Todo apunta a que {outcome}, consolidando el liderazgo argentino en la región.'
      ],
      keywords: ['diplomacia', 'cumbre', 'acuerdo', 'tratado', 'alianza', 'cancillería', 'embajada', 'bilateral'],
      expertOpinions: [
        'Argentina está recuperando su protagonismo en el escenario internacional',
        'La diplomacia argentina demuestra madurez y visión estratégica',
        'Este acuerdo posiciona al país como actor clave regional',
        'La política exterior está alineada con los intereses nacionales',
        'Argentina construye puentes en un mundo multipolar',
        'El liderazgo diplomático argentino es reconocido mundialmente',
        'La capacidad de negociación del país es excepcional',
        'Argentina es un socio confiable para la comunidad internacional'
      ],
      impacts: [
        'el comercio exterior y las exportaciones argentinas',
        'la integración regional y los bloques comerciales',
        'las inversiones extranjeras en sectores estratégicos',
        'la cooperación científica y tecnológica internacional',
        'la seguridad regional y la defensa común',
        'el intercambio cultural y educativo bilateral',
        'la posición geopolítica de Argentina en el mundo',
        'los intereses económicos y políticos nacionales'
      ],
      analyses: [
        'Argentina está diversificando sus relaciones internacionales',
        'la política exterior prioriza el interés nacional',
        'el país construye alianzas estratégicas de largo plazo',
        'la diplomacia argentina trabaja con pragmatismo',
        'se fortalecen los vínculos con socios tradicionales y nuevos',
        'Argentina es reconocida como potencia regional',
        'el multilateralismo es eje de la política exterior',
        'el país proyecta estabilidad y confiabilidad internacional'
      ]
    }
  ]
};

export function getRandomTemplate(category: string): ArticleTemplate | null {
  const categoryTemplates = articleTemplates[category];
  if (!categoryTemplates || categoryTemplates.length === 0) {
    return null;
  }
  return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
}

export function getAllCategories(): string[] {
  return Object.keys(articleTemplates);
}
