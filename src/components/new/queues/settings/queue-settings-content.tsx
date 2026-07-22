"use client";

import React, {
    type ChangeEvent,
    type KeyboardEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {FaCircleNotch} from "react-icons/fa6";
import {MdCheck, MdErrorOutline, MdSave} from "react-icons/md";
import type {Queue, QueuePatch, QueueVisibility} from "@/types/queue";
import {cn} from "@/lib/utils";
import {useQueuePatch, type QueuePatchStatus} from "@/hooks/use-queue-patch";
import SelectQueueVisibility from "@/components/new/queues/visibility/select-queue-visibility";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import {QueueDescriptionMarkdown} from "@/components/new/queues/description/queue-description-markdown";
import {
    createMarkdownEdit,
    MarkdownEditorToolbar,
    type MarkdownEditorAction,
} from "@/components/new/queues/settings/markdown-editor-toolbar";

const AUTOSAVE_DELAY_MS = 1000;
const preserveText = (value: string) => value;
const acceptText = () => null;

interface QueueSettingsContentProps {
    queue: Queue;
}

export const QueueSettingsContent = ({queue}: QueueSettingsContentProps) => (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pt-6">
        <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Queue settings</h1>
            <p className="text-sm text-tertiary-500">
                Most changes are saved automatically. Description changes must be saved manually.
            </p>
        </header>

        <SettingsSection
            title="General"
            description="Update how this queue is presented to users."
        >
            <QueueNameSetting queue={queue}/>
            <QueueDescriptionSetting queue={queue}/>
        </SettingsSection>

        <SettingsSection
            title="Access and availability"
            description="Control who can discover the queue and whether it accepts requests."
        >
            <QueueVisibilitySetting queue={queue}/>
            <QueueAvailabilitySetting queue={queue}/>
        </SettingsSection>
    </div>
);

interface SettingsSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const SettingsSection = ({title, description, children}: SettingsSectionProps) => (
    <section className="flex flex-col gap-6 rounded-xl bg-tertiary-50 px-6 py-5 dark:bg-tertiary-900">
        <header className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-tertiary-500">{description}</p>
        </header>
        {children}
    </section>
);

interface SettingFieldProps {
    label: string;
    description: string;
    labelId: string;
    descriptionId: string;
    controlId?: string;
    status?: React.ReactNode;
    children: React.ReactNode;
}

const SettingField = ({
    label,
    description,
    labelId,
    descriptionId,
    controlId,
    status,
    children,
}: SettingFieldProps) => (
    <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <div>
                {controlId ? (
                    <label className="font-semibold" htmlFor={controlId} id={labelId}>
                        {label}
                    </label>
                ) : (
                    <div className="font-semibold" id={labelId}>{label}</div>
                )}
                <p className="text-sm text-tertiary-500" id={descriptionId}>{description}</p>
            </div>
            {status}
        </div>
        {children}
    </div>
);

interface AutosavedTextSettingOptions {
    queueId: number;
    initialValue: string;
    createPatch: (value: string) => QueuePatch;
    normalize?: (value: string) => string;
    validate?: (value: string) => string | null;
    autosave?: boolean;
    errorMessage: string;
}

const useAutosavedTextSetting = ({
    queueId,
    initialValue,
    createPatch,
    normalize = preserveText,
    validate = acceptText,
    autosave = true,
    errorMessage,
}: AutosavedTextSettingOptions) => {
    const [value, setValue] = useState(initialValue);
    const [savedValue, setSavedValue] = useState(normalize(initialValue));
    const [validationError, setValidationError] = useState<string | null>(null);

    const valueRef = useRef(value);
    const savedValueRef = useRef(savedValue);
    const revisionRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const saveChainRef = useRef<Promise<void>>(Promise.resolve());

    const {
        submit,
        status,
        errorMessage: patchError,
        isPending,
        resetStatus,
    } = useQueuePatch(queueId, {errorMessage});

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const saveLatest = useCallback(() => {
        clearTimer();

        saveChainRef.current = saveChainRef.current.then(async () => {
            while (true) {
                const normalizedValue = normalize(valueRef.current);
                const nextValidationError = validate(normalizedValue);

                setValidationError(nextValidationError);

                if (nextValidationError || normalizedValue === savedValueRef.current) {
                    return;
                }

                const submittedRevision = revisionRef.current;
                const result = await submit(createPatch(normalizedValue));

                if (!result.ok) {
                    return;
                }

                savedValueRef.current = normalizedValue;
                setSavedValue(normalizedValue);

                if (!autosave && revisionRef.current !== submittedRevision) {
                    return;
                }

                if (revisionRef.current === submittedRevision) {
                    if (valueRef.current !== normalizedValue) {
                        valueRef.current = normalizedValue;
                        setValue(normalizedValue);
                    }

                    return;
                }
            }
        });

        return saveChainRef.current;
    }, [autosave, clearTimer, createPatch, normalize, submit, validate]);

    const scheduleSave = useCallback((nextValue: string) => {
        valueRef.current = nextValue;
        setValue(nextValue);
        revisionRef.current += 1;
        resetStatus();
        clearTimer();

        const normalizedValue = normalize(nextValue);
        const nextValidationError = validate(normalizedValue);
        setValidationError(nextValidationError);

        if (autosave && !nextValidationError && normalizedValue !== savedValueRef.current) {
            timerRef.current = setTimeout(() => {
                void saveLatest();
            }, AUTOSAVE_DELAY_MS);
        }
    }, [autosave, clearTimer, normalize, resetStatus, saveLatest, validate]);

    useEffect(() => {
        const normalizedInitialValue = normalize(initialValue);
        const hasLocalDraft = normalize(valueRef.current) !== savedValueRef.current;

        savedValueRef.current = normalizedInitialValue;
        setSavedValue(normalizedInitialValue);

        if (!hasLocalDraft) {
            valueRef.current = initialValue;
            setValue(initialValue);
            setValidationError(null);
            clearTimer();
        }
    }, [clearTimer, initialValue, normalize]);

    useEffect(() => clearTimer, [clearTimer]);

    const dirty = normalize(value) !== savedValue;
    const visibleStatus: QueuePatchStatus = validationError
        ? "error"
        : isPending
            ? "saving"
            : dirty && status !== "error"
                ? "idle"
                : status;

    return {
        value,
        setValue: scheduleSave,
        saveLatest,
        dirty,
        isPending,
        status: visibleStatus,
        errorMessage: validationError ?? patchError,
    };
};

const QueueNameSetting = ({queue}: {queue: Queue}) => {
    const createPatch = useCallback((name: string): QueuePatch => ({name}), []);
    const normalize = useCallback((name: string) => name.trim(), []);
    const validate = useCallback(
        (name: string) => name.length === 0 ? "Queue name cannot be empty." : null,
        [],
    );
    const name = useAutosavedTextSetting({
        queueId: queue.id,
        initialValue: queue.name,
        createPatch,
        normalize,
        validate,
        autosave: false,
        errorMessage: "Failed to update queue name.",
    });

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
        }
    };

    return (
        <SettingField
            label="Queue name"
            description="A short name users can recognize."
            labelId="queue-name-label"
            descriptionId="queue-name-description"
            controlId="queue-name"
            status={<QueueSettingStatus status={name.status} errorMessage={name.errorMessage}/>}
        >
            <input
                id="queue-name"
                value={name.value}
                onChange={(event: ChangeEvent<HTMLInputElement>) => name.setValue(event.target.value)}
                onBlur={() => void name.saveLatest()}
                onKeyDown={handleKeyDown}
                aria-describedby="queue-name-description"
                aria-invalid={name.status === "error"}
                className={settingsInputClassName}
            />
        </SettingField>
    );
};

