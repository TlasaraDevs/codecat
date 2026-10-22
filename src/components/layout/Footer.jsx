import { getDeveloper } from "@/lib/content";
import { useContent } from "@/hooks/useContent";

export const Footer = () => {
  const { data: developer } = useContent(getDeveloper);
  if (!developer) return null;
  const { name, handle, organization } = developer;

  return (
    <footer className="border-t-2 border-black bg-coal">
      <div className="container-page flex flex-col items-center gap-2 py-8 text-center text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {name} · {handle} · part of{" "}
          <a
            href={organization.url}
            className="font-semibold text-red-bright underline-offset-4 hover:underline"
          >
            {organization.name}
          </a>
        </p>
      </div>
    </footer>
  );
};
