import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'positionFormatter'
})
export class PositionFormatterPipe implements PipeTransform {
    transform(value: string, args?: any): string {
        let position;
        switch (value) {
            case 'C':
                position = 'Center';
                break;
            case 'LW':
                position = 'Left Wing';
                break;
            case 'RW':
                position = 'Right Wing';
                break;
            case 'D':
                position = 'Defenseman';
                break;
            case 'G':
                position = 'Goalie';
                break;
        }
        return position;
    }
}