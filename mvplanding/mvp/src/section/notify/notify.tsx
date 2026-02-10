import LeftBall from '../metallic_ball/leftball.png'
import RightBall from '../metallic_ball/rightball.png'

import './notify.css'

const Notify = () => {
    return (
        <div className="notify-container-wrapper">
            <div className="notify-container">
                <img src={LeftBall} alt="" className="notify-ball-left" />
                <img src={RightBall} alt="" className="notify-ball-right" />

                <h2 className="notify-title">Start exploring<br />the FinEasy Analyzer</h2>
                <p className="notify-description">
                    We’re calling on entrepreneurs and visionaries who want to analyze their financial ecosystem. Join our mailing list to stay updated.
                </p>

                <form className="notify-form">
                    <input type="email" placeholder="Enter your email" className="notify-input" />
                    <button type="submit" className="notify-button">Subscribe</button>
                </form>

                <p className="notify-footer">By submitting your email, you agree to our <a href="#">terms</a>.</p>
            </div>
        </div>
    )
}

export default Notify
