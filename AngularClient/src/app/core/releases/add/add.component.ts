import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FileStatus, ReleaseService, TrackService, UploadService } from "@app/_services";
import { TuiDay } from "@taiga-ui/cdk";
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { TuiFileLike } from "@taiga-ui/kit";
import { Observable, Subject } from "rxjs";
import { delay, first, share, switchMap } from "rxjs/operators";

@Component({ templateUrl: './add.component.html' })
export class AddComponent implements OnInit {
    form: FormGroup;
    uploadProgress: Observable<FileStatus[]>;
    fileId: string;
    tracksCount: number;
    rejectedFiles$ = new Subject<TuiFileLike | null>();
    rejectedTrackFiles$ = new Array<Subject<TuiFileLike | null>>();
    currentDay = TuiDay.currentLocal().append(new TuiDay(0, 0, 1));
    releaseDate: TuiDay | null = null;

    types = ['Single', 'Album'];
    genres = ['Hip-hop', 'Pop', 'Rock'];
    countries = ['Russia', 'Kazhakhstan'];

    constructor(
        private formBuilder: FormBuilder,
        private releaseService: ReleaseService,
        private trackService: TrackService,
        private uploadService: UploadService,
        private route: ActivatedRoute,
        private router: Router,
        @Inject(TuiNotificationsService)
        private readonly notificationsService: TuiNotificationsService
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            type: ['Single', Validators.required],
            subtitle: [''],
            artist: ['', Validators.required],
            featuring: [''],
            genre: ['', Validators.required],
            country: ['', Validators.required],
            releaseDate: ['', Validators.required],
            cover: [null, Validators.required],
            tracks: this.formBuilder.array([
                this.formBuilder.group({
                    index: [],
                    title: ['', Validators.required],
                    subtitle: [''],
                    artist: ['', Validators.required],
                    featuring: [''],
                    trackPath: [],
                    explicit: [null],
                    lyrics: ['']
                })
            ])
        });
        this.uploadProgress = this.uploadService.uploadProgress;
        this.rejectedTrackFiles$.push(new Subject<TuiFileLike | null>());
    }

    get tracksArray(): FormArray {
        return this.form.controls.tracks as FormArray;
    }
 
    onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
        this.rejectedFiles$.next(file as TuiFileLike);
    }

    onTrackReject(file: TuiFileLike | readonly TuiFileLike[], index: number): void {
        this.rejectedTrackFiles$[index].next(file as TuiFileLike);
    }
 
    removeFile(): void {
        this.form.controls.cover.setValue(null);
    }

    removeTrackFile(index: number): void {
        this.form.get('tracks')['controls'][index].controls.trackPath.setValue(null);
    }
 
    clearRejected(): void {
        this.rejectedFiles$.next(null);
    }

    clearTrackRejected(index: number): void {
        this.rejectedTrackFiles$[index].next(null);
    }
    
    onSubmit(): void {
        if (this.form.invalid) {
            this.notificationsService
                .show("Форма заполнена неверно!", {
                    status: TuiNotification.Error
                }).subscribe();
            return;
        }

        this.uploadService.uploadFile(this.form.controls.cover.value, this.form.controls.cover.value.name);
        let id: string;
        this.uploadProgress.subscribe({
            next: (vl) => {
                if (vl[0].uuid != null) {
                    id = vl[0].uuid;
                }
                if (vl[0].progress == 100) {
                    this.form.controls.cover.setValue(id + '.' + this.form.controls.cover.value.name.split('.').pop());
                    this.createTracks();
                }
            }
        });
    }

    addTrack(): void {
        this.tracksArray.push(
            this.formBuilder.group({
                index: [],
                title: ['', Validators.required],
                subtitle: [''],
                artist: ['', Validators.required],
                featuring: [''],
                trackPath: [null],
                lyrics: [''],
                explicit: [null]
            })
        );
        this.rejectedTrackFiles$.push(new Subject<TuiFileLike>());
    }

    deleteTrack(index: number): void {
        this.tracksArray.removeAt(index);
        delete this.rejectedTrackFiles$[index];
    }

    private createRelease() {
        this.releaseService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: (id: string) => {
                    this.notificationsService
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

    private createTracks() {
        this.uploadTrack(0);
    }

    private uploadTrack(i: number) {
        if (i == this.tracksArray.length) {
            this.createRelease();
        }

        this.form.get('tracks')['controls'][i].controls.index.setValue(i + 1);

            this.uploadService.uploadFile(this.form.get('tracks')['controls'][i].controls.trackPath.value,
                this.form.get('tracks')['controls'][i].controls.trackPath.value.name);
            let id: string;
            this.uploadProgress.subscribe({
                next: (vl) => {
                    if (vl[0].uuid != null) {
                        id = vl[0].uuid;
                    }
                    if (vl[0].progress == 100) {
                        this.form.get('tracks')['controls'][i].controls.trackPath.setValue(id + '.' +
                            this.form.get('tracks')['controls'][i].controls.trackPath.value.name.split('.').pop());
                        this.uploadTrack(i + 1);
                    }
                }
            });
    }
}