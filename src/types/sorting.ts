//noinspection JSUnusedGlobalSymbols

export enum Order {
    Ascending = "asc",
    Descending = "desc"
}

type Sorting<T> = { field: T; order?: Order; isDefault?: boolean};

export enum UserSortingEnum {
    ID = "User.id"
}

export enum ProfileSortingEnum {
    ID = "Profile.id",
    AvatarURL = "Profile.avatar_url",
    Username = "Profile.username",
    CountryCode = "Profile.country_code",
    GraveyardBeatmapsetCount = "Profile.graveyard_beatmapset_count",
    LovedBeatmapsetCount = "Profile.loved_beatmapset_count",
    PendingBeatmapsetCount = "Profile.pending_beatmapset_count",
    RankedBeatmapsetCount = "Profile.ranked_beatmapset_count",
    IsRestricted = "Profile.is_restricted",
    TotalMaps = "Profile.total_maps",
    TotalKudosu = "Profile.total_kudosu",
}

export enum BeatmapSortingEnum {
    ID = "Beatmap.id",
    BeatmapsetID = "Beatmap.beatmapset_id"
}

export enum BeatmapsetSortingEnum {
    ID = "Beatmapset.id",
    UserID = "Beatmapset.user_id"
}

export enum BeatmapsetSnapshotSortingEnum {
    ID = "BeatmapsetSnapshot.id",
    BeatmapsetID = "BeatmapsetSnapshot.beatmapset_id",
    UserID = "BeatmapsetSnapshot.user_id",
    Artist = "BeatmapsetSnapshot.artist",
    ArtistUnicode = "BeatmapsetSnapshot.artist_unicode",
    BPM = "BeatmapsetSnapshot.bpm",
    CanBeHyped = "BeatmapsetSnapshot.can_be_hyped",
    Creator = "BeatmapsetSnapshot.creator",
    DeletedAt = "BeatmapsetSnapshot.deleted_at",
    DiscussionEnabled = "BeatmapsetSnapshot.discussion_enabled",
    DiscussionLocked = "BeatmapsetSnapshot.discussion_locked",
    FavouriteCount = "BeatmapsetSnapshot.favourite_count",
    IsScoreable = "BeatmapsetSnapshot.is_scoreable",
    LastUpdated = "BeatmapsetSnapshot.last_updated",
    LegacyThreadUrl = "BeatmapsetSnapshot.legacy_thread_url",
    NSFW = "BeatmapsetSnapshot.nsfw",
    Offset = "BeatmapsetSnapshot.offset",
    PlayCount = "BeatmapsetSnapshot.play_count",
    PreviewUrl = "BeatmapsetSnapshot.preview_url",
    Ranked = "BeatmapsetSnapshot.ranked",
    Rating = "BeatmapsetSnapshot.rating",
    Source = "BeatmapsetSnapshot.source",
    Spotlight = "BeatmapsetSnapshot.spotlight",
    Status = "BeatmapsetSnapshot.status",
    SubmittedDate = "BeatmapsetSnapshot.submitted_date",
    Tags = "BeatmapsetSnapshot.tags",
    Title = "BeatmapsetSnapshot.title",
    TitleUnicode = "BeatmapsetSnapshot.title_unicode",
    TrackID = "BeatmapsetSnapshot.track_id",
    Video = "BeatmapsetSnapshot.video",
    AvailabilityDownloadDisabled = "BeatmapsetSnapshot.availability_download_disabled",
    AvailabilityMoreInformation = "BeatmapsetSnapshot.availability_more_information",
    Description = "BeatmapsetSnapshot.description",
    GenreID = "BeatmapsetSnapshot.genre_id",
    GenreName = "BeatmapsetSnapshot.genre_name",
    HypeCurrent = "BeatmapsetSnapshot.hype_current",
    HypeRequired = "BeatmapsetSnapshot.hype_required",
    LanguageID = "BeatmapsetSnapshot.language_id",
    LanguageName = "BeatmapsetSnapshot.language_name",
    NominationsSummaryCurrent = "BeatmapsetSnapshot.nominations_summary_current",
    NominationsSummaryRequiredMetaMainRuleset = "BeatmapsetSnapshot.nominations_summary_required_meta_main_ruleset",
    NominationsSummaryRequiredMetaNonMainRuleset = "BeatmapsetSnapshot.nominations_summary_required_meta_non_main_ruleset",
    NumDifficulties = "BeatmapsetSnapshot.num_difficulties",
    SRGapsMin = "BeatmapsetSnapshot.sr_gaps_min",
    SRGapsMax = "BeatmapsetSnapshot.sr_gaps_max",
    SRGapsAvg = "BeatmapsetSnapshot.sr_gaps_avg",
    HitLengthsMin = "BeatmapsetSnapshot.hit_lengths_min",
    HitLengthsMax = "BeatmapsetSnapshot.hit_lengths_max",
    HitLengthsAvg = "BeatmapsetSnapshot.hit_lengths_avg"
}

