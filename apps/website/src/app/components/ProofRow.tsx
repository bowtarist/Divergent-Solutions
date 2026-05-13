import site from "@/content/site.json";

export function ProofRow() {
  return (
    <section className="proof-row" aria-label="Divergent Solutions trust signals">
      {site.proof.map((item) => (
        <div className="proof-item" key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </section>
  );
}
