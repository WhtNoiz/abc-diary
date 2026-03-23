const EMOTIONS = [
  {
    id: "arrabbiato",
    label: "Arrabbiato",
    colors: ["#D03B3B", "#C00000", "#f76e48de"],
    textColors: ["#fff", "#fff", "#fff"],
    children: [
      {
        id: "aggressivo",
        label: "Aggressivo",
        children: [
          { id: "ostile",     label: "Ostile"    },
          { id: "provocato",    label: "Provocato"   },
        ],
      },
      {
        id: "critico",
        label: "Critico",
        children: [
          { id: "scettico",      label: "Scettico"     },
          { id: "sminuente",    label: "Sminuente"   },
        ],
      },
      {
        id: "distaccato",
        label: "Distaccato",
        children: [
          { id: "asociale",      label: "Asociale"     },
          { id: "anestetizzato",     label: "Anestetizzato"    },
        ],
      },
      {
        id: "frustrato",
        label: "Frustrato",
        children: [
          { id: "infuriato",     label: "Infuriato"    },
          { id: "irritato",       label: "Irritato"      },
        ],
      },
      {
        id: "amareggiato",
        label: "Amareggiato",
        children: [
          { id: "indignato",     label: "Indignato"    },
          { id: "violato",  label: "Violato" },
        ]
      },
      {
        id: "umiliato",
        label: "Umiliato",
        children: [
          { id: "svilito",   label: "Svilito"  },
          { id: "ridicolizzato",       label: "Ridicolizzato"      },
        ],
      },
      {
        id: "deluso",
        label: "Deluso",
        children: [
          {id: "tradito", label: "Tradito"},
          {id: "rancoroso", label: "Rancoroso"}
        ]
      }
    ],
  },

  {
    id: "disgustato",
    label: "Disgustato",
    colors: ["#72DA06", "#67B408", "#73FF16"],
    textColors: ["#000000", "#000000", "#000000"],
    children: [
      {
        id: "turbato",
        label: "Turbato",
        children: [
          { id: "scandalizzato",    label: "Scandalizzato"     },
          { id: "rivoltato",        label: "Rivoltante"       },
        ],
      },
      {
        id: "inorridito",
        label: "Inorridito",
        children: [
          { id: "indignato", label: "Rivoltato"  },
          { id: "nauseato",    label: "Nauseato"   },
        ],
      },
      {
        id: "respingente",
        label: "Respingente",
        children: [
          { id: "ribelle",       label: "Ribelle"      },
          { id: "ripugnante",    label: "Ripugnante"   },
        ],
      },
      {
        id: "disapprovante",
        label: "Disapprovante",
        children: [
          { id: "giudicante",       label: "Giudicante"      },
          { id: "giudicato",    label: "Giudicato"   },
        ],
      },
    ],
  },

  {
    id: "timoroso",
    label: "Timoroso",
    colors: ["#D306E4", "#B600D0", "#E500FF"],
    textColors: ["#fff", "#fff", "#fff"],
    children: [
      {
        id: "ansioso",
        label: "Ansioso",
        children: [
          { id: "preoccupato",   label: "Preoccupato"  },
          { id: "pensieroso", label: "Pensieroso" },
        ],
      },
      {
        id: "insicuro",
        label: "Insicuro",
        children: [
          { id: "inferiore", label: "Inferiore"},
          { id: "inadeguato",    label: "Inadeguato"   },
        ],
      },
      {
        id: "respinto",
        label: "Respinto",
        children: [
          { id: "perseguitato",      label: "Perseguitato"     },
          { id: "emarginato",   label: "Emarginato"    },
        ],
      },
      {
        id: "minacciato",
        label: "Minacciato",
        children: [
          { id: "esposto",  label: "Esposto"   },
          { id: "nervoso",    label: "Nervoso"   },
        ],
      },
      {
        id: "debole",
        label: "Debole",
        children: [
          { id: "insignificante",label: "Insignificante"},
          { id: "inutile",       label: "Inutile"      },
        ],
      },  
      {
        id: "spaventato",
        label: "Spaventato",
        children: [
          { id: "atterrito",label: "Atterrito"},
          { id: "impotente",       label: "Impotente"      },
        ],
      },
    ],
  },

  {
    id: "felice",
    label: "Felice",
    colors: ["#FFDD33", "#CCAA00", "#FFE666"],
    textColors: ["#000000", "#000000", "#000000"],
    children: [
      {
        id: "ottimista",
        label: "Ottimista",
        children: [
          { id: "ispirato",   label: "Ispirato"  },
          { id: "speranzoso",    label: "Speranzoso"   },
        ],
      },
      {
        id: "fiducioso",
        label: "Fiducioso",
        children: [
          { id: "empatico",     label: "Empatico"    },
          { id: "legato",     label: "Legato"        },
        ],
      },
      {
        id: "sereno",
        label: "Sereno",
        children: [
          { id: "affetuoso",       label: "Affettuoso"      },
          { id: "grato",   label: "Grato"  },
        ],
      },
      {
        id: "potente",
        label: "Potente",
        children: [
          { id: "audace",       label: "Audace"      },
          { id: "creativo",      label: "Creativo"     },
        ],
      },
      {
        id: "accettato",
        label: "Accettato",
        children: [
          { id: "valorizzato",      label: "Valorizzato"     },
          { id: "rispettato",      label: "Rispettato"     },
        ],
      },
      {
        id: "orgoglioso",
        label: "Orgoglioso",
        children: [
          { id: "realizzato",     label: "Realizzato"    },
          { id: "fiducioso",        label: "Fiducioso"       },
        ],
      },
      {
        id: "interessato",
        label: "Interessato",
        children: [
          { id: "curioso",    label: "Curioso"   },
          { id: "esplorativo",    label: "Esplorativo"   },
        ],
      },
      {
        id: "appagato",
        label: "Appagato",
        children: [
          { id: "gioioso",  label: "Gioioso" },
          { id: "liberato",     label: "Liberato"    },
        ],
      },
      {
        id: "spensierato",
        label: "Spensierato",
        children: [
          { id: "vivace",        label: "Vivace"       },
          { id: "scherzoso",    label: "Scherzoso"   },
        ],
      },
    ],
  },

  {
    id: "triste",
    label: "Triste",
    colors: ["#07AFFF", "#006CD0", "#0CD7FF"],
    textColors: ["#fff", "#fff", "#fff"],
    children: [
      {
        id: "ferito",
        label: "Ferito",
        children: [
          { id: "imbarazzato",  label: "Imbarazzato" },
          { id: "deluso",       label: "Deluso"      },
        ],
      },
      {
        id: "abbattuto",
        label: "Abbattuto",
        children: [
          { id: "ignorato",      label: "Ignorato"     },
          { id: "svuotato",  label: "Svuotato" },
        ],
      },
      {
        id: "colpevole",
        label: "Colpevole",
        children: [
          { id: "vergognato",    label: "Vergognato"   },
          { id: "pentito",         label: "Pentito"        },
        ],
      },
      {
        id: "disperato",
        label: "Disperato",
        children: [
          { id: "straziato",   label: "Straziato"    },
          { id: "impotente",     label: "Impotente"    },
        ],
      },
      {
        id: "vulnerabile",
        label: "Vulnerabile",
        children: [
          { id: "fragile",   label: "Fragile"  },
          { id: "maltrattato",  label: "Maltrattato" },
        ],
      },
      {
        id: "solo",
        label: "Solo",
        children: [
          { id: "abbandonato", label: "Abbandonato"  },
          { id: "isolato",       label: "Isolato"      },
        ],
      },
    ],
  },

  {
  id: "sorpreso",
  label: "Sorpreso",
  colors: ["#FF9933", "#E67300", "#FFBF80"],
  textColors: ["#4a3000", "#3a2800", "#2a1a00"],
  children: [
    {
      id: "confuso",
      label: "Confuso",
      children: [
        { id: "perplesso",    label: "Perplesso"    },
        { id: "disilluso",    label: "Disilluso"    },
      ],
    },
    {
      id: "eccitato",
      label: "Eccitato",
      children: [
        { id: "energico",     label: "Energico"     },
        { id: "impaziente",   label: "Impaziente"   },
      ],
    },
    {
      id: "stupito",
      label: "Stupito",
      children: [
        { id: "sbalordito",   label: "Sbalordito"   },
        { id: "meravigliato", label: "Meravigliato" },
      ],
    },
    {
      id: "allarmato",
      label: "Allarmato",
      children: [
        { id: "costernato",   label: "Costernato"   },
        { id: "scioccato",    label: "Scioccato"    },
      ],
    },
  ],
},
];

export default EMOTIONS;