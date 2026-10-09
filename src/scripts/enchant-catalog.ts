const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("it");
document
  .querySelectorAll<HTMLElement>("[data-enchant-catalog]")
  .forEach((catalog) => {
    const form = catalog.querySelector<HTMLFormElement>("form");
    const query = form?.querySelector<HTMLInputElement>("[name=query]");
    const rarity = form?.querySelector<HTMLSelectElement>("[name=rarity]");
    const equipment =
      form?.querySelector<HTMLSelectElement>("[name=equipment]");
    const count = catalog.querySelector<HTMLElement>(".catalog-count");
    const empty = catalog.querySelector<HTMLElement>(".catalog-empty");
    const cards = [
      ...catalog.querySelectorAll<HTMLElement>("[data-enchant-card]"),
    ];
    if (!form || !query || !rarity || !equipment || !count || !empty) return;
    form.hidden = false;
    const filter = () => {
      const terms = normalize(query.value.trim()).split(/\s+/).filter(Boolean);
      let visible = 0;
      cards.forEach((card) => {
        const items: string[] = JSON.parse(card.dataset.equipment ?? "[]");
        const match =
          terms.every((t) =>
            normalize(card.dataset.search ?? "").includes(t),
          ) &&
          (!rarity.value || card.dataset.rarity === rarity.value) &&
          (!equipment.value ||
            items.includes(equipment.value) ||
            items.includes("Tutti"));
        card.hidden = !match;
        if (match) visible++;
      });
      count.textContent = `${visible} ${visible === 1 ? "scheda trovata" : "schede trovate"} su ${cards.length}`;
      empty.hidden = visible > 0;
    };
    form.addEventListener("input", filter);
    form.addEventListener("submit", (event) => event.preventDefault());
  // The reset event runs before the browser restores the form values.
  form.addEventListener("reset", () => requestAnimationFrame(filter));
  });
