import { motion } from "framer-motion";

const GradientButton = ({ children, href, onClick, outline }: any) => {
  const base = outline
    ? "border border-white/20 hover:border-white/40 text-white"
    : "bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black hover:brightness-110";
  
  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        whileTap={{ scale: 0.98 }}
        className={`inline-block px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-cyan-500/10 ${base}`}
      >
        {children}
      </motion.a>
    );
  }
  
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-cyan-500/10 ${base}`}
    >
      {children}
    </motion.button>
  );
};

const Section = ({ id, children, className = "" }: any) => (
  <section
    id={id}
    className={`snap-start min-h-screen w-full px-6 md:px-10 lg:px-20 py-14 ${className}`}
  >
    {children}
  </section>
);

const AuthSection = () => {
  return (
    <Section id="signin">
      <div className="rounded-3xl p-8 bg-white/5 backdrop-blur ring-1 ring-white/10 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold">Ready to get to work?</h2>
        <p className="mt-2 text-white/70">Create an account and join teams simplifying business travel.</p>
        <form className="mt-5 grid sm:grid-cols-2 gap-3">
          <input aria-label="Work email" placeholder="Work email" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10" />
          <input aria-label="Password" type="password" placeholder="Password" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10" />
          <GradientButton>Sign in</GradientButton>
          <GradientButton outline href="#get-started">Get started</GradientButton>
        </form>
      </div>
    </Section>
  );
};

export default AuthSection;