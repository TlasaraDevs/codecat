import { CONTACT_FORM_URL } from "@/config";

// The message the company contact form is prefilled with.
export const buildWorkWithMeMessage = (developer) =>
  `Hi, I have been impressed by the work of ${developer.name} (${developer.handle}), and would like to work with them on a project of my own.`;

// Link to the Tlasara contact form, prefilled for this developer:
//   https://tlasara.dev/contact?developer=<slug>&message=<url-encoded message>
// Reusable by any developer portfolio — pass that developer's record.
export const buildWorkWithMeUrl = (developer, baseUrl = CONTACT_FORM_URL) => {
  const params = [
    `developer=${encodeURIComponent(developer.slug)}`,
    `message=${encodeURIComponent(buildWorkWithMeMessage(developer))}`,
  ].join("&");
  return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${params}`;
};
