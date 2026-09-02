import type { MockOsIconId } from "./registry";

export function MockOsIcon({ name, size = 40 }: { name: MockOsIconId; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 40 40",
    role: "img" as const,
    "aria-hidden": true,
  };

  if (name === "computer") {
    return (
      <svg {...common} shapeRendering="crispEdges">
        <rect x="4" y="5" width="25" height="20" fill="#d8cfbb" stroke="#28261f" strokeWidth="2" />
        <rect x="7" y="8" width="19" height="14" fill="#173d8f" />
        <rect x="12" y="26" width="10" height="3" fill="#8e8778" />
        <rect x="8" y="29" width="18" height="3" fill="#d8cfbb" stroke="#28261f" strokeWidth="2" />
        <rect x="31" y="8" width="6" height="24" fill="#bcb39f" stroke="#28261f" strokeWidth="2" />
        <rect x="32" y="12" width="4" height="2" fill="#28261f" />
        <rect x="33" y="27" width="2" height="2" fill="#f2c84b" />
      </svg>
    );
  }

  if (name === "folder") {
    return (
      <svg {...common} shapeRendering="crispEdges">
        <path d="M4 10h12l3-5h17v7H4z" fill="#f2c84b" stroke="#28261f" strokeWidth="2" />
        <rect x="4" y="10" width="32" height="25" fill="#e4dccd" stroke="#28261f" strokeWidth="2" />
        <rect x="8" y="16" width="24" height="2" fill="#6f6758" />
        <rect x="8" y="21" width="24" height="2" fill="#6f6758" />
        <rect x="8" y="26" width="18" height="2" fill="#6f6758" />
      </svg>
    );
  }

  if (name === "executable") {
    return (
      <svg {...common} shapeRendering="crispEdges">
        <rect x="5" y="4" width="30" height="32" fill="#d8cfbb" stroke="#28261f" strokeWidth="2" />
        <rect x="9" y="8" width="22" height="15" fill="#173d8f" stroke="#28261f" strokeWidth="2" />
        <path d="m16 12 9 4-9 4z" fill="#f2c84b" />
        <rect x="10" y="27" width="20" height="5" fill="#eee6d7" stroke="#28261f" />
        <rect x="12" y="29" width="3" height="1" fill="#3f8f52" />
      </svg>
    );
  }

  if (name === "monitor") {
    return (
      <svg {...common} shapeRendering="crispEdges">
        <rect x="3" y="5" width="34" height="25" fill="#c8c0af" stroke="#28261f" strokeWidth="2" />
        <rect x="6" y="8" width="28" height="19" fill="#102251" />
        <path d="M8 20h5l3-7 4 11 4-8 3 4h5" fill="none" stroke="#f2c84b" strokeWidth="2" />
        <rect x="16" y="31" width="8" height="3" fill="#8e8778" />
        <rect x="10" y="34" width="20" height="3" fill="#c8c0af" stroke="#28261f" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "document") {
    return (
      <svg {...common} shapeRendering="crispEdges">
        <path d="M8 3h18l7 7v27H8z" fill="#eee6d7" stroke="#28261f" strokeWidth="2" />
        <path d="M26 3v8h7" fill="#c8c0af" stroke="#28261f" strokeWidth="2" />
        <rect x="12" y="16" width="16" height="2" fill="#173d8f" />
        <rect x="12" y="21" width="13" height="2" fill="#6f6758" />
        <rect x="12" y="26" width="16" height="2" fill="#6f6758" />
        <rect x="12" y="31" width="10" height="2" fill="#6f6758" />
      </svg>
    );
  }

  return (
    <svg {...common} shapeRendering="crispEdges">
      <rect x="3" y="7" width="34" height="26" fill="#eee6d7" stroke="#28261f" strokeWidth="2" />
      <path d="M5 10l15 12 15-12" fill="#d7cdb8" stroke="#28261f" strokeWidth="2" />
      <path d="M5 31l11-11M35 31L24 20" fill="none" stroke="#6f6758" strokeWidth="2" />
      <rect x="29" y="4" width="7" height="7" fill="#f2c84b" stroke="#28261f" strokeWidth="2" />
    </svg>
  );
}

export function WindowControlIcon({
  kind,
}: {
  kind: "minimize" | "maximize" | "restore" | "close";
}) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" shapeRendering="crispEdges">
      {kind === "minimize" && <path d="M2 9h8v1H2z" fill="currentColor" />}
      {kind === "maximize" && (
        <path d="M2 2h8v8H2zM3 4v5h6V4z" fill="currentColor" fillRule="evenodd" />
      )}
      {kind === "restore" && (
        <path d="M1 4h7v7H1zm2-3h8v8H9V3H3zM2 6v4h5V6z" fill="currentColor" fillRule="evenodd" />
      )}
      {kind === "close" && (
        <path d="M2 1l4 4 4-4 1 1-4 4 4 4-1 1-4-4-4 4-1-1 4-4-4-4z" fill="currentColor" />
      )}
    </svg>
  );
}

export function StartMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path d="M2 15V3h3l4 5 4-5h3v12h-3V8l-4 5-4-5v7z" fill="currentColor" />
    </svg>
  );
}
