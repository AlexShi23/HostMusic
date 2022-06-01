import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FileStatus, ReleaseService, UploadService } from "@app/_services";
import { TuiDay } from "@taiga-ui/cdk";
import { TuiNotification } from "@taiga-ui/core";
import { TuiFileLike } from "@taiga-ui/kit";
import { Observable, Subject } from "rxjs";
import { first, share, switchMap } from "rxjs/operators";

@Component({ templateUrl: './add.component.html' })
export class AddComponent implements OnInit {
    form: FormGroup;
    uploadProgress: Observable<FileStatus[]>;
    fileId: string;
    rejectedFiles$ = new Subject<TuiFileLike | null>();
    currentDay = TuiDay.currentLocal().append(new TuiDay(0, 0, 1));
    releaseDate: TuiDay | null = null;
    notificationsService: any;

    types = ['Single', 'Album'];
    genres = ['Hip-hop', 'Pop', 'Rock'];
    countries = ['Russia', 'Kazhakhstan'];

    constructor(
        private formBuilder: FormBuilder,
        private releaseService: ReleaseService,
        private uploadService: UploadService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            type: ['', Validators.required],
            subtitle: [''],
            artist: ['', Validators.required],
            featuring: [''],
            genre: ['', Validators.required],
            country: ['', Validators.required],
            releaseDate: ['', Validators.required],
            cover: [null, Validators.required]
        });
        this.uploadProgress = this.uploadService.uploadProgress;
        
    }
 
    onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
        this.rejectedFiles$.next(file as TuiFileLike);
    }
 
    removeFile(): void {
        this.form.controls.cover.setValue(null);
    }
 
    clearRejected(): void {
        this.rejectedFiles$.next(null);
    }
    
    onSubmit(): void {
        this.uploadService.uploadFile(this.form.controls.cover.value, this.form.controls.cover.value.name);
        let id: string;
        this.uploadProgress.subscribe({
            next: (vl) => {
                if (vl[0].uuid != null) {
                    id = vl[0].uuid;
                }
            },
            complete: () => {
                this.form.controls.cover.setValue('C:\\AspNetCoreLargeFileExample\\' + id + '.' + this.form.controls.cover.value.name.split('.').pop());
                this.createRelease();
            }
        });
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