export interface Comment {
    id: string;
    parent_id: string | null;
    nickname: string | null;
    content: string;
    created_at: string;
}