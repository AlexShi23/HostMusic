import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { FileType, Track } from "@app/_models";
import { FilesService, ReleaseService } from "@app/_services";
import { TuiDay } from "@taiga-ui/cdk";
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { TuiFileLike } from "@taiga-ui/kit";
import { forkJoin, Observable, Subject } from "rxjs";
import { first, map, switchMap } from "rxjs/operators";
import * as uuid from "uuid";

@Component({ templateUrl: './add-edit.component.html',
             styleUrls: ['./add-edit.component.less'] })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    skeletonVisible = false;
    coverPath: SafeUrl;
    trackPaths: SafeUrl[];
    tracksLoading = false;
    filesUploading = false;
    id: string;
    isAddMode: boolean;
    rejectedFiles$ = new Subject<TuiFileLike | null>();
    rejectedTrackFiles$ = new Array<Subject<TuiFileLike | null>>();
    currentDay = TuiDay.currentLocal().append(new TuiDay(0, 0, 1));
    releaseDate: TuiDay | null = null;
    currentTime: number[];
    paused: boolean[];

    types = ['Single', 'Album'];
    genres = ['Hip-hop', 'Pop', 'Rock', 'Alternative', 'Indie', 'Electronic', 'Ethnic'];
    countries = ['Russia', 'Belarus', 'Kazhakhstan'];

    constructor(
        private formBuilder: FormBuilder,
        private releaseService: ReleaseService,
        private filesService: FilesService,
        private route: ActivatedRoute,
        private router: Router,
        @Inject(TuiNotificationsService)
        private readonly notificationsService: TuiNotificationsService
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            id: [],
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
                    id: [],
                    index: [],
                    title: ['', Validators.required],
                    subtitle: [''],
                    artist: ['', Validators.required],
                    featuring: [''],
                    trackPath: [null, this.isAddMode ? Validators.required : null],
                    explicit: [null],
                    lyrics: ['']
                })
            ]),
            isDraft: [false]
        });
        this.rejectedTrackFiles$.push(new Subject<TuiFileLike | null>());

        if (!this.isAddMode) {
            this.skeletonVisible = true;
            this.tracksLoading = true;
            this.releaseService.getById(this.id)
                .pipe(first())
                .subscribe(release => {
                    this.tracksLoading = true;
                    this.trackPaths = new Array<SafeUrl>(release.numberOfTracks).fill(null);
                    this.showSkeleton();
                    this.filesService.getFileUrl(release.id, FileType.Cover, false).subscribe({
                        next: (imageUrl: SafeUrl) => {
                            this.coverPath = imageUrl;
                        },
                        error: () => {
                            this.coverPath = null;
                        }
                    });

                    release.tracks.forEach(
                        (track: Track) => {
                            this.filesService.getFileUrl(track.id, FileType.Track, false).subscribe({
                                next: (trackUrl: SafeUrl) => {
                                    this.trackPaths[track.index - 1] = trackUrl;
                                    this.tracksLoading = false;
                                },
                                error: () => {
                                    this.trackPaths[track.index - 1] = null;
                                    this.tracksLoading = false;
                                }
                            })
                        }
                    );

                    this.currentTime = new Array<number>(release.numberOfTracks).fill(0);
                    this.paused = new Array<boolean>(release.numberOfTracks).fill(true);

                    for (let i = 0; i < release.numberOfTracks; i++) {
                        delete release.tracks[i].releaseId;
                        delete release.tracks[i].duration;
                        if (i != release.numberOfTracks - 1)
                            this.addTrack();
                    }
                    
                    delete release.numberOfPlays;
                    delete release.duration;
                    delete release.ownerId;
                    delete release.status;
                    delete release.numberOfTracks;

                    this.form.patchValue(release);
                });
        }
    }

    get tracksArray(): FormArray {
        return this.form.controls.tracks as FormArray;
    }

    get tracksForm() {
        return this.form.get('tracks')['controls'];
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
        this.tracksForm[index].controls.trackPath.setValue(null);
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

        this.sendRelease();
    }

    saveAsDraft(): void {
        this.form.controls.isDraft.setValue(true);
        this.sendRelease();
    }

    sendRelease(): void {
        this.filesUploading = true;

        forkJoin(this.uploadFiles())
            .subscribe({
                next: () => {
                    if (this.isAddMode)
                        this.createRelease();
                    else
                        this.updateRelease();
                },
                error: error => { this.notificationsService
                    .show(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                }
            });
    }

    uploadFiles(): Observable<any>[] {
        let uploadings: Observable<any>[] = [];
        if (this.form.controls.cover.value) {
            const releaseId = this.isAddMode ? uuid.v4() : this.id;
            this.form.controls.id.setValue(releaseId);
            if (this.coverPath) {
                this.filesService.deleteFile(this.id, FileType.Cover).subscribe();
            }

            uploadings.push(this.filesService.getPreSignedUrl(releaseId, FileType.Cover, false).pipe(
                switchMap((url) => {
                    return this.filesService.uploadFileToPreSignedUrl(url, this.form.controls.cover.value);
                })
            ));
            //uploadings.push(this.filesService.uploadFile(releaseId, this.form.controls.cover.value, FileType.Cover));
        }

        for (let i = 0; i < this.tracksArray.length; i++) {
            if (this.tracksForm[i].controls.trackPath.value) {
                const trackId = this.isAddMode ? uuid.v4() : this.tracksForm[i].controls.id.value;
                this.tracksForm[i].controls.id.setValue(trackId);
                this.tracksForm[i].controls.index.setValue(i + 1);
                if (!this.isAddMode && this.trackPaths[i]) {
                    this.filesService.deleteFile(trackId, FileType.Track).subscribe();
                }
                uploadings.push(this.filesService.uploadFile(trackId,
                    this.tracksForm[i].controls.trackPath.value, FileType.Track));
            }
        }

        return uploadings;
    }

    addTrack(): void {
        this.tracksArray.push(
            this.formBuilder.group({
                id: [],
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

    createRelease() {
        this.releaseService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.filesUploading = false;
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

    updateRelease() {
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

    getIcon(index: number): string {
        return this.paused[index] ? 'tuiIconPlayLarge' : 'tuiIconPauseLarge';
    }
 
    toggleState(index: number): void {
        this.paused[index] = !this.paused[index];
    }

    showSkeleton(): void {
        this.skeletonVisible = !this.skeletonVisible;
    }
}