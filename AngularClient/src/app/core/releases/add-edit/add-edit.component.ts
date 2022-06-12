import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FileStatus, ReleaseService, TrackService, UploadService } from "@app/_services";
import { environment } from "@environments/environment";
import { TuiDay } from "@taiga-ui/cdk";
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { TuiFileLike } from "@taiga-ui/kit";
import { Observable, Subject } from "rxjs";
import { delay, first, share, switchMap } from "rxjs/operators";

@Component({ templateUrl: './add-edit.component.html',
             styleUrls: ['./add-edit.component.less'] })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    uploadProgress: Observable<FileStatus[]>;
    coverPath: string;
    trackPaths: string[];
    fileId: string;
    id: string;
    isAddMode: boolean;
    tracksCount: number;
    rejectedFiles$ = new Subject<TuiFileLike | null>();
    rejectedTrackFiles$ = new Array<Subject<TuiFileLike | null>>();
    currentDay = TuiDay.currentLocal().append(new TuiDay(0, 0, 1));
    releaseDate: TuiDay | null = null;
    currentTime: number[];
    paused: boolean[];

    types = ['Single', 'Album'];
    genres = ['Hip-hop', 'Pop', 'Rock'];
    countries = ['Russia', 'Kazhakhstan'];

    constructor(
        private formBuilder: FormBuilder,
        private releaseService: ReleaseService,
        private uploadService: UploadService,
        private route: ActivatedRoute,
        private router: Router,
        @Inject(TuiNotificationsService)
        private readonly notificationsService: TuiNotificationsService
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            type: ['Single', Validators.required],
            subtitle: [''],
            artist: ['', Validators.required],
            featuring: [''],
            genre: ['', Validators.required],
            country: ['', Validators.required],
            releaseDate: ['', Validators.required],
            cover: [null, this.isAddMode ? Validators.required : null],
            tracks: this.formBuilder.array([
                this.formBuilder.group({
                    index: [],
                    title: ['', Validators.required],
                    subtitle: [''],
                    artist: ['', Validators.required],
                    featuring: [''],
                    trackPath: [null, this.isAddMode ? Validators.required : null],
                    explicit: [null],
                    lyrics: ['']
                })
            ])
        });
        this.uploadProgress = this.uploadService.uploadProgress;
        this.rejectedTrackFiles$.push(new Subject<TuiFileLike | null>());

        if (!this.isAddMode) {
            this.releaseService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.coverPath = x.coverPath;
                    delete x.coverPath;
                    delete x.numberOfPlays;
                    delete x.id;
                    delete x.duration;
                    delete x.ownerId;
                    delete x.status;

                    this.trackPaths = new Array<string>(x.numberOfTracks);

                    for (let i = 0; i < x.numberOfTracks; i++) {
                        this.trackPaths.push(x.tracks[i].trackPath)
                        delete x.tracks[i].id;
                        delete x.tracks[i].trackPath;
                        delete x.tracks[i].releaseId;
                        delete x.tracks[i].duration;
                        delete x.tracks[i].index;
                        if (i != x.numberOfTracks - 1)
                            this.addTrack();
                    }
                    
                    this.currentTime = new Array<number>(x.numberOfTracks).fill(0);
                    this.paused = new Array<boolean>(x.numberOfTracks).fill(true);
                    delete x.numberOfTracks;
                    this.form.patchValue(x);
                });
        }
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

        if (!this.isAddMode && !this.form.controls.cover.value) {
            this.form.controls.cover.setValue(this.coverPath);
            this.createTracks();
        } else {
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
    }

    addTrack(): void {
        this.tracksArray.push(
            this.formBuilder.group({
                index: [],
                title: ['', Validators.required],
                subtitle: [''],
                artist: ['', Validators.required],
                featuring: [''],
                trackPath: [null, this.isAddMode ? Validators.required : null],
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

    private updateRelease() {
        this.releaseService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notificationsService
                    .show('Релиз отредактирован', {
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
            if (this.isAddMode)
                this.createRelease();
            else
                this.updateRelease();
        }

        this.form.get('tracks')['controls'][i].controls.index.setValue(i + 1);

        if (!this.isAddMode && !this.form.get('tracks')['controls'][i].controls.trackPath.value) {
            this.form.get('tracks')['controls'][i].controls.trackPath.setValue(this.trackPaths[i + 1]);
            this.uploadTrack(i + 1);
        } else {
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

    getFilePath(filename: string) {
        return `${environment.releasesUrl}/Resources/${filename}`;
    }

    getIcon(index: number): string {
        return this.paused[index] ? 'tuiIconPlayLarge' : 'tuiIconPauseLarge';
    }
 
    toggleState(index: number): void {
        this.paused[index] = !this.paused[index];
    }
}