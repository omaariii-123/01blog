import { Directive, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[secureMedia]',
    standalone: true
})
export class SecureMediaDirective implements OnChanges, OnDestroy {
    @Input('secureMedia') url?: string;

    private el = inject(ElementRef);
    private http = inject(HttpClient);
    private subscription?: Subscription;
    private objectUrl?: string;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['url'] && this.url) {
            this.loadMedia();
        }
    }

    private loadMedia() {
        if (!this.url) return;

        this.subscription?.unsubscribe(); 
        
        this.subscription = this.http.get(this.url, { responseType: 'blob' as const }).subscribe({
            next: (data) => {
                if (this.objectUrl) {
                    URL.revokeObjectURL(this.objectUrl); 
                }
                
                const blob = data as Blob;
                this.objectUrl = URL.createObjectURL(blob);
                this.el.nativeElement.src = this.objectUrl;
            },
            error: (err) => console.error('Failed to load secure media', err)
        });
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
        }
    }
}