import { useState, useEffect } from 'react'
import useEmotionsStore from '../store/emotionsStore'
import generatePDF from '../utils/pdfBuilder'

const PdfPreview = () => {
  const state = useEmotionsStore()
  const [url, setUrl] = useState(null)

  useEffect(() => {
    const blobUrl = generatePDF(state, { preview: true })
    setUrl(blobUrl)
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
  }, [state])

  if (!url) return null

  return (
    <div className="md:col-span-2 flex flex-col items-center px-8 py-6">
      <p className="text-neutral-400 text-sm mb-3" style={{ fontFamily: "'Manrope', sans-serif" }}>
        (Temp)
      </p>
      <iframe
        src={url}
        title="PDF Preview"
        className="w-full max-w-[800px] rounded-lg border border-neutral-700"
        style={{ height: '80vh' }}
      />
    </div>
  )
}

export default PdfPreview
