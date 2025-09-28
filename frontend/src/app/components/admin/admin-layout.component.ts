import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <nav class="admin-nav">
        <div class="nav-header">
          <h2>Panel Administratora</h2>
        </div>
        <ul class="nav-menu">
          <li><a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a></li>
          <li><a routerLink="/admin/invitations" routerLinkActive="active">Zaproszenia</a></li>
          <li><a routerLink="/admin/persons" routerLinkActive="active">Osoby</a></li>
          <li><a routerLink="/admin/drink-types" routerLinkActive="active">Rodzaje napojów</a></li>
          <li><a routerLink="/admin/confirmations" routerLinkActive="active">Potwierdzenia</a></li>
        </ul>
        <div class="nav-footer">
          <a routerLink="/" class="home-link">← Strona główna</a>
        </div>
      </nav>
      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background: #f8f9fa;
    }

    .admin-nav {
      width: 280px;
      background: #343a40;
      color: white;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .nav-header {
      padding: 20px;
      background: #495057;
      border-bottom: 1px solid #6c757d;
    }

    .nav-header h2 {
      margin: 0;
      font-size: 1.2em;
      font-weight: 600;
    }

    .nav-menu {
      list-style: none;
      padding: 20px 0;
      margin: 0;
      flex-grow: 1;
    }

    .nav-menu li {
      margin: 0;
    }

    .nav-menu a {
      display: block;
      padding: 12px 20px;
      color: #adb5bd;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
    }

    .nav-menu a:hover {
      background: #495057;
      color: white;
      border-left-color: #667eea;
    }

    .nav-menu a.active {
      background: #495057;
      color: white;
      border-left-color: #667eea;
    }

    .nav-footer {
      padding: 20px;
      border-top: 1px solid #6c757d;
    }

    .home-link {
      color: #adb5bd;
      text-decoration: none;
      font-size: 0.9em;
    }

    .home-link:hover {
      color: white;
    }

    .admin-content {
      flex: 1;
      padding: 30px;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .admin-layout {
        flex-direction: column;
      }

      .admin-nav {
        width: 100%;
        height: auto;
      }

      .nav-menu {
        display: flex;
        overflow-x: auto;
        padding: 10px;
      }

      .nav-menu li {
        flex-shrink: 0;
      }

      .nav-menu a {
        padding: 8px 16px;
        white-space: nowrap;
        border-left: none;
        border-bottom: 3px solid transparent;
      }

      .nav-menu a:hover,
      .nav-menu a.active {
        border-left: none;
        border-bottom-color: #667eea;
      }

      .admin-content {
        padding: 20px;
      }
    }
  `]
})
export class AdminLayoutComponent {}