const QueueDescriptionSetting = ({queue}: {queue: Queue}) => {
    const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const createPatch = useCallback((description: string): QueuePatch => ({description}), []);
    const description = useAutosavedTextSetting({
        queueId: queue.id,
        initialValue: queue.description ?? "",
        createPatch,
        autosave: false,
        errorMessage: "Failed to update queue description.",
    });
    const selectTab = (tab: "write" | "preview") => {
        setActiveTab(tab);

        requestAnimationFrame(() => {
            document.getElementById(`queue-description-${tab}-tab`)?.focus();
        });
    };
    const applyMarkdownAction = (action: MarkdownEditorAction) => {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        const edit = createMarkdownEdit(
            action,
            textarea.value,
            textarea.selectionStart,
            textarea.selectionEnd,
        );

        description.setValue(edit.value);
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(edit.selectionStart, edit.selectionEnd);
        });
    };
    const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (!event.ctrlKey && !event.metaKey) {
            return;
        }

        let action: MarkdownEditorAction | null = null;

        if (!event.shiftKey) {
            action = {
                b: "bold",
                e: "code",
                i: "italic",
                k: "link",
            }[event.key.toLowerCase()] as MarkdownEditorAction | undefined ?? null;
        } else if (event.code === "Digit7") {
            action = "ordered-list";
        } else if (event.code === "Digit8") {
            action = "unordered-list";
        } else if (event.code === "Period") {
            action = "quote";
        }

        if (action) {
            event.preventDefault();
            applyMarkdownAction(action);
        }
    };

    return (
        <SettingField
            label="Description"
            description="Keep it short and precise. GitHub-flavored Markdown is supported; images and raw HTML are not displayed."
            labelId="queue-description-label"
            descriptionId="queue-description-help"
            controlId="queue-description"
            status={(
                <QueueSettingStatus
                    status={description.status}
                    errorMessage={description.errorMessage}
                />
            )}
        >
            <div className="overflow-hidden rounded-lg border border-tertiary-300 transition-colors focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 dark:border-tertiary-700">
                <div
                    className="flex items-center overflow-x-auto border-b border-tertiary-300 bg-tertiary-100 px-2 dark:border-tertiary-700 dark:bg-tertiary-850"
                >
                    <div role="tablist" aria-label="Queue description editor" className="flex shrink-0">
                        <EditorTab
                            id="queue-description-write-tab"
                            controls="queue-description-write-panel"
                            selected={activeTab === "write"}
                            onSelect={() => setActiveTab("write")}
                            onNavigate={() => selectTab("preview")}
                        >
                            Write
                        </EditorTab>
                        <EditorTab
                            id="queue-description-preview-tab"
                            controls="queue-description-preview-panel"
                            selected={activeTab === "preview"}
                            onSelect={() => setActiveTab("preview")}
                            onNavigate={() => selectTab("write")}
                        >
                            Preview
                        </EditorTab>
                    </div>
                    {activeTab === "write" && <MarkdownEditorToolbar onAction={applyMarkdownAction}/>}
                </div>

                {activeTab === "write" ? (
                    <div
                        id="queue-description-write-panel"
                        role="tabpanel"
                        aria-labelledby="queue-description-write-tab"
                    >
                        <textarea
                            ref={textareaRef}
                            id="queue-description"
                            value={description.value}
                            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => (
                                description.setValue(event.target.value)
                            )}
                            onKeyDown={handleEditorKeyDown}
                            rows={8}
                            placeholder="Describe this queue…"
                            aria-describedby="queue-description-help"
                            className="min-h-44 w-full resize-y bg-white px-3 pt-3 pb-0 text-sm outline-hidden placeholder:text-tertiary-400 dark:bg-tertiary-900"
                        />
                    </div>
                ) : (
                    <div
                        id="queue-description-preview-panel"
                        role="tabpanel"
                        aria-labelledby="queue-description-preview-tab"
                        className="min-h-44 bg-white p-4 dark:bg-tertiary-900"
                    >
                        {description.value ? (
                            <QueueDescriptionMarkdown description={description.value}/>
                        ) : (
                            <p className="text-sm text-tertiary-500">Nothing to preview.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="flex justify-end">
                <Button
                    type="button"
                    rounded="lg"
                    disabled={!description.dirty || description.isPending}
                    onClick={() => void description.saveLatest()}
                >
                    {description.isPending ? (
                        <FaCircleNotch className="size-4 animate-spin" aria-hidden="true"/>
                    ) : (
                        <MdSave className="size-4" aria-hidden="true"/>
                    )}
                    {description.isPending ? "Saving..." : "Save"}
                </Button>
            </div>
        </SettingField>
    );
};

interface EditorTabProps {
    id: string;
    controls: string;
    selected: boolean;
    onSelect: () => void;
    onNavigate: () => void;
    children: React.ReactNode;
}

const EditorTab = ({
    id,
    controls,
    selected,
    onSelect,
    onNavigate,
    children,
}: EditorTabProps) => (
    <button
        id={id}
        type="button"
        role="tab"
        aria-controls={controls}
        aria-selected={selected}
        tabIndex={selected ? 0 : -1}
        onClick={onSelect}
        onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                onNavigate();
            }
        }}
        className={cn(
            "relative h-10 px-3 text-sm font-semibold transition-colors",
            selected ? "text-primary-500" : "text-tertiary-500 hover:text-tertiary-700",
        )}
    >
        {children}
        <span
            aria-hidden="true"
            className={cn(
                "absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary-500 transition-transform",
                selected ? "scale-x-100" : "scale-x-0",
            )}
        />
    </button>
);

