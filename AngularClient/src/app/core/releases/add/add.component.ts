import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ReleaseService } from "@app/_services";
import { TuiDay } from "@taiga-ui/cdk";
import { TuiNotification } from "@taiga-ui/core";
import { first } from "rxjs/operators";

@Component({ templateUrl: './add.component.html' })
export class AddComponent implements OnInit {
    form: FormGroup;
    
    currentDay = TuiDay.currentLocal().append(new TuiDay(0, 0, 1));
    releaseDate: TuiDay | null = null;
    notificationsService: any;

    constructor(
        private formBuilder: FormBuilder,
        private releaseService: ReleaseService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            type: ['', Validators.required],
            subtitle: [''],
            artist: ['', Validators.required],
            feat: [''],
            genre: ['', Validators.required],
            country: ['', Validators.required],
            date: ['', Validators.required]
        });
    }
    
    onSubmit(): void {
        this.createRelease();
    }

    private createRelease() {
        this.releaseService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => { this.notificationsService
                    .show('Релиз успешно создан', {
                        status: TuiNotification.Success
                    }).subscribe()
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => { this.notificationsService
                    .show(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                }
            });
    }
}