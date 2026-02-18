import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent {
  cartItems = [
    {
      name: 'Hakka Chicken Masala',
      price: 330,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1604908812853-0ef2a2b9e1b4?w=400&h=300&fit=crop&auto=format'
    },
    {
      name: 'Chicken Biryani',
      price: 295,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1604908177522-402b5a7d5f5a?w=400&h=300&fit=crop&auto=format'
    },
    {
      name: 'Biscoff Waffle',
      price: 300,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6b1d?w=400&h=300&fit=crop&auto=format'
    },
    {
      name: 'Carlsberg',
      price: 230,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=400&h=300&fit=crop&auto=format'
    }
  ];

  increase(item: any) {
    item.quantity++;
  }

  decrease(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  clearCart() {
    this.cartItems = [];
  }

  getTotal() {
    return this.cartItems.reduce((total, item) =>
      total + (item.price * item.quantity), 0);
  }
}
