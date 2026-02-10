import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-screen">
      <div className="loader-content">
        <div className="loader-bars">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="loader-title">Loading</div>
      </div>
    </div>
  );
};

export default Loader;
