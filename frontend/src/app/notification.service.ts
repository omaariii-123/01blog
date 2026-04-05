import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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

  // State management with signals
  private _notifications = signal<AppNotification[]>([]);

  // Publicly accessible signals
  notifications = this._notifications.asReadonly();

  // Automatically calculates unread count whenever _notifications changes
  unreadCount = computed(() => this._notifications().filter((n) => !n.read).length);

  getNotifications(): Observable<AppNotification[]> {
    return this.http
      .get<AppNotification[]>(this.apiUrl)
      .pipe(tap((notifs) => this._notifications.set(notifs)));
  }

  // Usually, the backend handles creating notifications via a Trigger/Service,
  // but keeping this if you have a specific manual use case.
  createNotification(message: string): Observable<AppNotification> {
    return this.http.post<AppNotification>(this.apiUrl, { message });
  }

  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        // Update the local signal state so the UI (and unreadCount) updates instantly
        this._notifications.update((notifs) =>
          notifs.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      })
    );
  }
}
