import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class MenuComponent {
  menuItems = [
    {
      id: 1,
      name: 'Veg Manchuria',
      price: 265,
      imageUrl: 'https://images.unsplash.com/photo-1604908554164-9b1f79f8a99a?w=400&h=300&fit=crop&auto=format',
      categoryId: 1,
      rating: 4.5,
      isAvailable: true
    },
    {
      id: 2,
      name: 'Hakka Chicken Masala',
      price: 320,
      imageUrl: 'https://images.unsplash.com/photo-1604908812853-0ef2a2b9e1b4?w=400&h=300&fit=crop&auto=format',
      categoryId: 2,
      rating: 4.8,
      isAvailable: true
    },
    {
      id: 3,
      name: 'Tomato Soup',
      price: 180,
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&auto=format',
      categoryId: 3,
      rating: 4.2,
      isAvailable: true
    },
    {
      id: 4,
      name: 'White Sauce Pasta',
      price: 225,
      imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop&auto=format',
      categoryId: 4,
      rating: 4.6,
      isAvailable: true
    },
    {
      id: 5,
      name: 'Veg Noodles',
      price: 210,
      imageUrl: 'https://images.unsplash.com/photo-1589308078055-918f6f7e6c08?w=400&h=300&fit=crop&auto=format',
      categoryId: 1,
      rating: 4.3,
      isAvailable: true
    },
    {
      id: 6,
      name: 'Pizza',
      price: 300,
      imageUrl: 'https://images.unsplash.com/photo-1548365328-5e9c7f9f38a6?w=400&h=300&fit=crop&auto=format',
      categoryId: 5,
      rating: 4.7,
      isAvailable: true
    }
  ];

  addToCart(item: any) {
    console.log("Added to cart:", item);
    alert(item.name + " added to cart!");
  }

  handleImageError(event: any) {
    // Fallback to a local SVG placeholder if Unsplash fails
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZWVlZSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkZvb2QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
  }
}
