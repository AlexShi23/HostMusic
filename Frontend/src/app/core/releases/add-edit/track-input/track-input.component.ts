import {Component, Input, OnInit} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { FileType } from '@app/models';
import { FilesService } from '@app/services';
import { TuiFileLike } from '@taiga-ui/kit';
import { Subject } from 'rxjs';

@Component({ 
    selector: 'track-input',
    templateUrl: './track-input.component.html',
    styleUrls: ['./track-input.component.less']
})
export class TrackInputComponent implements OnInit {
    @Input() isAddMode: boolean;
    @Input() skeletonVisible: boolean;
    @Input() index: number;
    @Input() form: FormGroup;
    @Input() trackForm: FormGroup;

    trackLoading = false;
    trackPath: SafeUrl;
    rejectedTrackFile$: Subject<TuiFileLike | null>;
    currentTime: number;
    paused: boolean;

    constructor(
        private filesService: FilesService,
    ) {}

    ngOnInit(): void {
        let trackId = this.form.get('tracks')['controls'][this.index].controls.id.value;
        if (!this.isAddMode && trackId) {
            this.trackLoading = true;
            this.filesService.getFileUrl(trackId, FileType.Track, false).subscribe({
                next: (trackUrl: SafeUrl) => {
                    this.trackPath = trackUrl;
                    this.trackLoading = false;
                    this.paused = true;
                    this.currentTime = 0;
                },
                error: () => {
                    this.trackPath = null;
                    this.trackLoading = false;
                }
            })
        }
    }

    get tracksArray(): FormArray {
        return this.form.controls.tracks as FormArray;
    }

    deleteTrack(index: number): void {
        this.tracksArray.removeAt(index);
        delete this.rejectedTrackFile$;
    }

    onTrackReject(file: TuiFileLike | readonly TuiFileLike[]): void {
        this.rejectedTrackFile$.next(file as TuiFileLike);
    }

    removeTrackFile(): void {
        this.trackForm.controls.trackPath.setValue(null);
    }

    getIcon(): string {
        return this.paused ? 'tuiIconPlayLarge' : 'tuiIconPauseLarge';
    }
 
    toggleState(): void {
        this.paused = !this.paused;
    }
}