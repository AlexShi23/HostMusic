import { Status } from '../../models';

export function getBadge(status: Status): string {
    switch(status) {
        case Status.Draft:
            return 'default';
        case Status.Moderation:
            return 'primary';
        case Status.Correcting:
            return 'error';
        case Status.Distributed:
            return 'info';
        case Status.Published:
            return 'success';
        case Status.ModerationDone:
            return 'info';
    }

    return '';
}

export function formatDate(date: Date) {
    let result = date.toString().split('T')[0].split('-');
    return `${result[2]}.${result[1]}.${result[0]}`;
}

export function getFeatText(featuring: string) {
    return featuring.length > 0 ? `(feat. ${featuring})` : null;
}

export function getSubtitleText(subtitle: string) {
    return subtitle.length > 0 ? `(${subtitle})` : null;
}