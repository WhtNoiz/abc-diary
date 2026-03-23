/** @type {Record<string, string | ((...args: any[]) => string)>} */
const it = {
  // Header / navigation
  backBtn:     '← Torna indietro',
  switchLight: 'Passa al tema chiaro',
  switchDark:  'Passa al tema scuro',
  closeWheel: '✕ Chiudi la ruota',
  title: "Diario ABC",

  // Sections
  sectionSituation:    'A - Situazione',
  sectionThoughts:     'B - Pensieri',
  sectionConsequences: 'C - Conseguenze',

  // Welcome banner
  welcome: 'Benvenut\u0259,',

  // NameAndDate labels & placeholders
  labelName:        'Nome',
  labelSurname:     'Cognome',
  labelDate:        'Data',
  placeholderName:    'Inserisci il tuo nome',
  placeholderSurname: 'Inserisci il tuo cognome',

  // Situation fields
  sLabel_cosa:        'Cosa è successo?',
  sPlaceholder_cosa:  'Descrivi cosa è successo...',
  sLabel_quando:      'Quando?',
  sPlaceholder_quando:'Quando è successo?',
  sLabel_dove:        'Dove?',
  sPlaceholder_dove:  'Dove ti trovavi?',
  sLabel_chi:         'Con chi?',
  sPlaceholder_chi:   'Con chi eri?',
  sLabel_facendo:     'Cosa Stavi Facendo?',
  sPlaceholder_facendo:'Cosa stavi facendo?',

  // Thoughts
  thoughtsQuestion:    'Cosa ti è passato per la testa?',
  thoughtsPlaceholder: 'Cosa hai pensato?',

  // Wheel titles & hints
  wheelSubtitle:  'Ruota delle emozioni',
  wheelTitle:     'Come ti sei sentit\u0259?',
  wheelHint:      'Se preferisci vedere tutte le emozioni disponibili,',
  wheelHintLink:  'seleziona la ruota',
  wheelPinchHint: 'Usa le dita per zoomare',
  wheelOpenBtn:   'Clicca qui per selezionare le emozioni',

  // Step labels
  step_core:      "Scegli l'emozione generale",
  step_secondary: 'Prova ad approfondire',
  step_tertiary:  'Quale di queste la descrive meglio?',
  step_done:      '✓ Fatto',

  // Breadcrumb
  breadcrumbEmpty: 'il tuo percorso apparirà qui',

  // Intensity selector
  intensityLabel: 'Quanto è intensa',
  save:           'Salva',

  // Saved emotions list
  savedEmotions: 'Emozioni salvate',

  // Navigation buttons
  back:    '← Indietro',
  restart: '↺ Ricomincia',

  // Consequence fields
  cLabel_sensazioni:       'Sensazioni fisiche',
  cPlaceholder_sensazioni: 'Cosa hai sentito nel corpo?',
  cLabel_fatto:            'Cosa ho fatto',
  cPlaceholder_fatto:      'Come hai reagito?',
  cLabel_voluto:           'Cosa avrei voluto fare',
  cPlaceholder_voluto:     'Cosa avresti voluto fare?',
  cLabel_nonVoluto:        'Azioni che non avrei voluto fare',
  cPlaceholder_nonVoluto:  'Cosa hai fatto ma non avresti voluto?',

  // Emotion labels
  em_arrabbiato: 'Arrabbiato', em_aggressivo: 'Aggressivo', em_ostile: 'Ostile', em_provocato: 'Provocato',
  em_critico: 'Critico', em_scettico: 'Scettico', em_sminuente: 'Sminuente',
  em_distaccato: 'Distaccato', em_asociale: 'Asociale', em_anestetizzato: 'Anestetizzato',
  em_frustrato: 'Frustrato', em_infuriato: 'Infuriato', em_irritato: 'Irritato',
  em_amareggiato: 'Amareggiato', em_indignato: 'Indignato', em_violato: 'Violato',
  em_umiliato: 'Umiliato', em_svilito: 'Svilito', em_ridicolizzato: 'Ridicolizzato',
  em_deluso: 'Deluso', em_tradito: 'Tradito', em_rancoroso: 'Rancoroso',
  em_disgustato: 'Disgustato', em_turbato: 'Turbato', em_scandalizzato: 'Scandalizzato',
  em_rivoltato: 'Rivoltante', em_inorridito: 'Inorridito', em_nauseato: 'Nauseato',
  em_respingente: 'Respingente', em_ribelle: 'Ribelle', em_ripugnante: 'Ripugnante',
  em_disapprovante: 'Disapprovante', em_giudicante: 'Giudicante', em_giudicato: 'Giudicato',
  em_timoroso: 'Timoroso', em_ansioso: 'Ansioso', em_preoccupato: 'Preoccupato', em_pensieroso: 'Pensieroso',
  em_insicuro: 'Insicuro', em_inferiore: 'Inferiore', em_inadeguato: 'Inadeguato',
  em_respinto: 'Respinto', em_perseguitato: 'Perseguitato', em_emarginato: 'Emarginato',
  em_minacciato: 'Minacciato', em_esposto: 'Esposto', em_nervoso: 'Nervoso',
  em_debole: 'Debole', em_insignificante: 'Insignificante', em_inutile: 'Inutile',
  em_spaventato: 'Spaventato', em_atterrito: 'Atterrito', em_impotente: 'Impotente',
  em_felice: 'Felice', em_ottimista: 'Ottimista', em_ispirato: 'Ispirato', em_speranzoso: 'Speranzoso',
  em_fiducioso: 'Fiducioso', em_empatico: 'Empatico', em_legato: 'Legato',
  em_sereno: 'Sereno', em_affetuoso: 'Affettuoso', em_grato: 'Grato',
  em_potente: 'Potente', em_audace: 'Audace', em_creativo: 'Creativo',
  em_accettato: 'Accettato', em_valorizzato: 'Valorizzato', em_rispettato: 'Rispettato',
  em_orgoglioso: 'Orgoglioso', em_realizzato: 'Realizzato',
  em_interessato: 'Interessato', em_curioso: 'Curioso', em_esplorativo: 'Esplorativo',
  em_appagato: 'Appagato', em_gioioso: 'Gioioso', em_liberato: 'Liberato',
  em_spensierato: 'Spensierato', em_vivace: 'Vivace', em_scherzoso: 'Scherzoso',
  em_triste: 'Triste', em_ferito: 'Ferito', em_imbarazzato: 'Imbarazzato',
  em_abbattuto: 'Abbattuto', em_ignorato: 'Ignorato', em_svuotato: 'Svuotato',
  em_colpevole: 'Colpevole', em_vergognoso: 'Vergognoso', em_pentito: 'Pentito',
  em_disperato: 'Disperato', em_straziato: 'Straziato',
  em_vulnerabile: 'Vulnerabile', em_fragile: 'Fragile', em_maltrattato: 'Maltrattato',
  em_solo: 'Solo', em_abbandonato: 'Abbandonato', em_isolato: 'Isolato',
  em_sorpreso: 'Sorpreso', em_confuso: 'Confuso', em_perplesso: 'Perplesso', em_disilluso: 'Disilluso',
  em_eccitato: 'Eccitato', em_energico: 'Energico', em_impaziente: 'Impaziente',
  em_stupito: 'Stupito', em_sbalordito: 'Sbalordito', em_meravigliato: 'Meravigliato',
  em_allarmato: 'Allarmato', em_costernato: 'Costernato', em_scioccato: 'Scioccato',

  // PDF content
  pdfTitle:            'DIARIO DELLE EMOZIONI',
  pdfDate:             'Data',
  pdfSectionA:         'A — SITUAZIONE',
  pdfSectionB:         'B — PENSIERI',
  pdfSectionC:         'C — CONSEGUENZE',
  pdfEmotionsFound:    'Emozioni identificate',
  pdfIntensity:        'Intensità',
  pdfSit_cosa:         'Cosa è successo',
  pdfSit_quando:       'Quando',
  pdfSit_dove:         'Dove',
  pdfSit_chi:          'Con chi',
  pdfSit_facendo:      'Cosa stavo facendo',
  pdfConseq_sensazioni:'Sensazioni fisiche',
  pdfConseq_fatto:     'Cosa ho fatto',
  pdfConseq_voluto:    'Cosa avrei voluto fare',
  pdfConseq_nonVoluto: 'Azioni che non avrei voluto fare',

  // Action buttons
  generatePDF: 'Genera PDF',

  // Privacy notice
  privacyTitle: 'Privacy Garantita',
  privacyText:  '— tutti i dati rimangono sul tuo dispositivo e vengono eliminati automaticamente alla chiusura della pagina. Nessuna informazione viene trasmessa o archiviata esternamente.',

  // Alert 
  alertNameRequired:    'Per generare il PDF compila almeno nome e cognome.',
  alertEmotionRequired: "Aggiungi almeno un'emozione prima di generare il PDF.",

  // Confirm
  confirmPDF:     (name, surname) => `Generare il PDF per ${name} ${surname}?`,
  confirmRestart: 'Ricominciare da capo? Tutti i dati inseriti verranno cancellati.',
}

export default it
