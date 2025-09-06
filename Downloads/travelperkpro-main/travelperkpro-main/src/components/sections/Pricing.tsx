const Pricing = () => {
  return (
    <section id="pricing" className="min-h-screen snap-start py-16 md:py-24 bg-background">
      <div className="container space-y-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Pricing</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="panel-glass rounded-3xl p-6">
            <h3 className="font-semibold">Starter</h3>
            <p className="text-muted-foreground text-sm mb-4">For small teams</p>
            <p className="text-3xl font-bold">₹0</p>
          </div>
          <div className="panel-glass rounded-3xl p-6 border-primary">
            <h3 className="font-semibold">Pro</h3>
            <p className="text-muted-foreground text-sm mb-4">For growing companies</p>
            <p className="text-3xl font-bold">₹7,500</p>
          </div>
          <div className="panel-glass rounded-3xl p-6">
            <h3 className="font-semibold">Enterprise</h3>
            <p className="text-muted-foreground text-sm mb-4">Custom controls</p>
            <p className="text-3xl font-bold">Talk to us</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
