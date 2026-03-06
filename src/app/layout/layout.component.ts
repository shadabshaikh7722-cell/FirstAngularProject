import { Component } from '@angular/core';
import { NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs';

export interface Menu {
  code: number;
  menuname: string;
  parentid: number | null;
  menuurl: string;
  menuicon?: string;
  children: Menu[];
}



@Component({
  selector: 'app-layout',
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.component.html',
  standalone: true,

  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  currentUrl: string = '';
  router: any;

  constructor(private http: HttpClient) { }
  isCollapsed = true;

  menus: Menu[] = []; // 👈 Dynamic menu list
  treeMenus: Menu[] = [];

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit(): void {
    this.loadMenus();
    // Track current URL for active menu logic
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }


  loadMenus() {
    this.http.get<Menu[]>('https://localhost:7278/api/MenuMaster/GetUserMenus/GetUserMenus')
      .subscribe({
        next: (res) => {
          console.log('res', res);

          this.menus = this.mapMenus(res);

        },
        error: (err) => {
          console.error('Menu API Error:', err);
        }
      });
  }

 

  // 🔥 Recursive mapper (VERY IMPORTANT)
  mapMenus(apiMenus: any[]): Menu[] {
    return apiMenus.map(m => ({
      code: m.Code,
      menuname: m.Menuname,
      menuurl: m.Menuurl,
      parentid: m.Parentid,
      menuicon: m.Menuicon,
      children: m.Children ? this.mapMenus(m.Children) : [] // recursion
    }));
  }

  
  
}
