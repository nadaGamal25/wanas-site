'use client'

import { useLocale } from '../context/LocaleContext'
import { FaWhatsapp,FaFacebook ,FaInstagram} from "react-icons/fa";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201000000000'

export default function Footer() {
  const { t } = useLocale()

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">وَنَس</div>
          <p>{t.footer.tagline}</p>
        </div>
        <div className="footer-col">
          <h4>{t.footer.follow}</h4>
          <div className="social-row">
            <a className="social-circle" href="#" target="_blank" rel="noreferrer"><FaInstagram/></a>
            <a className="social-circle" href="#" target="_blank" rel="noreferrer"><FaFacebook/></a>
            {/* <a className="social-circle" href="#" target="_blank" rel="noreferrer">TT</a> */}
          </div>
        </div>
        <div className="footer-col">
          <h4>{t.footer.contact}</h4>
          <a className="contact-btn wa" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
            {t.footer.whatsapp} <FaWhatsapp/>
          </a>
          {/* <a className="contact-btn ph" href={`tel:${WHATSAPP_NUMBER}`}>
            {WHATSAPP_NUMBER}
          </a> */}
        </div>
      </div>
      <div className="copyright">© {new Date().getFullYear()} وَنَس — {t.footer.rights}</div>
    </footer>
  )
}
