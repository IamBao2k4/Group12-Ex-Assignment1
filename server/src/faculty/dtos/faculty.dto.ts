export class FacultyDto {
    ma_khoa: string;
    ten_khoa: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export class UpdateFacultyDto {
    readonly ma_khoa?: string;
    readonly ten_khoa?: string;
    readonly created_at?: Date;
    readonly updated_at?: Date;
    readonly deleted_at?: Date;
}

export class CreateFacultyDto {
    readonly ma_khoa: string;
    readonly ten_khoa: string;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
