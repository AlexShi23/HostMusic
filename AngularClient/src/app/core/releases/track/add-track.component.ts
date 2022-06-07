import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FileStatus, TrackService, UploadService } from '@app/_services';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({ selector: 'track', templateUrl: 'add-track.component.html' })
export class AddTrackComponent implements OnInit {
    form: FormGroup;
    uploadProgress: Observable<FileStatus[]>;
    fileId: string;
    rejectedFiles$ = new Subject<TuiFileLike | null>();

    constructor(
        private formBuilder: FormBuilder,
        private trackService: TrackService,
        private uploadService: UploadService,
        @Inject(TuiNotificationsService)
        private readonly notificationsService: TuiNotificationsService
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            trackTitle: ['', Validators.required],
            trackSubtitle: [''],
            trackArtist: ['', Validators.required],
            trackFeaturing: [''],
            track: [null, Validators.required],
            lyrics: [''],
            explicit: [null]
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
        if (this.form.invalid) {
            return;
        }

        this.uploadService.uploadFile(this.form.controls.track.value, this.form.controls.track.value.name);
        let id: string;
        this.uploadProgress.subscribe({
            next: (vl) => {
                if (vl[0].uuid != null) {
                    id = vl[0].uuid;
                }
                if (vl[0].progress == 100) {
                    this.form.controls.track.setValue(id + '.' + this.form.controls.cover.value.name.split('.').pop());
                    this.createTrack();
                }
            }
        });
    }

    private createTrack() {
        this.trackService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => { this.notificationsService
                    .show('Релиз успешно создан', {
                        status: TuiNotification.Success
                    }).subscribe()
                },
                error: error => { this.notificationsService
                    .show(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                }
            });
    }
}