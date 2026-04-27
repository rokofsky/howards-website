export function setPageSeo(title: string, description: string) {
  document.title = title;

  let metaDescription = document.head.querySelector<HTMLMetaElement>(
    'meta[name="description"]'
  );

  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    document.head.appendChild(metaDescription);
  }

  metaDescription.setAttribute("content", description);
}