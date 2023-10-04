import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EditorService {
    private closeEditorSubject = new Subject<void>();
    closeEditor$ = this.closeEditorSubject.asObservable();

    closeEditor() {
        this.closeEditorSubject.next();
    }
}
