import type {FC} from "react";
import ReactMarkdown, {type Components, defaultUrlTransform} from "react-markdown";
import remarkGfm from "remark-gfm";
import {cn} from "@/lib/utils";

interface QueueDescriptionProps {
    description: string;
    className?: string;
}

const isExternalLink = (href: string | undefined) => (
    href ? /^(?:https?:)?\/\//i.test(href) : false
);

const transformQueueDescriptionUrl = (url: string): string => {
    const transformedUrl = defaultUrlTransform(url);

    if (!transformedUrl || transformedUrl.startsWith("//")) {
        return "";
    }

    const protocol = transformedUrl.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();

    return !protocol || protocol === "http" || protocol === "https" || protocol === "mailto"
        ? transformedUrl
        : "";
};

const fullComponents: Components = {
    h1: ({children}) => <h2 className="mb-2 mt-5 text-xl font-semibold first:mt-0">{children}</h2>,
    h2: ({children}) => <h3 className="mb-2 mt-5 text-lg font-semibold first:mt-0">{children}</h3>,
    h3: ({children}) => <h4 className="mb-2 mt-4 font-semibold first:mt-0">{children}</h4>,
    h4: ({children}) => <h5 className="mb-2 mt-4 font-semibold first:mt-0">{children}</h5>,
    h5: ({children}) => <h6 className="mb-2 mt-4 font-semibold first:mt-0">{children}</h6>,
    h6: ({children}) => <h6 className="mb-2 mt-4 text-sm font-semibold first:mt-0">{children}</h6>,
    p: ({children}) => <p className="mb-3 leading-6 last:mb-0">{children}</p>,
    a: ({children, href}) => href ? (
        <a
            className="font-medium text-primary-500 underline decoration-primary-500/40 underline-offset-2 hover:text-primary-400"
            href={href}
            rel={isExternalLink(href) ? "noopener noreferrer" : undefined}
            target={isExternalLink(href) ? "_blank" : undefined}
        >
            {children}
        </a>
    ) : <span>{children}</span>,
    ul: ({children}) => <ul className="my-3 list-disc space-y-1 pl-6">{children}</ul>,
    ol: ({children}) => <ol className="my-3 list-decimal space-y-1 pl-6">{children}</ol>,
    li: ({children}) => <li className="pl-1">{children}</li>,
    blockquote: ({children}) => (
        <blockquote className="my-3 border-l-4 border-tertiary-300 pl-4 text-tertiary-600 dark:border-tertiary-700 dark:text-tertiary-300">
            {children}
        </blockquote>
    ),
    code: ({children}) => (
        <code className="rounded bg-tertiary-100 px-1 py-0.5 text-[0.875em] dark:bg-tertiary-800">
            {children}
        </code>
    ),
    pre: ({children}) => (
        <pre className="my-3 overflow-x-auto rounded-lg bg-tertiary-100 p-3 text-sm dark:bg-tertiary-800 [&>code]:bg-transparent [&>code]:p-0">
            {children}
        </pre>
    ),
    table: ({children}) => (
        <table className="my-3 block max-w-full overflow-x-auto border-collapse text-sm">
            {children}
        </table>
    ),
    th: ({children}) => (
        <th className="border border-tertiary-300 bg-tertiary-100 px-3 py-2 text-left font-semibold dark:border-tertiary-700 dark:bg-tertiary-800">
            {children}
        </th>
    ),
    td: ({children}) => (
        <td className="border border-tertiary-300 px-3 py-2 dark:border-tertiary-700">
            {children}
        </td>
    ),
    hr: () => <hr className="my-5 border-tertiary-300 dark:border-tertiary-700"/>,
    input: ({checked, type}) => (
        <input
            checked={checked}
            className="mr-2 accent-primary-500"
            disabled
            readOnly
            type={type}
        />
    ),
    img: () => null,
};

const compactComponents: Components = {
    h1: ({children}) => <>{children} </>,
    h2: ({children}) => <>{children} </>,
    h3: ({children}) => <>{children} </>,
    h4: ({children}) => <>{children} </>,
    h5: ({children}) => <>{children} </>,
    h6: ({children}) => <>{children} </>,
    p: ({children}) => <>{children} </>,
    a: ({children}) => <span>{children}</span>,
    ul: ({children}) => <>{children}</>,
    ol: ({children}) => <>{children}</>,
    li: ({children}) => <>{children} {"\u00b7"} </>,
    blockquote: ({children}) => <>{children} </>,
    pre: ({children}) => <>{children} </>,
    table: ({children}) => <>{children} </>,
    thead: ({children}) => <>{children}</>,
    tbody: ({children}) => <>{children}</>,
    tr: ({children}) => <>{children} </>,
    th: ({children}) => <>{children} </>,
    td: ({children}) => <>{children} </>,
    br: () => <span> </span>,
    hr: () => <span aria-hidden="true"> {"\u2014"} </span>,
    input: () => null,
    img: () => null,
};

export const QueueDescriptionMarkdown: FC<QueueDescriptionProps> = ({
    description,
    className,
}) => (
    <div className={cn("text-sm text-tertiary-600 dark:text-tertiary-300", className)}>
        <ReactMarkdown
            components={fullComponents}
            remarkPlugins={[remarkGfm]}
            skipHtml
            urlTransform={transformQueueDescriptionUrl}
        >
            {description}
        </ReactMarkdown>
    </div>
);

export const CompactQueueDescription: FC<QueueDescriptionProps> = ({
    description,
    className,
}) => (
    <div
        className={cn(
            "line-clamp-2 overflow-hidden text-ellipsis text-sm leading-5 text-tertiary-500 dark:text-tertiary-400",
            className,
        )}
    >
        <ReactMarkdown
            components={compactComponents}
            remarkPlugins={[remarkGfm]}
            skipHtml
            urlTransform={transformQueueDescriptionUrl}
        >
            {description}
        </ReactMarkdown>
    </div>
);
