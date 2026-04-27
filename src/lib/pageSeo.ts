function upsertMetaByName(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Sets the document title plus the standard, OpenGraph and Twitter
 * description/title meta tags so social previews stay in sync with the
 * active page and language.
 */
export function setPageSeo(title: string, description: string) {
  document.title = title;

  upsertMetaByName("description", description);
  upsertMetaByName("twitter:title", title);
  upsertMetaByName("twitter:description", description);
  upsertMetaByProperty("og:title", title);
  upsertMetaByProperty("og:description", description);
}
