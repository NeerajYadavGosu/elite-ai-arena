
const sponsorLogos = [
  { name: "Google", image: "https://skillicons.dev/icons?i=gcp" },
  { name: "Meta", image: "https://skillicons.dev/icons?i=react" },
  { name: "Nvidia", image: "https://skillicons.dev/icons?i=tensorflow" },
  { name: "Oracle", image: "https://skillicons.dev/icons?i=java" },
  { name: "OpenAI", image: "https://skillicons.dev/icons?i=ai" },
  { name: "Salesforce", image: "https://skillicons.dev/icons?i=salesforce" },
  { name: "Microsoft", image: "https://skillicons.dev/icons?i=azure" },
  { name: "Apple", image: "https://skillicons.dev/icons?i=swift" },
  { name: "Adobe", image: "https://skillicons.dev/icons?i=ps" }
];

const LogoMarquee = () => {
  return (
    <div className="w-full overflow-hidden bg-elite-muted/50 py-6">
      <div className="flex w-full overflow-x-hidden">
        <div className="logo-scroll">
          <div className="logo-track">
            {sponsorLogos.map((logo) => (
              <div key={logo.name} className="flex items-center justify-center mx-8">
                <img 
                  src={logo.image} 
                  alt={logo.name} 
                  className="h-12 w-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  title={logo.name}
                />
              </div>
            ))}
          </div>
          <div className="logo-track" aria-hidden="true">
            {sponsorLogos.map((logo) => (
              <div key={`${logo.name}-duplicate`} className="flex items-center justify-center mx-8">
                <img 
                  src={logo.image} 
                  alt={logo.name} 
                  className="h-12 w-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
