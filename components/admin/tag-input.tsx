"use client";

import { useState } from "react";

export function TagInput({ name, label, initialTags, suggestions }: { name: string; label: string; initialTags: string[]; suggestions: string[] }) {
  const [tags, setTags] = useState(initialTags);
  const [value, setValue] = useState("");

  function addTag() {
    const tag = value.trim();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setValue("");
  }

  return (
    <div>
      <label className="block text-sm font-semibold">{label}<input value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(); } }} list={`${name}-suggestions`} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none focus:border-[var(--dark)]" /></label>
      <datalist id={`${name}-suggestions`}>{suggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}</datalist>
      <input type="hidden" name={name} value={JSON.stringify(tags)} />
      {tags.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{tags.map((tag) => <button key={tag} type="button" onClick={() => setTags(tags.filter((item) => item !== tag))} className="rounded-full bg-[#eff9d7] px-3 py-1.5 text-xs font-semibold text-[#627a34]">{tag} ×</button>)}</div>}
    </div>
  );
}
