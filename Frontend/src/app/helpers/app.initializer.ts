import { AccountService } from '@app/services';

export function appInitializer(accountService: AccountService) {
    return () => new Promise((resolve: any) => {
        accountService.refreshToken()
            .subscribe()
            .add(resolve);
    });
}