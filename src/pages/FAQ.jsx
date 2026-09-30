import { useState } from "react";
import { preguntas } from "../data/faq";
import FaqItem from "../components/FaqItem";

export default function FAQ() {
  const [abiertoId, setAbiertoId] = useState(null);

  const toggle = (id) => setAbiertoId((actual) => (actual === id ? null : id));

  return (
    <section className="faq">
      <h2>Preguntas frecuentes</h2>
      {preguntas.map((item) => (
        <FaqItem
          key={item.id}
          item={item}
          abierto={abiertoId === item.id}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </section>
  );
}