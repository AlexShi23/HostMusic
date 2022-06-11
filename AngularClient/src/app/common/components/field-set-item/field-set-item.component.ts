import {Component, Input} from '@angular/core';
@Component({
    selector: 'field-set-item',
    templateUrl: './field-set-item.component.html',
    styleUrls: ['./field-set-item.component.less']
})
export class FieldSetItemComponent {
    @Input() title: string;
    @Input() default = 'Не указано';
    @Input() tooltip: string;
    @Input() saveSpaces = false;
}