const QueueVisibilitySetting = ({queue}: {queue: Queue}) => {
    const [visibility, setVisibility] = useState(queue.visibility);
    const {
        submit,
        status,
        errorMessage,
        isPending,
    } = useQueuePatch(queue.id, {errorMessage: "Failed to update queue visibility."});

    useEffect(() => {
        setVisibility(queue.visibility);
    }, [queue.visibility]);

    const handleSelect = async (nextVisibility: QueueVisibility) => {
        const previousVisibility = visibility;
        setVisibility(nextVisibility);

        const result = await submit({visibility: nextVisibility});

        if (!result.ok) {
            setVisibility(previousVisibility);
        }
    };

    return (
        <SettingField
            label="Visibility"
            description="Choose who can discover and open this queue."
            labelId="queue-visibility-label"
            descriptionId="queue-visibility-description"
            status={<QueueSettingStatus status={status} errorMessage={errorMessage}/>}
        >
            <SelectQueueVisibility
                visibility={visibility}
                disabled={isPending}
                isPending={isPending}
                ariaLabelledBy="queue-visibility-label"
                ariaDescribedBy="queue-visibility-description"
                onSelect={(nextVisibility) => void handleSelect(nextVisibility)}
            />
        </SettingField>
    );
};

const QueueAvailabilitySetting = ({queue}: {queue: Queue}) => {
    const [isOpen, setIsOpen] = useState(queue.is_open);
    const {
        submit,
        status,
        errorMessage,
        isPending,
    } = useQueuePatch(queue.id, {errorMessage: "Failed to update queue availability."});

    useEffect(() => {
        setIsOpen(queue.is_open);
    }, [queue.is_open]);

    const handleCheckedChange = async (checked: boolean) => {
        const previousValue = isOpen;
        setIsOpen(checked);

        const result = await submit({is_open: checked});

        if (!result.ok) {
            setIsOpen(previousValue);
        }
    };

    return (
        <SettingField
            label="Accepting requests"
            description="When disabled, users cannot submit new requests to this queue."
            labelId="queue-availability-label"
            descriptionId="queue-availability-description"
            status={<QueueSettingStatus status={status} errorMessage={errorMessage}/>}
        >
            <label className="flex w-fit items-center gap-3 text-sm font-semibold">
                <Switch
                    checked={isOpen}
                    disabled={isPending}
                    onCheckedChange={(checked) => void handleCheckedChange(checked)}
                    aria-labelledby="queue-availability-label"
                    aria-describedby="queue-availability-description"
                />
                {isOpen ? "Open" : "Closed"}
            </label>
        </SettingField>
    );
};

interface QueueSettingStatusProps {
    status: QueuePatchStatus;
    errorMessage?: string;
}

const QueueSettingStatus = ({status, errorMessage}: QueueSettingStatusProps) => {
    if (status === "idle") {
        return null;
    }

    if (status === "saving") {
        return (
            <span className="flex items-center gap-1.5 text-xs text-tertiary-500" role="status">
                <FaCircleNotch className="size-3.5 animate-spin" aria-hidden="true"/>
                Saving…
            </span>
        );
    }

    if (status === "error") {
        return (
            <span className="flex items-center gap-1.5 text-xs text-red-500" role="alert">
                <MdErrorOutline className="size-4" aria-hidden="true"/>
                {errorMessage || "Could not save changes."}
            </span>
        );
    }

    return (
        <span className="flex items-center gap-1.5 text-xs text-green-600" role="status">
            <MdCheck className="size-4" aria-hidden="true"/>
            Saved
        </span>
    );
};

const settingsInputClassName = cn(
    "w-full rounded-lg border border-tertiary-300 bg-white px-3 py-2 text-sm",
    "outline-hidden transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
    "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
    "dark:border-tertiary-700 dark:bg-tertiary-900",
);
