import { Fragment, type ReactNode } from "react";
import { isExternalHref } from "@/components/ui/Button";
import Link from "next/link";
import type { BlockNode, InlineNode } from "./document";

function renderInline(nodes: InlineNode[]): ReactNode {
  return nodes.map((node, index) => {
    if (typeof node === "string") {
      return <Fragment key={index}>{node}</Fragment>;
    }

    if (node.type === "strong") {
      return <strong key={index}>{renderInline(node.children)}</strong>;
    }

    if (node.type === "em") {
      return <em key={index}>{renderInline(node.children)}</em>;
    }

    if (isExternalHref(node.href)) {
      return (
        <a key={index} href={node.href} target="_blank" rel="noreferrer">
          {renderInline(node.children)}
        </a>
      );
    }

    return (
      <Link key={index} href={node.href}>
        {renderInline(node.children)}
      </Link>
    );
  });
}

function renderBlock(block: BlockNode, index: number): ReactNode {
  if (block.type === "heading") {
    const Tag = `h${block.level}` as "h2" | "h3" | "h4";
    return <Tag key={index}>{renderInline(block.children)}</Tag>;
  }

  if (block.type === "list") {
    const Tag = block.ordered ? "ol" : "ul";
    return (
      <Tag key={index}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInline(item)}</li>
        ))}
      </Tag>
    );
  }

  return <p key={index}>{renderInline(block.children)}</p>;
}

/** Renders a document tree as semantic HTML. Wrap in `<Prose>` for typography. */
export function RichDocument({ blocks }: { blocks: BlockNode[] }) {
  return <>{blocks.map(renderBlock)}</>;
}
