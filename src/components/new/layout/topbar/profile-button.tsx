"use client";

import {useAuth} from "@/context/auth-context";
import {useBeatmapPreview} from "@/context/preview-context";
import Image from "next/image";
import {Popover} from "radix-ui";
import * as Slider from "@radix-ui/react-slider";
import {MdLogout, MdPerson, MdVolumeUp} from "react-icons/md";

const ProfileButton = () => {
    const {logout, user} = useAuth();
    const {setVolume, volume} = useBeatmapPreview();
    const avatarUrl = user?.profile?.avatar_url;
    const username = user?.profile?.username;
    const volumePercentage = Math.round(volume * 100);

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    aria-label={username ? `Open profile menu for ${username}` : "Open profile menu"}
                    title="Profile Options"
                    className="h-14 w-14 items-center gap-2 rounded-full shrink-0 hidden sm:flex justify-center transition-all duration-300 ease-in-out overflow-hidden bg-tertiary-200 text-tertiary-600 hover:ring-2 hover:ring-tertiary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-tertiary-800 dark:text-tertiary-300 dark:hover:ring-tertiary-700"
                >
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt=""
                            width={56}
                            height={56}
                            className="size-full object-cover"
                        />
                    ) : (
                        <MdPerson className="size-7"/>
                    )}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    aria-label="Profile options"
                    align="end"
                    sideOffset={16}
                    collisionPadding={16}
                    className="z-70 w-[196px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-tertiary-200 bg-white text-tertiary-700 shadow-xl outline-none dark:border-tertiary-700 dark:bg-tertiary-850 dark:text-tertiary-300"
                >
                    <section className="border-b border-tertiary-200 p-3 dark:border-tertiary-700">
                        <h2 className="mb-1.5 font-semibold tracking-wide text-tertiary-600 dark:text-tertiary-300">
                            General
                        </h2>
                        <button
                            type="button"
                            onClick={logout}
                            className="flex w-full items-center gap-1.5 rounded-lg p-1.5 text-left text-sm transition-colors hover:bg-tertiary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-tertiary-700"
                        >
                            <MdLogout className="size-4 shrink-0"/>
                            Log Out
                        </button>
                    </section>

                    <section className="p-3">
                        <h2 className="mb-1.5 font-semibold tracking-wide text-tertiary-600 dark:text-tertiary-300">
                            Preferences
                        </h2>
                        <div className="flex items-center gap-1.5 px-1 py-1 text-sm">
                            <MdVolumeUp className="size-4 shrink-0"/>
                            Preview Volume
                        </div>
                        <div className="flex items-center gap-2 py-1 text-sm">
                            <output
                                htmlFor="profile-preview-volume"
                                className="w-10 shrink-0 text-center tabular-nums"
                            >
                                {volumePercentage}%
                            </output>
                            <Slider.Root
                                id="profile-preview-volume"
                                min={0}
                                max={1}
                                step={0.01}
                                value={[volume]}
                                onValueChange={(values) => setVolume(values[0])}
                                className="relative flex h-6 min-w-0 grow touch-none select-none items-center"
                            >
                                <Slider.Track className="relative h-1 grow rounded-full bg-tertiary-300 dark:bg-tertiary-700">
                                    <Slider.Range className="absolute h-full rounded-full bg-primary-500"/>
                                </Slider.Track>
                                <Slider.Thumb
                                    aria-label="Preview volume"
                                    className="block size-4 rounded-full bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2"
                                />
                            </Slider.Root>
                        </div>
                    </section>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

export default ProfileButton;
