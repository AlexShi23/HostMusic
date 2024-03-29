import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { FileType } from "@app/models";
import { FilesService, ReleaseService } from "@app/services";
import { TuiDay } from "@taiga-ui/cdk";
import { TuiNotification, TuiAlertService } from '@taiga-ui/core';
import { TuiFileLike } from "@taiga-ui/kit";
import { forkJoin, Observable, of, Subject } from "rxjs";
import { first, switchMap } from "rxjs/operators";
import * as uuid from "uuid";

@Component({ templateUrl: './add-edit.component.html',
             styleUrls: ['./add-edit.component.less'] })
export class AddEditComponent implements OnInit {
    id: string;
    form: FormGroup;
    isAddMode: boolean;
    coverPath: SafeUrl;
    releaseLoading = false;
    filesUploading = false;
    needCoverInput = true;
    rejectedFiles$ = new Subject<TuiFileLike | null>();
    currentDay = TuiDay.currentLocal().append(new TuiDay(0, 0, 1));
    releaseDate: TuiDay | null = null;

    types = ['Single', 'Album'];
    genres = ['Hip-hop', 'Pop', 'Rock', 'Alternative', 'Indie', 'Electronic', 'Ethnic'];
    countries = ['Russia', 'Belarus', 'Kazhakhstan'];

    constructor(
        private formBuilder: FormBuilder,
        private releaseService: ReleaseService,
        private filesService: FilesService,
        private route: ActivatedRoute,
        private router: Router,
        @Inject(TuiAlertService)
        private readonly alertService: TuiAlertService,
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

        if (!this.isAddMode) {
            this.releaseLoading = true;
            this.releaseService.getById(this.id)
                .pipe(first())
                .subscribe(release => {
                    this.releaseLoading = false;
                    this.filesService.getFileUrl(release.id, FileType.Cover, false).subscribe({
                        next: (imageUrl: SafeUrl) => {
                            this.coverPath = imageUrl;
                            this.needCoverInput = false;
                        },
                        error: () => {
                            this.coverPath = null;
                        }
                    });

                    for (let i = 0; i < release.numberOfTracks; i++) {
                        delete release.tracks[i].releaseId;
                        delete release.tracks[i].duration;
                        if (i != release.numberOfTracks - 1)
                            this.addTrack();
                    }

                    let date = new Date(release.releaseDate);
                    let tuiDay = new TuiDay(date.getFullYear(), date.getMonth(), date.getDate())
                    this.form.controls.releaseDate.setValue(tuiDay);

                    delete release.releaseDate;
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
 
    removeFile(): void {
        this.form.controls.cover.setValue(null);
    }

    removeTrackFile(index: number): void {
        this.tracksForm[index].controls.trackPath.setValue(null);
    }
 
    clearRejected(): void {
        this.rejectedFiles$.next(null);
    }
    
    onSubmit(): void {
        if (this.form.invalid) {
            this.alertService
                .open("Форма заполнена неверно!", {
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
                error: error => { this.alertService
                    .open(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                }
            });
    }

    uploadFiles(): Observable<any>[] {
        let uploadings: Observable<any>[] = [of(1)];
        if (this.form.controls.cover.value) {
            const releaseId = this.isAddMode ? uuid.v4() : this.id;
            this.form.controls.id.setValue(releaseId);
            if (this.coverPath) {
                this.filesService.deleteFile(this.id, FileType.Cover).subscribe();
            }

            uploadings.push(this.filesService.uploadFile(releaseId, this.form.controls.cover.value, FileType.Cover));
        }

        for (let i = 0; i < this.tracksArray.length; i++) {
            if (this.tracksForm[i].controls.trackPath.value) {
                const trackId = this.isAddMode ? uuid.v4() : this.tracksForm[i].controls.id.value;
                this.tracksForm[i].controls.id.setValue(trackId);
                this.tracksForm[i].controls.index.setValue(i + 1);

                uploadings.push(this.filesService.getPreSignedUrl(trackId, FileType.Track, false).pipe(
                    switchMap((url) => {
                        return this.filesService.uploadFileToPreSignedUrl(url, this.tracksForm[i].controls.trackPath.value);
                    })
                ));
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
    }

    deleteTrack(index: number): void {
        this.tracksArray.removeAt(index);
    }

    createRelease() {
        this.releaseService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.filesUploading = false;
                    this.alertService
                    .open('Релиз успешно создан', {
                        status: TuiNotification.Success
                    }).subscribe()
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => { this.alertService
                    .open(error, {
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
                    this.alertService
                    .open('Релиз отредактирован', {
                        status: TuiNotification.Success
                    }).subscribe()
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => { this.alertService
                    .open(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                }
            });
    }

    setNeedCoverInput(): void {
        this.needCoverInput = true;
    }
}