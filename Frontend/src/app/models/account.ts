import { SafeUrl } from '@angular/platform-browser';
import { Role } from './role';

export class Account {
    id: string;
    nickname: string;
    email: string;
    role: Role;
    jwtToken?: string;
    avatar?: SafeUrl;
}