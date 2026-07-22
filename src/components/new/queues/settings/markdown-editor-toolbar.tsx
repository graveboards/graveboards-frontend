import type {ComponentType} from "react";
import {
    MdChecklist,
    MdCode,
    MdFormatBold,
    MdFormatItalic,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdFormatQuote,
    MdLink,
    MdTitle,
} from "react-icons/md";

export type MarkdownEditorAction =
    | "heading"
    | "bold"
    | "italic"
    | "quote"
    | "code"
    | "link"
    | "unordered-list"
    | "ordered-list"
    | "task-list";

export interface MarkdownEdit {
    value: string;
    selectionStart: number;
    selectionEnd: number;
}

interface MarkdownEditorToolbarProps {
    onAction: (action: MarkdownEditorAction) => void;
}

interface ToolbarAction {
    action: MarkdownEditorAction;
    label: string;
    shortcut?: string;
    icon: ComponentType<{className?: string}>;
}

const toolbarGroups: ToolbarAction[][] = [
    [
        {action: "heading", label: "Add heading", icon: MdTitle},
        {action: "bold", label: "Add bold text", shortcut: "Ctrl+B", icon: MdFormatBold},
        {action: "italic", label: "Add italic text", shortcut: "Ctrl+I", icon: MdFormatItalic},
        {action: "quote", label: "Insert a quote", shortcut: "Ctrl+Shift+.", icon: MdFormatQuote},
        {action: "code", label: "Insert code", shortcut: "Ctrl+E", icon: MdCode},
        {action: "link", label: "Add a link", shortcut: "Ctrl+K", icon: MdLink},
    ],
    [
        {
            action: "unordered-list",
            label: "Add a bulleted list",
            shortcut: "Ctrl+Shift+8",
            icon: MdFormatListBulleted,
        },
        {
            action: "ordered-list",
            label: "Add a numbered list",
            shortcut: "Ctrl+Shift+7",
            icon: MdFormatListNumbered,
        },
        {action: "task-list", label: "Add a task list", icon: MdChecklist},
    ],
];

const wrapSelection = (
    value: string,
    selectionStart: number,
    selectionEnd: number,
    before: string,
    after: string,
    placeholder: string,
): MarkdownEdit => {
    const selectedText = value.slice(selectionStart, selectionEnd);
    const content = selectedText || placeholder;
    const nextValue = `${value.slice(0, selectionStart)}${before}${content}${after}${value.slice(selectionEnd)}`;
    const contentStart = selectionStart + before.length;

    return {
        value: nextValue,
        selectionStart: contentStart,
        selectionEnd: contentStart + content.length,
    };
};

const prefixSelectedLines = (
    value: string,
    selectionStart: number,
    selectionEnd: number,
    marker: (index: number) => string,
    placeholder: string,
): MarkdownEdit => {
    const lineStart = selectionStart === 0 ? 0 : value.lastIndexOf("\n", selectionStart - 1) + 1;
    const nextLineBreak = value.indexOf("\n", selectionEnd);
    const lineEnd = nextLineBreak === -1 ? value.length : nextLineBreak;
    const selectedLines = value.slice(lineStart, lineEnd);
    const content = selectedLines || placeholder;
    const transformed = content
        .split("\n")
        .map((line, index) => `${marker(index)}${line}`)
        .join("\n");
    const nextValue = `${value.slice(0, lineStart)}${transformed}${value.slice(lineEnd)}`;

    if (!selectedLines) {
        const prefixLength = marker(0).length;
        return {
            value: nextValue,
            selectionStart: lineStart + prefixLength,
            selectionEnd: lineStart + prefixLength + placeholder.length,
        };
    }

    return {
        value: nextValue,
        selectionStart: lineStart,
        selectionEnd: lineStart + transformed.length,
    };
};

export const createMarkdownEdit = (
    action: MarkdownEditorAction,
    value: string,
    selectionStart: number,
    selectionEnd: number,
): MarkdownEdit => {
    switch (action) {
        case "heading":
            return prefixSelectedLines(value, selectionStart, selectionEnd, () => "## ", "Heading");
        case "bold":
            return wrapSelection(value, selectionStart, selectionEnd, "**", "**", "bold text");
        case "italic":
            return wrapSelection(value, selectionStart, selectionEnd, "_", "_", "italic text");
        case "quote":
            return prefixSelectedLines(value, selectionStart, selectionEnd, () => "> ", "Quote");
        case "code": {
            const selectedText = value.slice(selectionStart, selectionEnd);
            return selectedText.includes("\n")
                ? wrapSelection(value, selectionStart, selectionEnd, "```\n", "\n```", "code")
                : wrapSelection(value, selectionStart, selectionEnd, "`", "`", "code");
        }
        case "link": {
            const selectedText = value.slice(selectionStart, selectionEnd);
            const linkText = selectedText || "link text";
            const insertedText = `[${linkText}](url)`;
            const nextValue = `${value.slice(0, selectionStart)}${insertedText}${value.slice(selectionEnd)}`;

            if (selectedText) {
                const urlStart = selectionStart + linkText.length + 3;
                return {
                    value: nextValue,
                    selectionStart: urlStart,
                    selectionEnd: urlStart + 3,
                };
            }

            return {
                value: nextValue,
                selectionStart: selectionStart + 1,
                selectionEnd: selectionStart + 1 + linkText.length,
            };
        }
        case "unordered-list":
            return prefixSelectedLines(value, selectionStart, selectionEnd, () => "- ", "List item");
        case "ordered-list":
            return prefixSelectedLines(value, selectionStart, selectionEnd, (index) => `${index + 1}. `, "List item");
        case "task-list":
            return prefixSelectedLines(value, selectionStart, selectionEnd, () => "- [ ] ", "Task");
    }
};

export const MarkdownEditorToolbar = ({onAction}: MarkdownEditorToolbarProps) => (
    <div
        role="toolbar"
        aria-label="Markdown formatting toolbar"
        className="ml-auto flex min-w-max items-center px-1"
    >
        {toolbarGroups.map((group, groupIndex) => (
            <div className="contents" key={groupIndex}>
                {groupIndex > 0 && (
                    <span
                        aria-hidden="true"
                        className="mx-1 h-5 w-px shrink-0 bg-tertiary-300 dark:bg-tertiary-700"
                    />
                )}
                {group.map(({action, label, shortcut, icon: Icon}) => (
                    <button
                        key={action}
                        type="button"
                        aria-label={label}
                        title={shortcut ? `${label} (${shortcut})` : label}
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-tertiary-500 transition-colors hover:bg-tertiary-200 hover:text-tertiary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-tertiary-400 dark:hover:bg-tertiary-700 dark:hover:text-tertiary-100"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => onAction(action)}
                    >
                        <Icon className="size-4"/>
                    </button>
                ))}
            </div>
        ))}
    </div>
);
