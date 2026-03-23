import { formatDate } from './formatDate'
import { jsPDF }      from 'jspdf'

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  bg:        [245, 245, 248],
  ink:       [10,  10,  18 ],
  accent:    [75,  60,  180],
  muted:     [115, 112, 135],
  rule:      [200, 198, 218],
  headerBg:  [75,  60,  180],
  headerTxt: [245, 245, 248],
}

/**
 * Build and (optionally) save a PDF summary of the emotion diary.
 *
 * @param {object}   state          Full Zustand store snapshot.
 * @param {object}   [opts]
 * @param {boolean}  [opts.preview] When true, returns a blob URL instead of
 *                                  triggering a file download.
 * @param {function} [t]            Translation function from useTranslation().
 * @returns {string | undefined}    Blob URL when preview=true, else void.
 */
export default function generatePDF(state, { preview = false } = {}, t = (k) => k) {
  const { name, surname, date, situationValues, thoughts, savedEmotions, conseqValues } = state
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const PW = 210
  const W  = 170, lm = 20
  let y = 0

  const paintBg = () => {
    doc.setFillColor(...C.bg)
    doc.rect(0, 0, PW, 297, 'F')
  }
  paintBg()

  const line = (txt, size = 11, bold = false, color = C.ink) => {
    doc.setFontSize(size)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(txt, W)
    if (y + lines.length * size * 0.4 > 280) {
      doc.addPage()
      paintBg()
      y = 20
    }
    doc.text(lines, lm, y)
    y += lines.length * size * 0.4 + 1
  }

  const gap  = (n = 4) => { y += n }
  const rule = () => {
    doc.setDrawColor(...C.rule)
    doc.line(lm, y, lm + W, y)
    y += 6
  }

  const titleBar = () => {
    const barH = 22
    doc.setFillColor(...C.headerBg)
    doc.rect(0, 0, PW, barH, 'F')
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.headerTxt)
    doc.text(t('pdfTitle'), lm, 14)
    y = barH + 8
  }

  const sectionLabel = (txt) => {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.accent)
    doc.text(txt, lm, y)
    y += 5
  }

  // ── Header ──────────────────────────────────────────────────────────────────
  titleBar()
  line(`${name} ${surname}`, 13, true, C.ink)
  gap(1)
  line(`${t('pdfDate')}: ${formatDate(date)}`, 10, false, C.muted)
  gap(4); rule()

  // ── A — Situation ───────────────────────────────────────────────────────────
  sectionLabel(t('pdfSectionA'))
  gap(3)
  const sitFields = ['cosa', 'quando', 'dove', 'chi', 'facendo']
  for (const id of sitFields) {
    const val = situationValues[id]
    if (val) {
      line(`${t(`pdfSit_${id}`)}:`, 10, true, C.muted)
      line(val, 10, false, C.ink)
      gap(1)
    }
  }
  gap(3); rule()

  // ── B — Thoughts ────────────────────────────────────────────────────────────
  sectionLabel(t('pdfSectionB'))
  gap(3)
  line(thoughts || '—', 10, false, C.ink)
  gap(3); rule()

  // ── C — Consequences ────────────────────────────────────────────────────────
  sectionLabel(t('pdfSectionC'))
  gap(3)

  if (savedEmotions.length > 0) {
    line(`${t('pdfEmotionsFound')}:`, 10, true, C.muted)
    gap(2)
    for (const { emotion, intensity } of savedEmotions) {
      const label = t(`em_${emotion.id}`)
      line(`• ${label}  —  ${t('pdfIntensity')}: ${intensity}/10`, 10, false, C.ink)
    }
    gap(4)
  }

  const conseqFields = ['sensazioni', 'fatto', 'voluto', 'nonVoluto']
  for (const id of conseqFields) {
    const val = conseqValues[id]
    if (val) {
      line(`${t(`pdfConseq_${id}`)}:`, 10, true, C.muted)
      line(val, 10, false, C.ink)
      gap(1)
    }
  }

  if (preview) return doc.output('bloburl')
  doc.save(`diario-emozioni-${name}-${surname}-${formatDate(date).replace(/ /g, '')}.pdf`)
}
