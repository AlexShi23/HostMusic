export enum Status {
    Draft = 'Draft',
    Moderation = 'Moderation',
    ModerationDone = 'ModerationDone',
    Correcting = 'Correcting',
    Distributed = 'Distributed',
    Published = 'Published'
}

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
    }
}