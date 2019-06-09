import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {

  listPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'contact'
    },
    {
      title: 'Take a test',
      url: '/test',
      icon: 'clipboard'
    },
    {
      title: 'List of questions',
      url: '/test/list',
      icon: 'list'
    },
    {
      title: 'Test History',
      url: '/test/history',
      icon: 'briefcase'
    },
    {
      title: 'Add Question',
      url: '/test/make',
      icon: 'add'
    },
    {
      title: 'Log Out',
      url: '/login',
      icon: 'log-out',
      clickEvent: true
    },
  ];

  constructor(
    private menu: MenuController,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  profileNavigate() {
    this.router.navigate(['/profile']);
  }

  homeNavigate() {
    this.router.navigate(['/']);
  }

  logout() {
    console.log('logout');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
