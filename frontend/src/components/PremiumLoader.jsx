import './PremiumLoader.css';

const PremiumLoader = ({ label = "Loading..." }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
    <div className="flex flex-col items-center">
      <div className="premium-loader-outer mb-6">
        <div className="premium-loader-inner"></div>
      </div>
      <p className="text-white text-lg font-semibold animate-pulse drop-shadow">{label}</p>
    </div>
  </div>
);

export default PremiumLoader;