export enum BeatmapSnapshotSortingEnum {
    ID = "BeatmapSnapshot.id",
    BeatmapID = "BeatmapSnapshot.beatmap_id",
    UserID = "BeatmapSnapshot.user_id",
    Accuracy = "BeatmapSnapshot.accuracy",
    AR = "BeatmapSnapshot.ar",
    BPM = "BeatmapSnapshot.bpm",
    Checksum = "BeatmapSnapshot.checksum",
    CircleCount = "BeatmapSnapshot.count_circles",
    SliderCount = "BeatmapSnapshot.count_sliders",
    SpinnerCount = "BeatmapSnapshot.count_spinners",
    CS = "BeatmapSnapshot.cs",
    DeletedAt = "BeatmapSnapshot.deleted_at",
    DifficultyRating = "BeatmapSnapshot.difficulty_rating",
    Drain = "BeatmapSnapshot.drain",
    HitLength = "BeatmapSnapshot.hit_length",
    IsScoreable = "BeatmapSnapshot.is_scoreable",
    LastUpdated = "BeatmapSnapshot.last_updated",
    MaxCombo = "BeatmapSnapshot.max_combo",
    Mode = "BeatmapSnapshot.mode",
    ModeInt = "BeatmapSnapshot.mode_int",
    PassCount = "BeatmapSnapshot.passcount",
    PlayCount = "BeatmapSnapshot.playcount",
    Ranked = "BeatmapSnapshot.ranked",
    Status = "BeatmapSnapshot.status",
    TotalLength = "BeatmapSnapshot.total_length",
    URL = "BeatmapSnapshot.url",
    Version = "BeatmapSnapshot.version"
}

export enum BeatmapTagSortingEnum {
    ID = "BeatmapTag.id",
    Name = "BeatmapTag.name",
    RulesetID = "BeatmapTag.ruleset_id",
    Description = "BeatmapTag.description",
    CreatedAt = "BeatmapTag.created_at",
    UpdatedAt = "BeatmapTag.updated_at"
}

export enum BeatmapsetTagSortingEnum {
    ID = "BeatmapsetTag.id",
    Name = "BeatmapsetTag.name"
}

export enum ScoreSortingEnum {
    ID = "Score.id"
}

export enum QueueSortingEnum {
    ID = "Queue.id",
    UserID = "Queue.user_id",
    Name = "Queue.name",
    Description = "Queue.description",
    CreatedAt = "Queue.created_at",
    UpdatedAt = "Queue.updated_at",
    IsOpen = "Queue.is_open",
    Visibility = "Queue.visibility"
}

export enum RequestSortingEnum {
    ID = "Request.id",
    UserID = "Request.user_id",
    BeatmapsetID = "Request.beatmapset_id",
    QueueID = "Request.queue_id",
    Comment = "Request.comment",
    MVChecked = "Request.mv_checked",
    CreatedAt = "Request.created_at",
    UpdatedAt = "Request.updated_at",
    Status = "Request.status"
}

export type SearchSorting = Sorting<ProfileSortingEnum | BeatmapSnapshotSortingEnum | BeatmapsetSnapshotSortingEnum | QueueSortingEnum | RequestSortingEnum>[];
export type UserSorting = Sorting<UserSortingEnum>[];
export type BeatmapsetSnapshotSorting = Sorting<BeatmapsetSnapshotSortingEnum>[];
export type BeatmapsetSorting = Sorting<BeatmapsetSortingEnum>[];
export type BeatmapsetTagSorting = Sorting<BeatmapsetTagSortingEnum>[];
export type BeatmapSnapshotSorting = Sorting<BeatmapSnapshotSortingEnum>[];
export type BeatmapSorting = Sorting<BeatmapSortingEnum>[];
export type BeatmapTagSorting = Sorting<BeatmapTagSortingEnum>[];
export type ProfileSorting = Sorting<ProfileSortingEnum>[];
export type QueueSorting = Sorting<QueueSortingEnum>[];
export type RequestSorting = Sorting<RequestSortingEnum>[];
export type ScoreSorting = Sorting<ScoreSortingEnum>[];