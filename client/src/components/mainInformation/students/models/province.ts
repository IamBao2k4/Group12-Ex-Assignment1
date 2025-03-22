import { District } from './district';

export interface Province {
    name: string;
    code: number;
    codename: string;
    division_type: string;
    phone_code: number;
    districts: District[];
}