/** @type {Record<string, string | ((...args: any[]) => string)>} */
const en = {
  // Header / navigation
  backBtn:     '← Go back',
  switchLight: 'Switch to light theme',
  switchDark:  'Switch to dark theme',
  closeWheel: '✕ Close wheel',
  title: "ABC Diary",

  // Sections
  sectionSituation:    'A - Situation',
  sectionThoughts:     'B - Thoughts',
  sectionConsequences: 'C - Consequences',

  // Welcome banner
  welcome: 'Welcome,',

  // NameAndDate labels & placeholders
  labelName:        'First name',
  labelSurname:     'Last name',
  labelDate:        'Date',
  placeholderName:    'Enter your first name',
  placeholderSurname: 'Enter your last name',

  // Situation fields
  sLabel_cosa:        'What happened?',
  sPlaceholder_cosa:  'Describe what happened...',
  sLabel_quando:      'When?',
  sPlaceholder_quando:'When did it happen?',
  sLabel_dove:        'Where?',
  sPlaceholder_dove:  'Where were you?',
  sLabel_chi:         'With whom?',
  sPlaceholder_chi:   'Who were you with?',
  sLabel_facendo:     'What were you doing?',
  sPlaceholder_facendo:'What were you doing?',

  // Thoughts
  thoughtsQuestion:    'What went through your mind?',
  thoughtsPlaceholder: 'What did you think?',

  // Wheel titles & hints
  wheelSubtitle:  'Emotion wheel',
  wheelTitle:     'How did you feel?',
  wheelHint:      'If you prefer to see all available emotions,',
  wheelHintLink:  'select the wheel',
  wheelPinchHint: 'Use fingers to zoom',
  wheelOpenBtn:   'Click here to select emotions',

  // Step labels
  step_core:      'Choose the general emotion',
  step_secondary: 'Try to go deeper',
  step_tertiary:  'Which describes it best?',
  step_done:      '✓ Done',

  // Breadcrumb
  breadcrumbEmpty: 'your path will appear here',

  // Intensity selector
  intensityLabel: 'How intense is',
  save:           'Save',

  // Saved emotions list
  savedEmotions: 'Saved emotions',

  // Navigation buttons
  back:    '← Back',
  restart: '↺ Restart',

  // Consequence fields
  cLabel_sensazioni:       'Physical sensations',
  cPlaceholder_sensazioni: 'What did you feel in your body?',
  cLabel_fatto:            'What I did',
  cPlaceholder_fatto:      'How did you react?',
  cLabel_voluto:           'What I wanted to do',
  cPlaceholder_voluto:     'What did you want to do?',
  cLabel_nonVoluto:        "What I wish I had not done",
  cPlaceholder_nonVoluto:  "What did you do but wish you hadn't?",

  // Emotion labels
  em_arrabbiato: 'Angry', em_aggressivo: 'Aggressive', em_ostile: 'Hostile', em_provocato: 'Provoked',
  em_critico: 'Critical', em_scettico: 'Skeptical', em_sminuente: 'Dismissive',
  em_distaccato: 'Detached', em_asociale: 'Antisocial', em_anestetizzato: 'Numbed',
  em_frustrato: 'Frustrated', em_infuriato: 'Enraged', em_irritato: 'Irritated',
  em_amareggiato: 'Embittered', em_indignato: 'Indignant', em_violato: 'Violated',
  em_umiliato: 'Humiliated', em_svilito: 'Belittled', em_ridicolizzato: 'Ridiculed',
  em_deluso: 'Disappointed', em_tradito: 'Betrayed', em_rancoroso: 'Resentful',
  em_disgustato: 'Disgusted', em_turbato: 'Troubled', em_scandalizzato: 'Scandalized',
  em_rivoltato: 'Revolting', em_inorridito: 'Horrified', em_nauseato: 'Nauseated',
  em_respingente: 'Repulsive', em_ribelle: 'Rebellious', em_ripugnante: 'Repugnant',
  em_disapprovante: 'Disapproving', em_giudicante: 'Judgmental', em_giudicato: 'Judged',
  em_timoroso: 'Fearful', em_ansioso: 'Anxious', em_preoccupato: 'Worried', em_pensieroso: 'Pensive',
  em_insicuro: 'Insecure', em_inferiore: 'Inferior', em_inadeguato: 'Inadequate',
  em_respinto: 'Rejected', em_perseguitato: 'Persecuted', em_emarginato: 'Marginalized',
  em_minacciato: 'Threatened', em_esposto: 'Exposed', em_nervoso: 'Nervous',
  em_debole: 'Weak', em_insignificante: 'Insignificant', em_inutile: 'Useless',
  em_spaventato: 'Scared', em_atterrito: 'Terrified', em_impotente: 'Powerless',
  em_felice: 'Happy', em_ottimista: 'Optimistic', em_ispirato: 'Inspired', em_speranzoso: 'Hopeful',
  em_fiducioso: 'Trusting', em_empatico: 'Empathetic', em_legato: 'Connected',
  em_sereno: 'Serene', em_affetuoso: 'Affectionate', em_grato: 'Grateful',
  em_potente: 'Powerful', em_audace: 'Bold', em_creativo: 'Creative',
  em_accettato: 'Accepted', em_valorizzato: 'Valued', em_rispettato: 'Respected',
  em_orgoglioso: 'Proud', em_realizzato: 'Fulfilled',
  em_interessato: 'Interested', em_curioso: 'Curious', em_esplorativo: 'Exploratory',
  em_appagato: 'Satisfied', em_gioioso: 'Joyful', em_liberato: 'Liberated',
  em_spensierato: 'Carefree', em_vivace: 'Lively', em_scherzoso: 'Playful',
  em_triste: 'Sad', em_ferito: 'Hurt', em_imbarazzato: 'Embarrassed',
  em_abbattuto: 'Downcast', em_ignorato: 'Ignored', em_svuotato: 'Drained',
  em_colpevole: 'Guilty', em_vergognoso: 'Ashamed', em_pentito: 'Remorseful',
  em_disperato: 'Desperate', em_straziato: 'Anguished',
  em_vulnerabile: 'Vulnerable', em_fragile: 'Fragile', em_maltrattato: 'Mistreated',
  em_solo: 'Lonely', em_abbandonato: 'Abandoned', em_isolato: 'Isolated',
  em_sorpreso: 'Surprised', em_confuso: 'Confused', em_perplesso: 'Perplexed', em_disilluso: 'Disillusioned',
  em_eccitato: 'Excited', em_energico: 'Energetic', em_impaziente: 'Impatient',
  em_stupito: 'Amazed', em_sbalordito: 'Astonished', em_meravigliato: 'Awestruck',
  em_allarmato: 'Alarmed', em_costernato: 'Dismayed', em_scioccato: 'Shocked',

  // PDF content
  pdfTitle:            'EMOTION DIARY',
  pdfDate:             'Date',
  pdfSectionA:         'A — SITUATION',
  pdfSectionB:         'B — THOUGHTS',
  pdfSectionC:         'C — CONSEQUENCES',
  pdfEmotionsFound:    'Identified emotions',
  pdfIntensity:        'Intensity',
  pdfSit_cosa:         'What happened',
  pdfSit_quando:       'When',
  pdfSit_dove:         'Where',
  pdfSit_chi:          'With whom',
  pdfSit_facendo:      'What I was doing',
  pdfConseq_sensazioni:'Physical sensations',
  pdfConseq_fatto:     'What I did',
  pdfConseq_voluto:    'What I wanted to do',
  pdfConseq_nonVoluto: 'What I wish I had not done',

  // Action buttons
  generatePDF: 'Generate PDF',

  // Privacy notice
  privacyTitle: 'Privacy Guaranteed',
  privacyText:  '— all data stays on your device and is automatically deleted when you close the page. No information is transmitted or stored externally.',

  // Alert / confirm dialogs
  alertNameRequired:    'Please fill in at least first and last name to generate the PDF.',
  alertEmotionRequired: 'Add at least one emotion before generating the PDF.',
  confirmPDF:     (name, surname) => `Generate the PDF for ${name} ${surname}?`,
  confirmRestart: 'Start over? All entered data will be deleted.',
}

export default en
