import Link from "next/link";
import type { ReactNode } from "react";

const TOKEN_REGEX = /\*\*(.+?)\*\*|`([^`]+)`|(\/[a-z][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*)/gi;
const PATH_REGEX = /\/[a-z][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*/gi;

function linkifyPaths(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  const regex = new RegExp(PATH_REGEX);

  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <Link
        key={`${keyPrefix}-l${i++}`}
        href={match[0]}
        className="font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-900"
      >
        {match[0]}
      </Link>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function renderMessageContent(content: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  const regex = new RegExp(TOKEN_REGEX);

  while ((match = regex.exec(content))) {
    if (match.index > lastIndex) {
      nodes.push(...linkifyPaths(content.slice(lastIndex, match.index), `p${i}`));
    }

    if (match[1] !== undefined) {
      nodes.push(<strong key={`b${i}`}>{linkifyPaths(match[1], `b${i}`)}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(
        <code key={`c${i}`} className="rounded bg-ink-900/5 px-1 py-0.5 text-[13px]">
          {linkifyPaths(match[2], `c${i}`)}
        </code>,
      );
    } else if (match[3] !== undefined) {
      nodes.push(
        <Link
          key={`d${i}`}
          href={match[3]}
          className="font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-900"
        >
          {match[3]}
        </Link>,
      );
    }

    lastIndex = match.index + match[0].length;
    i++;
  }

  if (lastIndex < content.length) {
    nodes.push(...linkifyPaths(content.slice(lastIndex), `p${i}`));
  }

  return nodes;
}
