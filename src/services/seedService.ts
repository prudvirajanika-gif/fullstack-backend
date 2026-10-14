import { CategoryModel } from '../models/Category.js';
import { FoodModel } from '../models/Food.js';
import { UserModel } from '../models/User.js';
import { OrderModel } from '../models/Order.js';
import { getDbStatus } from '../config/db.js';

export const IN_MEMORY_STORE = {
  categories: [
    { id: 'cat-1', name: 'Biryani & Rice', description: 'Aromatic Dum Biryanis and specialty rice bowls' },
    { id: 'cat-2', name: 'Curries & Gravies', description: 'Rich North & South Indian regional curries' },
    { id: 'cat-3', name: 'Tandoor & Starters', description: 'Clay-oven roasted kebabs and crisp appetizers' },
    { id: 'cat-4', name: 'Breads & Accompaniments', description: 'Fresh Naan, Roti, and Parathas' },
    { id: 'cat-5', name: 'Desserts & Beverages', description: 'Authentic Indian sweets and refreshing drinks' },
  ],
  foods: [
    {
      id: 'f-1',
      name: 'Hyderabadi Chicken Dum Biryani',
      description: 'Fragrant basmati rice layered with spiced marinated chicken, saffron milk, and fried onions.',
      price: 349,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
      categoryId: 'cat-1',
      categoryName: 'Biryani & Rice',
      available: true,
      isVeg: false,
      rating: 4.8,
      preparationTimeMin: 25,
      stockQuantity: 100,
    },
    {
      id: 'f-2',
      name: 'Paneer Butter Masala',
      description: 'Fresh cottage cheese cubes simmered in a creamy, buttery tomato-cashew gravy.',
      price: 289,
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop',
      categoryId: 'cat-2',
      categoryName: 'Curries & Gravies',
      available: true,
      isVeg: true,
      rating: 4.7,
      preparationTimeMin: 20,
      stockQuantity: 80,
    },
    {
      id: 'f-3',
      name: 'Tandoori Murgh (Half)',
      description: 'Tender chicken marinated in Kashmiri chili, hung curd, and stone-ground spices roasted in tandoor.',
      price: 299,
      imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop',
      categoryId: 'cat-3',
      categoryName: 'Tandoor & Starters',
      available: true,
      isVeg: false,
      rating: 4.9,
      preparationTimeMin: 30,
      stockQuantity: 50,
    },
    {
      id: 'f-4',
      name: 'Dal Makhani Heritage',
      description: 'Slow-cooked whole black lentils simmered overnight with cream, butter, and mild spices.',
      price: 239,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop',
      categoryId: 'cat-2',
      categoryName: 'Curries & Gravies',
      available: true,
      isVeg: true,
      rating: 4.6,
      preparationTimeMin: 15,
      stockQuantity: 120,
    },
    {
      id: 'f-5',
      name: 'Butter Garlic Naan (2 pcs)',
      description: 'Soft leavened tandoori flatbread brushed with garlic butter and fresh coriander.',
      price: 99,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop',
      categoryId: 'cat-4',
      categoryName: 'Breads & Accompaniments',
      available: true,
      isVeg: true,
      rating: 4.8,
      preparationTimeMin: 10,
      stockQuantity: 200,
    },
    {
      id: 'f-6',
      name: 'Gulab Jamun with Rabri (2 pcs)',
      description: 'Deep-fried milk dumplings soaked in cardamom saffron syrup served over chilled thick rabri.',
      price: 149,
      imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop',
      categoryId: 'cat-5',
      categoryName: 'Desserts & Beverages',
      available: true,
      isVeg: true,
      rating: 4.9,
      preparationTimeMin: 10,
      stockQuantity: 90,
    },
  ],
  orders: [
    {
      id: 'ORD-7821',
      customerName: 'Prudvi Raj',
      customerPhone: '+91 98765 43210',
      deliveryAddress: 'Flat 402, Royal Palms, Indiranagar, Bengaluru, 560038',
      items: [
        { foodId: 'f-1', name: 'Hyderabadi Chicken Dum Biryani', price: 349, quantity: 2 },
        { foodId: 'f-5', name: 'Butter Garlic Naan (2 pcs)', price: 99, quantity: 1 },
      ],
      subtotal: 797,
      gstTax: 39.85,
      deliveryFee: 0,
      totalAmount: 836.85,
      status: 'PREPARING',
      paymentMethod: 'ONLINE',
      otp: '4921',
      createdAt: new Date().toISOString(),
      notes: 'Please provide extra mint chutney and lemon wedges.',
    },
  ] as any[],
};

export async function seedInitialData(): Promise<void> {
  const { isConnected } = getDbStatus();
  if (!isConnected) {
    console.log('[Seed] Running with in-memory seed catalog.');
    return;
  }

  try {
    const categoryCount = await CategoryModel.countDocuments();
    if (categoryCount === 0) {
      console.log('[Seed] Seeding default categories and foods into MongoDB...');
      const createdCategories = await CategoryModel.insertMany(
        IN_MEMORY_STORE.categories.map((c) => ({
          name: c.name,
          description: c.description,
        }))
      );

      const categoryMap = new Map(createdCategories.map((c) => [c.name, c._id]));

      const foodsWithIds = IN_MEMORY_STORE.foods.map((f) => ({
        ...f,
        categoryId: categoryMap.get(f.categoryName) || createdCategories[0]._id,
      }));

      await FoodModel.insertMany(foodsWithIds);
      console.log('[Seed] Database seeded successfully.');
    }
  } catch (err: any) {
    console.warn('[Seed] Seed operation skipped:', err.message);
  }
}
