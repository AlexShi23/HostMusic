import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TuiDay, TUI_LAST_DAY } from "@taiga-ui/cdk";
import { TuiNamedDay } from "@taiga-ui/kit";

@Component({ templateUrl: './add.component.html' })
export class AddComponent implements OnInit {
    form: FormGroup;
    currentDay = TuiDay.currentLocal().append(new TuiDay(0, 0, 1));
    releaseDate: TuiDay | null = null;

    constructor(
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            type: ['', Validators.required],
            artist: ['', Validators.required],
            genre: ['', Validators.required],
            feat: ['', Validators.required],
            subgenre: ['', Validators.required],
            date: ['', Validators.required]
        });
    }
    
    onSubmit(): void {

    }
}