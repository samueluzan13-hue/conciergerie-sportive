import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Liens internes SANS href : dans le cadre de claude.ai, un vrai lien <a href> est intercepté
// (ouvert dans un nouvel onglet ou bloqué). On navigue donc uniquement par le routeur.
interface Props {
  to: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

function useGo(to: string) {
  const navigate = useNavigate();
  return {
    onClick: (e: MouseEvent) => {
      e.preventDefault();
      navigate(to);
    },
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate(to);
      }
    },
  };
}

export function Link({ to, className, children, ...rest }: Props) {
  const go = useGo(to);
  return (
    <a role="link" tabIndex={0} className={className} aria-label={rest["aria-label"]} {...go}>
      {children}
    </a>
  );
}

export function NavLink({ to, className, children, end, ...rest }: Props & { end?: boolean }) {
  const go = useGo(to);
  const { pathname } = useLocation();
  const active = end ? pathname === to : pathname === to || pathname.startsWith(to + "/");
  return (
    <a
      role="link"
      tabIndex={0}
      className={`${className ?? ""}${active ? " active" : ""}`}
      aria-current={active ? "page" : undefined}
      aria-label={rest["aria-label"]}
      {...go}
    >
      {children}
    </a>
  );
}
