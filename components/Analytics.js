// components/Analytics.js
import Script from 'next/script'

const Analytics = () => (
  <>
    <Script 
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=G-SQ2CNB5WWP`}
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-SQ2CNB5WWP');
      `}
    </Script>
  </>
)

export default Analytics