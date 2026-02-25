import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppNotification {
    id: number;
    message: string;
    read: boolean;
    createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/v1/notifications';

    getNotifications(): Observable<AppNotification[]> {
        return this.http.get<AppNotification[]>(this.apiUrl);
    }

    markAsRead(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/read`, {});
    }
}