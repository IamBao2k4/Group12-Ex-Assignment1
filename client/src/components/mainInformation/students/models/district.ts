import { Ward } from './ward';

export interface District {
    name: string;
    code: number;
    codename: string;
    division_type: string;
    short_codename: string;
    wards: Ward[];
}