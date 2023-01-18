import { SafeUrl } from '@angular/platform-browser';
import { Role } from './role';

export class Account {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    jwtToken?: string;
    avatar?: SafeUrl;
}