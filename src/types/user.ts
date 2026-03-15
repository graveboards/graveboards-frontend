import {GameMode} from "@/types/beatmapset";

interface UserRole {
    id: number;
    name: string;
}

export interface User {
    id?: number;
    profile?: UserProfile;
    roles?: UserRole[];
}

export interface UserProfile {
    id?: number;
    user_id?: number;
    updated_at?: string;
    is_restricted?: boolean;
    account_history?: {
        id?: number;
        timestamp?: string;
        length?: number;
        permanent?: boolean;
        type?: ("note" | "restriction" | "silence");
        description?: string | null;
    }[];
    active_tournament_banners?: {
        id?: number;
        tournament_id?: number;
        image?: string | null;
        "image@2x"?: string | null;
    }[];
    avatar_url?: string;
    badges?: {
        awarded_at?: string;
        description?: string;
        "image@2x_url"?: string | null;
        image_url?: string;
        url?: string;
    }[];
    beatmap_playcounts_count?: number;
    comments_count?: number;
    country_code?: string;
    country?: { code?: string; name?: string; };
    cover?: { custom_url?: string | null; url?: string | null; id?: number | null; };
    daily_challenge_user_stats?: {
        daily_streak_best?: number;
        daily_streak_current?: number;
        last_update?: string;
        last_weekly_streak?: string;
        playcount?: number;
        top_10p_placements?: number;
        top_50p_placements?: number;
        user_id?: number;
        weekly_streak_best?: number;
        weekly_streak_current?: number;
    };
    default_group?: string | null;
    discord?: string | null;
    favourite_beatmapset_count?: number;
    follower_count?: number;
    graveyard_beatmapset_count?: number;
    groups?: {
        colour?: string | null;
        has_listing?: boolean;
        has_playmodes?: boolean;
        id?: number;
        identifier?: string;
        is_probationary?: boolean;
        name?: string;
        short_name?: string;
        playmodes?: GameMode[] | null;
    }[];
    guest_beatmapset_count?: number;
    has_supported?: boolean;
    interests?: string | null;
    is_active?: boolean;
    is_bot?: boolean;
    is_deleted?: boolean;
    is_online?: boolean;
    is_supporter?: boolean;
    join_date?: string;
    kudosu?: { available?: number; total?: number; };
    location?: string | null;
    last_visit?: string | null;
    loved_beatmapset_count?: number;
    mapping_follower_count?: number;
    matchmaking_stats?: {
        first_placements?: number;
        is_rating_provisional?: boolean;
        plays?: number;
        pool_id?: number;
        rank?: number;
        rating?: number;
        total_points?: number;
        user_id?: number;
        pool?: {
            active?: boolean;
            id?: number;
            name?: string;
            ruleset_id?: number;
            variant_id?: number;
        };
    }[];
    max_blocks?: number;
    max_friends?: number;
    monthly_playcounts?: { start_date?: string; count?: number; }[];
    nominated_beatmapset_count?: number;
    occupation?: string | null;
    page?: { html?: string; raw?: string; };
    pending_beatmapset_count?: number;
    playmode?: GameMode;
    playstyle?: ("mouse" | "keyboard" | "tablet" | "touch")[];
    pm_friends_only?: boolean;
    post_count?: number;
    previous_usernames?: string[];
    profile_colour?: string | null;
    profile_hue?: number | null;
    profile_order?: ("me" | "recent_activity" | "beatmaps" | "historical" | "kudosu" | "top_ranks" | "medals")[];
    rank_highest?: { rank?: number; updated_at?: string; };
    rank_history?: { mode?: GameMode; data?: number[]; };
    ranked_and_approved_beatmapset_count?: number;
    ranked_beatmapset_count?: number;
    replays_watched_counts?: { start_date?: string; count?: number; }[];
    scores_best_count?: number;
    scores_first_count?: number;
    scores_pinned_count?: number;
    scores_recent_count?: number;
    statistics?: {
        count_100?: number;
        count_300?: number;
        count_50?: number;
        count_miss?: number;
        level?: { current?: number; progress?: number; };
        global_rank?: number | null;
        global_rank_percent?: number | null;
        global_rank_exp?: number | null;
        pp?: number;
        pp_exp?: number;
        ranked_score?: number;
        hit_accuracy?: number;
        play_count?: number;
        play_time?: number;
        total_score?: number;
        total_hits?: number;
        maximum_combo?: number;
        replays_watched_by_others?: number;
        is_ranked?: boolean;
        grade_counts?: {
            ss?: number;
            ssh?: number;
            s?: number;
            sh?: number;
            a?: number;
        };
        country_rank?: number | null;
        rank?: { country?: number | null; };
    };
    support_level?: number;
    team?: { flag_url?: string | null; id?: number; name?: string; short_name?: string; };
    title?: string | null;
    title_url?: string | null;
    twitter?: string | null;
    user_achievements?: { achieved_at?: string; achievement_id?: number; }[];
    username?: string;
    website?: string | null;
}