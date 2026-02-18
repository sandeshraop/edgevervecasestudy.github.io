import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  showDropdown = false;
  userName = "User";

  ngOnInit() {
    // Handle SSR - localStorage may not be available
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        this.userName = "Sandesh"; // later replace with actual user data
      }
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    // Handle SSR - localStorage may not be available
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.isLoggedIn = false;
    this.showDropdown = false;
  }
}
