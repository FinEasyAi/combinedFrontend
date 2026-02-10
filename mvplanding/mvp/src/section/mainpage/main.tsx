import './main.css'
import MetallicBall from '../metallic_ball/3D_animation_4_1_nv9vut.mov'


const main = () => {
    return (
        <div className="main">
            <div className="metallic-ball-wrapper">
                <video
                    src={MetallicBall}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="metallic-ball"
                />
            </div>
            <div className="hero-content">
                <h1 className='tittle'>We make<br />Finance Easy.</h1>
                <span className='sub-tittle'>Track and analyze your financial data in real-time</span>
            </div>

            <div className="CTA">
                <button className="get-started">Get Started</button>
            </div>

        </div>
    )
}

export default main