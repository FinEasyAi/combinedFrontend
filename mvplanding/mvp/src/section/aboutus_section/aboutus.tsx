import FeatureCard from '../../component/cards'
import LeftBall from '../metallic_ball/leftball.png'
import RightBall from '../metallic_ball/rightball.png'

import './aboutus.css'

const Features = () => {
  return (
    <div className="about-us-container">
      <img src={LeftBall} alt="" className="ball-left" />
      <img src={RightBall} alt="" className="ball-right" />

      <div className="aboutus-content-wrapper">
        <h2 className="aboutus-title">Secure finance using Ai</h2>
        <span className="aboutus-subtitle">in your hands at any instance.</span>

        <div className="features-grid">
          <FeatureCard
            title="Financial audio → trusted data"
            description="Clean and normalize raw financial audio at scale.
Convert speech to accurate, time-aligned transcripts.
Produce compliant, reviewable, structured financial outputs."
          />

          <FeatureCard
            title="Intent, risk, and obligation detection"
            description="Detect customer intent and conversational outcomes.
Extract key financial entities like EMIs, dates, and amounts.
Automatically flag fraud, risk, and regulatory phrases."
          />

          <FeatureCard
            title="Documents to structured finance data"
            description="Understand document layout and financial context.
Extract structured data from PDFs, images, and scans.
Validate accuracy with human-in-the-loop intelligence."
          />
        </div>

        <div className="aboutus-footer">
          <a href="#how-it-works" className="aboutus-footer-link">Learn how FinEasy works ↗</a>
        </div>
      </div>
    </div>
  )
}

export default Features
