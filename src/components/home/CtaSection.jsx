export default function CtaSection() {
  return (
    <div className="mb-24">
      <div className="relative overflow-visible">
        <div className="cta-bg grid lg:grid-cols-2 items-center">
          <div className="px-15 py-20 text-white">
            <h2 className="text-4xl font-extrabold leading-tight mb-6">
              Start posting <br /> jobs today
            </h2>
            <p className="text-indigo-100 mb-8">Start posting jobs for only $10.</p>
            <button className="bg-white text-indigo-600 font-semibold px-6 py-3 hover:bg-indigo-50 transition">
              Sign Up For Free
            </button>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <img
              src="/dashboard.svg"
              alt="dashboard"
              className="relative z-10 w-[520px] -mb-16 mr-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}