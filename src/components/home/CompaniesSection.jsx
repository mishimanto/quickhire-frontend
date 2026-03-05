export default function CompaniesSection() {
  const logos = [
    { src: '/logo/vodafone.svg', alt: 'Vodafone', w: 120 },
    { src: '/logo/intel.svg',    alt: 'Intel',    w: 80  },
    { src: '/logo/tesla.svg',    alt: 'Tesla',    w: 100 },
    { src: '/logo/amd.svg',      alt: 'AMD',      w: 80  },
    { src: '/logo/talkit.svg',   alt: 'Talkit',   w: 90  },
  ];

  return (
    <div className="w-full mb-16">
      <p className="text-sm text-slate-400 font-medium mb-10">Companies we helped grow</p>
      <div className="w-full flex items-center justify-between flex-wrap gap-y-6">
        {logos.map(({ src, alt, w }) => (
          <img
            key={alt}
            src={src}
            alt={alt}
            width={w}
            className="opacity-40 hover:opacity-60 transition-opacity grayscale"
            style={{ filter: 'grayscale(100%) brightness(0.6)' }}
          />
        ))}
      </div>
    </div>
  );
}