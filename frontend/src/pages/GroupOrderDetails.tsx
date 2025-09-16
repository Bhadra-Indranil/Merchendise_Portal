import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { required, positiveNumber } from '../lib/validate';

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  images?: string[];
};

type GroupOrderItem = {
  productId: Product; // Populated product
  quantityGoal: number;
  unitPrice: number;
  variants?: { name: string; value: string }[];
};

type GroupOrder = {
  _id: string;
  name: string;
  department?: string;
  status: string;
  deadline?: string;
  note?: string;
  createdBy: {
    name: string;
  };
  participants: string[]; // Array of user IDs
  createdAt: string;
  uniqueCode: string;
  collectedAmount: number;
  totalQuantityCollected: number;
  products: GroupOrderItem[];
};

export default function GroupOrderDetails() {
  return <div>Group Order Details</div>;
}
